# Feature: a catalog switch never dead-ends on a 404

## Status: implemented
## Page/Component: `src/contexts/CatalogContext.tsx`, `src/sdk/catalogSwitch.ts`,
## `app/[locale]/category/[code]/{layout,page}.tsx`, `app/[locale]/product/[sku]/{layout,page}.tsx`

Switching catalog keeps the visitor on the same page: `goToLocalizedCatalog()` replaces segment 1
of the path and navigates, so `/com_fr/category/cat_2` becomes `/en_en/category/cat_2`. But a
category id and a SKU belong to one catalog, so the target usually does not exist there and the
route answered 404. That is the wrong answer to "show me the other catalog": the page did not
disappear, it moved.

Now the switch marks its own navigation and the route redirects to the new catalog's default
listing. Everything else still gets a real 404.

## Behaviour (testable)
- [x] A missing category with a valid switch marker answers **307** to
      `/{locale}/category/{first root category}` - verified:
      `GET /com_fr/category/cat_9999?from=com_en` -> `307` to `/example/com_fr/category/cat_2`.
- [x] A missing SKU with a valid marker does the same - `GET /com_fr/product/NOPE-SKU?from=com_en`
      -> `307` to the same listing.
- [x] The same URLs **without** the marker still answer `404`.
- [x] An invalid marker (`?from=not_a_catalog`) answers `404`, not a redirect.
- [x] A category that does exist renders `200` whether or not the marker is present.
- [x] An unknown locale segment (`/example/nope`) still answers `404`.
- [ ] Clicking the catalog selector on a category and on a product page - the marker is built in
      `CatalogContext` and type-checks, but the click path was NOT exercised in a browser. The
      server half of it is covered by the curl checks above.

## How the marker works
`goToLocalizedCatalog()` appends `?from=<previous locale code>`, and only when the current path is
`/category/...` or `/product/...` - the two routes whose URL names a per-catalog id. Home, blog,
cart and search exist in every catalog and keep a clean URL.

`missingInCatalog()` in `src/sdk/catalogSwitch.ts` is the single decision point, called from both
routes:

```
marked and valid -> redirect() to this catalog's default listing
anything else    -> notFound()
```

"Valid" means `from` names a localized catalog that really exists (`resolveLocale(from)`) and is
not the current one. Without that check, appending `?from=whatever` to any junk URL would turn a
404 into a 200 elsewhere - the soft-404 `feature-locale-segment-phase2.md` forbids. The check is
free: `resolveLocale` is `cache()`d and the catalog list is already in memory for the request.

The destination comes from `defaultListingPath()` in `src/sdk/categoryTree.ts`, which the header's
Products tab now reads too, so the tab and the fallback cannot name different destinations.

## Why the existence check moved out of the guard layouts
Both guards used to call `notFound()` themselves. They cannot, now: the decision depends on the
marker, and **Next does not give a layout its search params** - *"Layouts do not rerender on
navigation, so they cannot access search params which would otherwise become stale"*
(`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`). The check
therefore lives in `page.tsx` and its `generateMetadata`, both of which receive `searchParams`.

Nothing is lost by the move. The reason the check was in the layout was to set a real 404 status
before the response flushed; `generateMetadata` also resolves before the flush, and this app has no
`loading.tsx` and no Suspense boundary left (`bugfix-ssr-product-list-behind-suspense.md`). The
curl checks above are the proof: the unmarked cases still answer 404, not a 200 with 404 UI.

What the guards keep: the locale check, and the `cache()`d fetch that warms the page's own data.

## The approach that did not work, and why it is recorded here
The first build used a `not-found.tsx` boundary: keep every `notFound()` where it was, add
`app/[locale]/not-found.tsx`, and let a client component read the marker and redirect. The Next
runtime says that should work - a segment's boundary renders in place of its `{children}`, inside
its own layout.

**It never fired.** Every 404 under `/example/{locale}/...` kept rendering Next's default page,
with no app header in the HTML and no compile of the boundary in the dev server log, after a full
container restart. It was not a metadata-vs-body ordering problem either: `cms/[slug]` throws from
its page body, not from `generateMetadata`, and behaved the same. A `not-found.tsx` inside the
top-level dynamic segment `app/[locale]` is simply not reached here.

Worth knowing before someone tries it again: the app still has **no custom 404 page**, and adding
one means either `app/not-found.tsx` at the root or the experimental `global-not-found.js`, not a
file under `[locale]`.

## SDK contract used
No request change. `resolveLocale` and `cachedCategoryTree` from `src/sdk/server.ts`, both already
`cache()`d per request.

## Tracking (required)
None added or changed.

## UI constraints
No UI. The redirect is a server response; nothing renders in between.

## Known cost
A successful switch from a category or product page leaves `?from=com_fr` in the URL. Nothing reads
it except `missingInCatalog`, and it only appears on client-side navigation, so no crawler sees it.
Stripping it would cost an extra navigation on every switch, which is the worse trade.

## MUST NOT change
- **The marker stays validated against the catalog list.** An unchecked `?from=` is a soft-404
  generator, and the whole point of marking is that a *direct* visit to a junk URL still 404s.
- **Do not move the existence check back into either guard layout.** A layout cannot read the
  marker, so the check there would 404 before the redirect could happen - the exact bug this
  fixes.
- Both `page.tsx` and its `generateMetadata` must keep calling `missingInCatalog`. They are
  reached in different orders depending on streaming, and disagreeing would mean a redirect in one
  and a 404 in the other.
- **Do not add `loading.tsx` or a Suspense boundary above these routes** without re-checking the
  status codes: a streamed response cannot set 404 after the fact, which is what
  `bugfix-ssr-product-list-behind-suspense.md` is about.
- `defaultListingPath()` stays the one definition of the default listing, read by both the header
  tab and the redirect.
