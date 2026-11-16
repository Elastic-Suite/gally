---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Keep demo scaffolding off the server with a mounted gate

## Context and Problem Statement

This decision is older than this ADR. Commit `43f5c64e` (2026-08-07) made it, and it is recorded
in `bugfix-dynamic-ssr-false-bailout.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-dynamic-ssr-false-bailout.md`). It
replaces
[2026-11-13-keep-demo-scaffolding-out-of-server-html-with-ssr-false.md](2026-11-13-keep-demo-scaffolding-out-of-server-html-with-ssr-false.md).

`AppShell.tsx` loaded the five demo components with `dynamic(..., { ssr: false })`. That flag
does not skip the server render. The component throws `BailoutToCSR` on the server, and a
`<Suspense>` that `next/dynamic` adds catches it.

Nothing was broken: the storefront HTML was complete. The cost was the stack trace Next writes
into each dev response for its error overlay. On `/example/com_fr/product/VP01` that was four
bailout templates, 47,530 bytes, 59% of an 80,017-byte document.

How do we keep the scaffolding out of the server HTML without the throw?

## Considered Options

-   Keep `ssr: false`
-   Render the scaffolding only after mount, with a `useMounted` gate

## Decision Outcome

Chosen option: "Render the scaffolding only after mount", because it keeps the same intent
without throwing.

`src/hooks/useMounted.ts` returns `false` on the server and on the first client render, and
`true` from the first effect. `AppShell` renders the scaffolding inside `{mounted && ...}`.
`dynamic()` stays, for the code split. `SearchOverlay.tsx` uses the same hook for its portal.

### Consequences

-   Good, because the same response fell from 80,017 to 32,711 bytes, with the storefront content
    unchanged.
-   Good, because both sides render the same thing on the first pass, so there is no hydration
    mismatch.
-   Bad, because `ssr: false` looks like the more explicit spelling, so a reader may put it back.
-   Neutral, because the scaffolding still mounts after hydration, as it did with `ssr: false`.
    That it appears after hydration was reasoned, not observed: headless Chromium in the `e2e`
    container could not hydrate the page.

### Confirmation

-   `grep -rnE 'ssr:\s*false' front/example-app/src front/example-app/app` finds only comments,
    in `AppShell.tsx` and `useMounted.ts`.
-   In the server HTML of a product page, `BAILOUT_TO_CLIENT_SIDE_RENDERING` and
    `event-log-toggle` both appear 0 times.
-   `useMounted` sets its state in `useEffect`, not in a layout effect or during render.

## Pros and Cons of the Options

### Keep `ssr: false`

-   Good, because it keeps the scaffolding out of the server HTML.
-   Bad, because it adds about 47 KB of traces to every dev response.

## More Information

Line 103 of [feature-rsc-shells-phase3.md](../../specs/feature-rsc-shells-phase3.md) still says
to keep the scaffolding "behind `ssr: false`". The intent of that line holds; the mechanism is
this ADR's.
