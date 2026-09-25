# Feature: Gally public configuration, fetched in SSR

## Status: implemented
## Page/Component: app/[locale]/layout.tsx, src/sdk/server.ts, src/sdk/config.ts, src/contexts/ConfigContext.tsx

## Why
The media host was hardcoded (`MEDIA_BASE_URL = 'https://gally.localhost/media/catalog/product'` in
`src/sdk/index.ts`) and concatenated with no slash handling. The admin reads the same value from the
Gally setting `gally.base_url.media`, which comes from `GALLY_CATALOG_MEDIA_URL` and can be
overridden per localized catalog. The storefront now reads Gally's public configuration the same
way, so a different host, or a per-catalog override, needs no code change.

## Behaviour (testable)
- [x] `fetchPublicConfiguration(localizedCatalogCode)` (`src/sdk/server.ts`) calls
      `GET /public_configurations?localizedCatalogCode=<code>` and returns a `path -> value` map. It
      is `cache()`d, so the layout, the page body and `generateMetadata` share one request per render.
- [x] `app/[locale]/layout.tsx` fetches it next to the category tree and axis labels, and passes it
      to `ConfigProvider` through `app/providers.tsx`.
- [ ] A catalog switch is a navigation to a new `[locale]` segment, which re-runs the layout, so the
      config always matches the catalog on screen.
- [ ] `mediaUrl(config, path)` (`src/sdk/config.ts`) joins the base and the document path with
      exactly one slash, takes the first item of an array value (the `default` catalog stores some
      images as a one-item array), keeps an absolute URL as is, and returns `''` for no image.
- [ ] If the endpoint fails, the map is empty and `mediaUrl` falls back to
      `https://gally.localhost/media/catalog/product/`.
- [x] Server pages pass the awaited config to `getProductFields` / `getCmsFields`. Client
      components pass `useGallyConfig()`, or use `useMediaUrl()`.
- [x] The server-rendered HTML (`<img>`, `og:image`, JSON-LD) already carries the configured host.

Verified 2026-09-25 on the dev stack: `tsc --noEmit` passes; home, category, product, blog, search
and vector search return 200 with no errors in the example log; the product page `<img>`, `og:image`
and JSON-LD carry `https://gally.localhost/media/catalog/product/default/v/a/va19-go_main.jpg` (single
slash, image returns 200). Not verified: a per-catalog override in the admin, the fallback when the
endpoint fails, the one-request-per-render count, and an array-valued `image`.

## SDK contract used
- No SDK call: a plain `fetch` to the public, token-free `public_configurations` endpoint, with
  `Accept: application/ld+json`, the same way `src/sdk/catalogs.ts` fetches catalogs. The response
  is `hydra:member: [{ path, value, scopeType }]`.

## Tracking (required)
- None added or changed.

## UI constraints
- No visual change. Image URLs only.

## MUST NOT change
- No hardcoded media host anywhere in `src/` or `app/`.
- `getProductFields` and `getCmsFields` stay pure and take `config` as an argument, so server pages
  and client components call the same function. Do not read context inside them.
- `.map(getCmsFields)` must not come back point-free: `map` would pass the array index as `config`.
- `src/sdk/config.ts` stays free of React and fetch, because client components import it.
