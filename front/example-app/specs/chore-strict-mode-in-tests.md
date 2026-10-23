# Chore: React strict mode moves from the dev server to the tests

## Status: implemented

## Page/Component: next.config.js, src/test/remount.test.tsx, src/test/remount-pages.test.tsx

## Why

`reactStrictMode: true` made every component mount, unmount and mount again in development, so each
effect ran twice. That is a useful check - an effect that does not clean up after itself shows up -
but in the browser it doubled every request that has no server seed (the blog search on `/search`
went out twice) and made the network panel and the tracking look buggy when they were not. Decided
2026-10-23: off in the dev server, on in a dedicated set of tests instead.

## Behaviour (testable)

-   [x] `next.config.js` has `reactStrictMode: false`, with a comment pointing here.
-   [x] Testing Library's per-call option (`render(ui, { reactStrictMode: true })`, also on
        `renderHook`) runs these checks in strict mode, and only these:
    -   `useSearch` / `useCmsSearch` with a server seed send no request;
    -   `useSearch` without a seed ends settled, with its one result, whatever the double mount sends;
    -   the cart loads its saved lines once; an add gives one line and one ADD_TO_CART;
    -   the navigation indicator still shows after 150 ms, clears, and leaves no timer behind;
    -   a navigation that ends before 150 ms leaves no timer either - a leftover one would make the
        next indicator appear at once;
    -   the "added" flash and the slider each fire their timer once and leave none behind;
    -   the search and category pages send exactly one event per change - SEARCH or VIEW, and
        DISPLAY - never doubled (`remount-pages.test.tsx`).
-   [x] Every other test renders normally, as before.

## MUST NOT change

-   A new effect with a timer, a subscription or a request gets a case in `remount.test.tsx` or
    `remount-pages.test.tsx`: these files are the only place strict mode still runs.
-   Turning strict mode back on in `next.config.js` is fine; then this file's "Why" no longer applies,
    and the remount tests stay as they are.
