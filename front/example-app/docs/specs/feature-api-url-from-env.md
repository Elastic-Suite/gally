# Feature: API URL from the environment

## Status: implemented

## Page/Component: src/sdk/index.ts (`getBaseUri()`), every module that calls the API

## Problem

The API URL was hardcoded (`https://gally.localhost/api` for the browser, `http://router/api`
for the server). A first attempt moved it to `serverRuntimeConfig` / `publicRuntimeConfig` in
`next.config.js`, read with `getConfig()` from `next/config`. Next 16 removed runtime config:
`getConfig()` returns `undefined`, so the destructure threw
`Cannot destructure property 'serverRuntimeConfig' ... as it is undefined`. The App Router
never supported runtime config, even in Next 15.

## Behaviour (testable)

-   [x] `getBaseUri()` in `src/sdk/index.ts` is the only source of the API URL. Nothing builds a
        URL from a module-level constant: every caller asks at request time.
-   [x] Browser: `process.env.NEXT_PUBLIC_API_URL`, the public API URL, default
        `https://gally.localhost/api`. Next writes it into the bundles when it builds (at
        `next dev` start in dev). Verified in a headless browser: every API call goes to
        `https://gally.localhost/api/graphql`, none over `http:` or to `router`.
-   [x] Server: `process.env.SSR_API_URL` when set, read at runtime, else the public URL.
-   [x] Dev sets `SSR_API_URL=http://router/api`: `gally.localhost` is 127.0.0.1 inside the
        container, so the server goes through the router on the compose network. Verified: the
        category page arrives from the server (`curl`, no JavaScript) with 20 cards.
-   [x] Int does not set `SSR_API_URL`: the server calls the public URL, resolved through public
        DNS (no `extra_hosts` on `pwa`). `compose.int.yml` sets `NODE_TLS_REJECT_UNAUTHORIZED=0` on
        `pwa`, so Node skips the certificate check for every outgoing HTTPS call from that
        container, the admin's included. Verified only locally, see below.
-   [x] Images and page URLs stay public: images use the media base from the API's public
        configuration (`mediaUrl(config)`), pages use `SITE` in `seo.ts`. Verified: image origin
        `https://gally.localhost`.
-   [x] The SDK `Configuration` is built lazily in `getClient()`, not at module load.
-   [x] `compose.override.yml` passes `SERVER_NAME`, `NEXT_PUBLIC_API_URL` and `SSR_API_URL` to
        the `example` service. `next.config.js` uses `SERVER_NAME` for `allowedDevOrigins`. In int,
        `compose.yml` already passes `NEXT_PUBLIC_API_URL=https://${SERVER_NAME}/api` to `pwa`, as a
        build arg and as env.
-   [x] Server calls through the router send `Host: router`, so `router` is in Symfony's
        `TRUSTED_HOSTS` in `compose.override.yml` only: only dev sets `SSR_API_URL` to the
        router. Add it back wherever another environment does the same. Without it Symfony
        rejects the call, `src/sdk/server.ts` swallows the error, and pages silently fall back to
        loading in the browser. (In dev the pattern starts with a bare `^` when `SERVER_NAME` is
        unset, which already accepts every host; the entry is there for when it is set.)
-   [x] `app/page.tsx` (the `/` redirect to the default catalog) calls `await connection()` from
        `next/server` before fetching. `next build` then leaves it out of prerendering: the API is
        not reachable during a docker build, and the redirect must follow the live catalogs.
        Verified in dev: `/example` returns 307 to `/example/com_fr`.

## Where the app runs

-   **Dev** (`compose.override.yml`): own `example` container, `next dev` on 3001. The router
    sends `/example` there (`EXAMPLE_UPSTREAM=example:3001`).
-   **Int** (`compose.yml` + `compose.int.yml`): no separate container. The `pwa` image
    (`gally_pwa_int` in `docker/front/Dockerfile`) builds the admin, the SDK and the example app,
    then runs `yarn start:int` (`front/package.json`): `concurrently --kill-others` starts the
    admin on 3000 and the example app (`next start -p 3001`, script `serve`) on 3001. The router
    sends `/example` to `pwa:3001`. `--kill-others` stops the container when either app dies, so
    Docker restarts both instead of leaving one running.
    -   [x] Int image builds and both servers start (local `docker build` of `gally_pwa_int`, no
            API attached): admin 200 on 3000, example app listening on 3001. Killing the example
            server exits the container within 2 s. In the build's route table only `/_not-found`
            is static; `/` is dynamic.
    -   [x] Int image against the local stack, built with
            `NEXT_PUBLIC_API_URL=https://gally.e2e:4430/api` and run under the `example` network
            alias with `--add-host gally.e2e:host-gateway`: server and browser both call that URL.
            Checked with a temporary log in `getBaseUri()` (removed since), 20 cards in the server
            HTML, and the browser calling only `https://gally.e2e:4430/api/graphql`. This run also needed
            `-e NODE_TLS_REJECT_UNAUTHORIZED=0`, because the local proxy certificate is
            self-signed for `gally.localhost`.
    -   [ ] Real int deploy: only checkable on the int server.
-   **CI** (`compose.yml` + `compose.ci.yml`): an `example` container runs `next dev`, but the
    router still sends `/example` to `pwa:3000`. Nothing in CI tests the example app for now, so
    this is left as is on purpose.

The int stage used to copy a static CRA build into the admin
(`mv example-app/build pwa/public/example`). That cannot work any more: `next build` writes
`.next/`, and the pages fetch from the API per request.

## SDK contract used

-   `Client`, `SearchManager`, `RecommenderManager`, `TrackingEventManager` all get
    `baseUri: getBaseUri()`.

## Tracking (required)

-   No change. The tracker uses the same base URI as before.

## UI constraints

-   None, no UI change.

## MUST NOT change

-   Do not bring back `next/config` / runtime config: it no longer exists in Next 16.
-   Keep `process.env.NEXT_PUBLIC_API_URL` written literally. Next replaces that exact expression
    in the bundles; destructuring `process.env` leaves it `undefined`. It is fixed when the app is
    built (at `next dev` start in dev), so changing it needs a rebuild, not just a restart.
-   Env URLs carry their scheme (`http://...`). A protocol-relative `//host/api` fails in Node
    `fetch` on the server.
-   `SSR_API_URL` stays server-only: no `NEXT_PUBLIC_` prefix, so it never reaches the browser
    bundle. Locally it must be set: without it the server calls `gally.localhost`, which is
    127.0.0.1 inside the container, and every server fetch dies with ECONNREFUSED.
-   Keep `router` in `TRUSTED_HOSTS` wherever the server goes through it.
-   `NODE_TLS_REJECT_UNAUTHORIZED=0` is set in `compose.int.yml` only, on `pwa`. Do not add it to
    `compose.override.yml` (dev goes through `http://router`) or to any production setup.
-   `getBaseUri()` is for fetching only. Never write a URL built from it into HTML (image `src`,
    link): it is the API, not the storefront, and it can point at another host than the
    storefront. Image URLs come from `mediaUrl(config)`, page URLs from `SITE` in `seo.ts`.
-   No API call may run during `next build`. A server page that fetches outside a dynamic
    `[locale]` segment must call `await connection()` first. Prefer it to
    `export const dynamic = 'force-dynamic'`, which Next 16 turns into a build error once
    `cacheComponents` is enabled.
-   `connection()` does not check that the API is up. If the API does not answer at request time,
    `fetchCatalogs()` throws and `/example` returns an error page, as before.
-   `src/sdk/seo.ts` reads `PUBLIC_URL` (dev: compose env; int: the `public_url` build arg) and
    stays server-only: in the browser the variable is undefined. `PUBLIC_URL` already ends with
    `/example`, so never append it again.
