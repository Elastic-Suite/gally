---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Pick the API URL by environment: SSR_API_URL on the server, NEXT_PUBLIC_API_URL in the browser

## Context and Problem Statement

This decision is older than this ADR. Commit `43f5c64e` (2026-08-07) first split the URL
between server and browser, recorded in
[feature-locale-segment-phase2.md](../../specs/feature-locale-segment-phase2.md). Commit
`daeab237` (2026-10-19) moved both URLs to the environment, and commit `c7d31a45`
(2026-10-20) made the server URL optional. Both are recorded in
[feature-api-url-from-env.md](../../specs/feature-api-url-from-env.md).

Pages now fetch from the API on the server. Inside the `example` container,
`gally.localhost` resolves to 127.0.0.1, where nothing listens. A server fetch to the public
URL dies with `ECONNREFUSED`. The browser, on the other hand, must use the public URL.

Which URL does each side call, and where does it come from?

## Decision Drivers

-   Server rendering must reach the API from inside the container.
-   The browser must only call the public URL.
-   Each environment (dev, int) sets its own URLs without a code change.

## Considered Options

-   Server calls the public URL `https://gally.localhost/api`
-   Server calls `http://php`
-   Server calls `http://router/api`
-   Read the URLs with `next/config` runtime config
-   Read the URLs from `process.env` in `getBaseUri()`

## Decision Outcome

Chosen option: "Read the URLs from `process.env` in `getBaseUri()`", with the server going
through the router locally, because it is the only setup that was measured to work, both in
dev and in the int image run against the local stack. A real int deploy is not checked yet.

`getBaseUri()` in `src/sdk/index.ts` is the only source of the API URL. The browser uses
`NEXT_PUBLIC_API_URL`. The server uses `SSR_API_URL` when set, else the public URL. Dev sets
`SSR_API_URL=http://router/api`. Int does not set it.

Image and page URLs never come from `getBaseUri()`. Images use the media host from Gally's
public configuration, and pages use `SITE` in `src/sdk/seo.ts`.

### Consequences

-   Good, because dev and int differ only in environment variables.
-   Bad, because `NEXT_PUBLIC_API_URL` is fixed at build time. Changing it needs a rebuild.
-   Bad, because calls through the router send `Host: router`, so `router` must be in Symfony's
    `TRUSTED_HOSTS`. Without it pages fall back to loading in the browser, with no error shown.
-   Bad, because locally, removing `SSR_API_URL` breaks all server rendering.

### Confirmation

-   `grep -rn "gally.localhost/api\|router/api" src app` finds only `src/sdk/index.ts`:
    the default in `getBaseUri()` and its comment.
-   With the dev stack up, `curl` of a category page returns 20 product cards in the HTML.
-   In a browser, every API call goes to the public URL, none to `router`.

## Pros and Cons of the Options

### Server calls the public URL

-   Bad, because inside the container it is 127.0.0.1. Measured: `ECONNREFUSED`.
-   Neutral, because int is expected to do exactly this, through public DNS. That was not
    checked on a real int deploy: the spec only ran the int image locally, with `--add-host`.

### Server calls `http://php`

-   Bad, because the connection was refused when tried.

### Server calls `http://router/api`

-   Good, because the router serves the same API on the compose network. `varnish` also worked.

### Read the URLs with `next/config` runtime config

-   Bad, because Next 16 removed it. `getConfig()` returned `undefined` and the page threw.
    The App Router never supported it.
