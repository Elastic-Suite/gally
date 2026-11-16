---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Read media host and installed bundles from Gally at request time

## Context and Problem Statement

This decision is older than this ADR. Commit `7a23a6ce` (2026-09-25) added the public
configuration, recorded in
[feature-public-configuration.md](../../specs/feature-public-configuration.md). Commit
`ca601c66` (2026-10-05) added the bundle list, recorded in
[feature-sdk-bundles.md](../../specs/feature-sdk-bundles.md).

The media host was hard-coded as `MEDIA_BASE_URL` in `src/sdk/index.ts`. The admin reads the
same value from the Gally setting `gally.base_url.media`, which can be overridden per
localized catalog. The storefront could not follow a different host or an override.

The SDK also needs the list of installed Gally bundles. It asks for `termSuggestions` in
autocomplete only when `GallyTermSuggestionBundle` is installed.

Where does the storefront get values that depend on the Gally install?

## Decision Drivers

-   A different media host, or a per-catalog override, must need no code change.
-   Read the setting the same way the admin does.
-   Server-rendered HTML (`<img>`, `og:image`, JSON-LD) must already carry the right host.

## Considered Options

-   Keep the hard-coded `MEDIA_BASE_URL`
-   Read the configuration from Gally

No alternative was recorded for the bundle list.

## Decision Outcome

Chosen option: "Read the configuration from Gally", because the admin already reads the same
setting, and a hard-coded host cannot follow a per-catalog override.

-   `fetchPublicConfiguration()` in `src/sdk/server.ts` is a plain `fetch` to the public,
    token-free `public_configurations` endpoint. It is wrapped in `cache()`, so the layout, the
    page and `generateMetadata` share one request per render. `mediaUrl(config, path)` builds
    image URLs.
-   The locale layout fetches the bundle list on the server. `Providers` passes it to
    `setBundles()` before any child renders, so the first `getSearchManager()` has it.
-   Server searches in `src/sdk/server.ts` are never autocomplete. They never wait for the
    bundle list.

### Consequences

-   Good, because the config follows the catalog: a catalog switch is a navigation, which
    re-runs the layout.
-   Good, because without the term suggestion bundle, autocomplete should not ask for a field
    the API lacks. The spec leaves this check unticked, so it is not verified.
-   Bad, because each render makes one more API call for the configuration.
-   Bad, because the spec keeps the bundle list until the Next server restarts. A bundle installed
    later is not seen until then.

### Confirmation

-   `grep -rn "media/catalog/product" src app` finds only the fallback in `src/sdk/config.ts`.
-   On a product page, `curl` shows `<img>` and `og:image` using the configured media host.
-   `grep -n fetchBundles src/sdk/server.ts` finds nothing.
