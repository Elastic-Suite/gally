# Feature: locale segment in the URL + server-side catalog resolution — Phase 2

## Status: implemented (interactive checks pending — see Verification)
## Page/Component: `app/[locale]/**`, `src/contexts/CatalogContext.tsx`, `src/contexts/LocaleContext.tsx`

Phase 2 of `plan-ssr-seo.md`, on top of `feature-nextjs-migration-phase1.md`. The URL's first
segment is now the **localized-catalog code** (`com_fr`, `com_en`, `fr_fr`, `fr_en`, `en_fr`,
`en_en`), so one segment identifies both the catalog and the language, and the server can resolve
both *before* anything renders.

Still no `generateMetadata()` and no JSON-LD — that is Phase 3. But this is the phase that makes
them possible: a crawler now receives a page that already knows its catalog, currency and language.

## Behaviour (testable)
- [x] `/example` → 307 to `/example/com_fr` (the default localized catalog, the same one the SPA
      used to pick on mount: first catalog → its `isDefault` localized catalog)
- [x] All routes work under every locale: `/com_fr`, `/com_en`, `/com_fr/search?q=dress`,
      `/com_fr/cart`, `/com_fr/blog`, `/com_en/product/VD10`, `/com_fr/category/2`, `/en_en/product/VD10`
- [x] **An unknown segment 404s** (`/example/nope`) rather than silently falling back
- [x] **Language is resolved server-side, verified with JS disabled** — plain `curl` of
      `/com_fr/cart` returns `<h1>Votre Panier</h1>`, `/com_en/cart` returns `<h1>Your Cart</h1>`
- [x] Every in-app link carries the segment: `href="/example/com_fr/product/..."`, and
      `/example/_next/static` is untouched
- [x] No hydration mismatch; `npx tsc --noEmit` clean
- [ ] Catalog/localized-catalog selectors switch catalog **and stay on the current page** — wired
      and type-checked, NOT clicked in a real browser
- [ ] Guided demo navigation under the locale segment — NOT verified interactively
- [ ] Tracking still fires — NOT verified (inherited gap from Phase 1)

## SDK contract used
Unchanged query shapes. Two additions:

**The server cannot use the public base URI.** Inside the `example` container `gally.localhost`
resolves to 127.0.0.1, where nothing listens, so a server-side `fetch` dies with `ECONNREFUSED`.
`src/sdk/index.ts` now picks the base URI by environment: the browser keeps
`https://gally.localhost/api`; Node uses `http://router/api` (the router container serves the same
API over the compose network), overridable via `GALLY_INTERNAL_API_URL`. **This was measured, not
assumed** — `http://php` is refused; `router` and `varnish` both work. The default is hardcoded so
no compose or docker file had to change.

`src/sdk/catalogs.ts` gains `findLocalizedCatalog(catalogs, code)` and
`defaultLocalizedCatalog(catalogs)` — plain functions over an already-fetched list, so the same code
resolves a segment on the server and in the client without a second round trip.

## Tracking (required) — still unverified
No tracking code was touched in this phase either. The Phase 1 gap stands: confirm `VIEW` /
`SEARCH` / `ADD_TO_CART` in the in-app EventLog panel. Do it under a non-default locale
(`/com_en/...`) so a locale-related regression would show up.

## The architectural change: the URL owns the selection
`CatalogProvider` used to **own** catalog selection — mount with nothing, fetch the list in a
`useEffect`, pick a default, hold it in `useState`. Now `app/[locale]/layout.tsx` resolves it on the
server and passes it down as props, and selecting a catalog is a **navigation** that swaps the
locale segment while keeping the rest of the path (switch catalog on a product page, stay on that
product).

**Nothing in `CatalogProvider` is held in `useState` any more, and that is deliberate.** Next reuses
the layout instance across locale changes, so state seeded from props would silently go stale the
moment you switched catalog — the UI would keep showing the old catalog while the URL said
otherwise. Deriving straight from props makes that disagreement impossible.

`loadingCatalogs` is kept in the context type but is now always `false`; consumers' loading branches
simply never fire. `fetchCategoryTree` also moved server-side, so the category nav no longer pops in
after mount.

## The hydration trap this phase creates, and the fix
`I18nBridge` used to call `i18n.changeLanguage()` in a `useEffect`. An effect only runs on the
client after hydration, so for a `com_fr` URL the server would emit **English** and the client would
swap to French a moment later — a hydration mismatch on *every translated string on the page*.

It now calls `changeLanguage()` **during render**, on both server and client. All locale resources
are bundled statically in `src/i18n/index.ts`, so the call applies synchronously and both sides
render the same language on the first pass.

**Known caveat, accepted for a demo:** i18next is a module singleton, so on the server it is shared
across concurrent requests; two requests for different locales rendering at the same instant could
interleave. The real fix is a per-request i18next instance — worth doing if this ever serves
meaningful traffic.

## Known gap deferred to Phase 4
`app/layout.tsx` still hardcodes `<html lang="en">`, which is now wrong for every `*_fr` locale.
The root layout sits above `[locale]` and cannot see the segment, so fixing it means either
middleware plus promoting `app/[locale]/layout.tsx` to the root layout, or setting it from a
request header. Phase 4 owns `hreflang` and canonical URLs, and `lang` belongs with them.

## MUST NOT change
- **Never `import Link from 'next/link'` in a page or component.** Use
  `src/components/LocaleLink.tsx` (imported as `Link`, so JSX is unchanged). A raw `next/link` drops
  the locale segment and silently resets the visitor to the default catalog.
- For imperative navigation use `useLocaleHref()` from `src/contexts/LocaleContext.tsx`.
  **One exception:** `src/views/BlogPage.tsx` pushes `` `${pathname}?${params}` `` and `pathname`
  already contains the segment — prefixing it again would produce `/com_fr/com_fr/...`.
- **`withLocale()` must stay idempotent.** It is applied in more than one layer; making it blindly
  prepend would double the segment.
- **Unknown locale must keep 404-ing**, not fall back to the default. Silently serving different
  content under a wrong URL bakes in duplicate-content and soft-404 problems before the SEO phases
  even start.
- **Do not reintroduce `useState` into `CatalogProvider`** for the selected catalog — see above.
- The server/browser base-URI split in `src/sdk/index.ts` is load-bearing; collapsing it back to one
  URI breaks all server rendering with `ECONNREFUSED`.
