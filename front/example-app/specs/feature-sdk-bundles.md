# Feature: pass the installed Gally bundles to the SDK

## Status: implemented

## Page/Component: src/sdk/bundles.ts, src/sdk/index.ts, app/[locale]/layout.tsx, app/providers.tsx

## Behaviour (testable)

- [x] The locale layout fetches the bundle list on the server with `{ extraBundles { name } }`.
      This query is public, so no token is needed.
- [ ] The list is fetched once per Node process and kept in memory until the Next server restarts.
      A failed fetch is not kept: it returns `[]` and the next request tries again.
- [x] The list reaches the client as a `bundles` prop on `Providers`. `Providers` hands it to
      `setBundles()` before any child renders, so the first `getSearchManager()` call already has it.
- [x] `getSearchManager()` builds its `SearchManager` with `{ baseUri, bundles }`.
- [x] With `GallyTermSuggestionBundle` installed, autocomplete requests ask for `termSuggestions`
      and the "popular search terms" column fills in.
- [ ] Without that bundle, no query asks for `termSuggestions`, and the column shows its empty state
      instead of the query failing.

## SDK contract used

- `Configuration` option `bundles?: string[]` (gally-sdk, added after 2.3.0). The SDK adds
  `termSuggestions` to the query only when `isAutocomplete` is true and
  `GallyTermSuggestionBundle` is in `bundles`. This is the same rule as the PHP SDK.
- The `example` container resolves the SDK to the local `gally-admin/packages/sdk` through
  `front/node_modules`, so no release is needed for this app.

## Tracking (required)

- None. This changes no tracking event.

## UI constraints

- No UI change.

## MUST NOT change

- Server-side fetches keep going through `INTERNAL_BASE_URI` (`http://router/api`), never
  `gally.localhost`.
- Server-side searches in `src/sdk/server.ts` are never autocomplete, so they do not depend on the
  bundles. Do not make them wait on `fetchBundles()`.
- `getClient()` and `getTracker()` are unchanged.
