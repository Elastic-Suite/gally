# Feature: the search bar scrolls with the autocomplete popup

## Status: implemented
## Page/Component: src/components/SearchOverlay.tsx (`onScrimScroll`, the `--acp-scroll` reset effect), src/styles.css (`.header-sticky-group:has(.overlay-open)`, `.search-overlay-panel`, `.search-overlay-col`)

## Problem

With the popup open, the search bar hovered in place while the content scrolled underneath it. Two
findings, and the second is the one that mattered:

1. **The search bar was never fixed to begin with.** Only `.header` (the nav row) is
   `position: sticky`, and it is bounded by its static parent `.header-sticky-group`, so it unpins
   after roughly one search-band height of scrolling; `.header-search-band` is static and scrolls
   away with the page. `docs/design-system.md` described "two sticky rows", which overstated it —
   the whole stylesheet contains exactly two sticky elements, `.header` and the facet sidebar. What
   *had* made the bar appear to scroll with the popup was the scroll-chaining bug:
   `bugfix-acp-background-scroll-and-density.md` fixed the chaining, and with the page frozen the bar
   could no longer move at all.
2. **The popup had no outer scroller to ride.** `.search-overlay-panel` carried
   `max-height: calc(100vh - var(--header-height) - 3rem)`, which together with the scrim's
   `152px` top and `32px` bottom padding summed to exactly `100vh` — so the scrim never scrolled, by
   construction. The `.search-overlay-col` elements scrolled inside themselves instead, and a gesture
   inside a column cannot move anything outside it. No amount of listening would have helped; the
   scroll the header needed to follow did not exist.

## Behaviour (testable)

- [x] **One scroller.** `.search-overlay-panel` has no `max-height` (desktop or the mobile override),
      and `.search-overlay-col` is no longer `overflow-y: auto`. The panel is free to exceed the
      viewport and the scrim — already `position: fixed; inset: 0; overflow-y: auto` — scrolls it.
      Verified in the served bundle: the scrim keeps `overflow-y: auto` and
      `overscroll-behavior: contain`, the panel keeps only `min-height: 24rem`.
- [x] **The header rides that scroll.** `SearchOverlay` publishes the scrim's `scrollTop` as
      `--acp-scroll` on `<html>`; `styles.css` applies
      `transform: translateY(calc(-1 * var(--acp-scroll, 0px)))` to `.header-sticky-group`, **but
      only under `:has(.search-bar-wrapper.overlay-open)`**. Outside the popup the rule does not
      match and the header keeps exactly the positioning it always had, which is the "fixed in other
      cases" half of the request.
- [x] Clamped to `min(scrollTop, --header-height)`: the bar slides fully out of view and then stops
      contributing, so the panel keeps scrolling alone. Because the panel is scrolled content, the
      two move at the same rate and the vacated space is filled by the columns rising into it.
- [x] Scrolling back up brings the bar back — it is a live transform of `scrollTop`, not a one-way
      collapse.
- [x] `--acp-scroll` is **removed** when the popup closes or unmounts, and any queued frame is
      cancelled. A leak here is invisible at the time (the transform only applies while
      `.overlay-open` matches) and would resurface on the *next* open as a header already scrolled
      away.
- [x] Writes are rAF-coalesced — a wheel fires far more often than the compositor paints.
- [x] Both scrim renders (the three-column panel and the sub-2-character `SearchPrompt`) carry the
      handler, so the prompt state cannot leave a stale offset behind.
- [x] Nothing inside the header subtree is `position: fixed`, so the new `transform` — which makes
      the group a containing block — cannot trap a fixed descendant. Checked: the only nearby
      `position: fixed` is `.search-overlay-scrim`, and that is portaled to `document.body`, not a
      descendant. `.category-nav-submenu` is `position: absolute` and lives outside the header.
- [ ] **Not confirmed in a browser.** No browser tooling was available in this session. The CSS, the
      custom property and the handler are all verified to reach the client, but the gesture itself is
      unexercised — and the feel of a scroll-linked transform is exactly what cannot be verified from
      a bundle. Worth one manual pass: open the popup, scroll down (bar leaves, columns rise), scroll
      up (bar returns), close and reopen (bar starts in place).

## SDK contract used

None — no request, field selection or aggregation handling changed.

## Tracking (required)

None. No interaction changed; items still route through `closeAndGo` / `attributeFilterUrl`.

## UI constraints

- No new token, no new colour, no new component. One new CSS custom property (`--acp-scroll`) on
  `<html>`, using the same channel `Header` already uses for `--header-height`.
- No markup change beyond an `onScroll` handler, so the keyboard-navigation-in-visual-order guarantee
  in `feature-search-header-redesign.md` is untouched.
- The scrim's `-webkit-backdrop-filter` / `backdrop-filter` ordering is untouched — see
  `bugfix-acp-scrim-blur-dropped.md`.

## Trade-off accepted

**The columns no longer scroll independently.** Previously the tallest column scrolled inside itself
while the other two stayed put; now the whole panel scrolls as one, so the columns keep their relative
alignment. That was the explicit choice: per-column scrolling is what made the header unable to
follow, and it also meant the tallest column scrolled while the search bar and the other two columns
sat still.

Consequence to watch: with `max-height` gone the panel's height now tracks its content, so it varies
more between queries than it did. `min-height: 24rem` still prevents the small-result jitter that
`feature-acp-visual-redesign.md` added it for.

## MUST NOT change

- **The transform must stay scoped to `:has(.search-bar-wrapper.overlay-open)`.** Unscoped, it would
  displace the header on every page as soon as `--acp-scroll` held a stale value.
- **Do not reintroduce `max-height` on `.search-overlay-panel` or `overflow-y` on
  `.search-overlay-col`.** Either one restores the "the scrim never scrolls" condition and silently
  kills this feature — the header would simply stop moving, with no error anywhere.
- **Keep the clamp at `--header-height`.** Without it the header keeps translating past the top of
  the viewport and drags the search bar arbitrarily far off-screen.
- **Keep the cleanup that removes `--acp-scroll`.** See the behaviour note above; the failure is
  deferred to the next open, which makes it hard to attribute.
