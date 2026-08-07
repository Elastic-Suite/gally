# Bugfix: `next/dynamic` `ssr: false` floods every dev response with BailoutToCSR traces

## Status: implemented
## Page/Component: src/components/AppShell.tsx, src/hooks/useMounted.ts (new), src/components/SearchOverlay.tsx

## Problem

Every server-rendered response logged, four times:

```
Error: Bail out to client-side rendering: next/dynamic
    at BailoutToCSR (.next/dev/server/chunks/ssr/_1g8_lic._.js:18881:37)
```

`AppShell.tsx` loaded the five demo components with `dynamic(..., { ssr: false })`. **That is not a
declarative flag — it is implemented by throwing.** During the server render the lazy component
throws `BailoutToCSR`; `next/dynamic` wraps each component in its own `<Suspense>`, which catches
it and renders the fallback. The served HTML proves the containment: `at BailoutToCSR … at Suspense
(<anonymous>)`, and the wrapper element came through as `<div class="expert-only"><!--$!--><template
data-dgst="BAILOUT_TO_CLIENT_SIDE_RENDERING" …>`.

**Nothing was broken** — SSR of the storefront was intact throughout, `<main>` content and all four
JSON-LD blocks included. The cost was the trace Next serializes into the HTML so its dev overlay can
show the error:

| | server HTML | bailout `<template>`s | their bytes |
|---|---|---|---|
| before | 80,017 B | 4 | 47,530 B (**59% of the document**) |
| after | 32,711 B | 0 | 0 |

Measured on `/example/com_fr/product/VP01`.

The wrong belief worth recording: that `ssr: false` *skips* the server render. It does not — it
performs one, throws, and relies on a boundary to catch it. Anything that expresses "not on the
server" without throwing is strictly cheaper.

Two notes on the error text itself. It points at
`nextjs.org/docs/messages/ppr-caught-error`, which documents a **different** failure — user code
catching a PPR dynamic-bailout in its own `try/catch`. This app has neither PPR enabled
(no `experimental.ppr` in `next.config.js`) nor any such catch, so that page's fix (`unstable_noStore`
before the try/catch) does not apply here.

## Fix

- New `src/hooks/useMounted.ts` — `false` on the server and on the first client render, `true` from
  the first effect. Gating on it cannot produce a hydration mismatch, because both sides render the
  same thing on pass one.
- `AppShell.tsx` drops `ssr: false` from all five `dynamic()` calls (`dynamic()` itself stays — the
  code split is still wanted) and renders the demo scaffolding inside `{mounted && …}`. Same intent,
  no throw.
- `SearchOverlay.tsx` had an inline copy of exactly this gate for its `createPortal` target; it now
  uses the hook. Two call sites, one implementation (golden rule 3).

## Behaviour (testable)
- [x] Zero `BailoutToCSR` templates in the server HTML; response for the same URL fell 80,017 → 32,711 B.
- [x] Storefront server output **unchanged** — `product-detail-actions` ×1, `application/ld+json` ×4,
      `Ajouter au panier` ×1, byte-for-byte the same content, before and after.
- [x] Demo scaffolding still absent from the server HTML: `.event-log-toggle` ×0 both before and
      after. The `<div class="expert-only">` wrapper that *used* to be emitted (holding the bailout
      template) is now gone too. The remaining `expert-only` hit in the HTML is the header nav link,
      which is unrelated and always server-rendered.
- [x] `npx tsc --noEmit` clean in the `example` container; `✓ Compiled`, no `⨯`.
- [ ] **Not verified: that the scaffolding still appears after hydration.** See below — this is the
      one claim resting on reasoning rather than observation.

## Why the client side could not be verified here

A headless Playwright run in the `e2e` container never hydrated the page (`hydrated: false`, probed
via `__reactFiber` keys on the DOM), so the click test was meaningless — the add-to-cart button did
nothing because React had not attached, not because of anything in this change.

The blocker is structural, and worth writing down so the next attempt doesn't repeat it:
**Chromium hardcodes the `.localhost` TLD to loopback per RFC 6761**, and neither `/etc/hosts` nor
`--host-resolver-rules` nor `--host-rules` overrides it. So a browser inside the compose network
cannot reach `https://gally.localhost/example`. Serving the app directly from `http://example:3001`
instead works for the initial HTML, but the dev server is configured for the proxy origin
(`basePath`, `allowedDevOrigins`, HMR websocket) — the websocket handshake fails, a `next/dist`
chunk aborts with `ERR_ABORTED`, and hydration stalls. `page.route()` can rewrite the SDK's
`https://gally.localhost/api` calls, but not the dev-server origin mismatch underneath.

Verifying client behaviour in this stack needs a browser on the **host**, where `gally.localhost`
resolves through the proxy normally.

## SDK contract used
- None.

## Tracking (required)
- Unchanged. `EventLog` and `TrackingInsights` only *display* tracked events; the events themselves
  fire from `useTracking()` in the storefront components, which this change does not touch. They now
  mount one tick later than the surrounding layout — which is already what happened, since the
  `ssr: false` chunks also only arrived after hydration.

## Side findings (not fixed)
- **`IntroScreen` is unreachable.** `DemoContext.tsx:39` initialises `introSeen` to `true`, and
  nothing anywhere calls `setIntroSeen(false)` — so `AppShell`'s `if (!introSeen)` branch never runs
  and the guided-demo intro cannot be shown. Looks like migration fallout rather than a decision.
  The `mounted &&` guard was added to that branch anyway: the intro replaces the *entire* layout, so
  without it the server would emit an empty document for every route the moment it is re-enabled.
- **The old comment's SSR-safety justification was stale.** It claimed `ssr: false` spared the
  scaffolding from "browser-only assumptions"; none of the five components reference `window`,
  `document`, `localStorage` or `navigator` at all. Only the SEO half of that rationale was real,
  and the `mounted` gate preserves it.

## MUST NOT change
- **Do not reintroduce `ssr: false` here.** It reads as the more explicit spelling and is the obvious
  "fix" for a future reader who wants the scaffolding kept off the server — but it is what produced
  47KB of stack traces per dev response. The `mounted` gate is the intent; `ssr: false` was the cost.
- The demo scaffolding must stay out of the server HTML. Rendering it unconditionally would put the
  event-log / insights / explain toggles into crawled pages and run `SearchExplain`'s
  `useSearchParams()` during SSR.
- `useMounted()` must keep setting state in an effect, not in a layout effect or during render —
  the first client render has to agree with the server's.
