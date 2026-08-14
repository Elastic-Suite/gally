# Bugfix: the page scrolled behind the autocomplete popup, and the popup was too tall

## Status: implemented
## Page/Component: src/components/SearchOverlay.tsx (body scroll lock), src/styles.css (`.search-overlay-scrim`, `.search-overlay-col`, `.autocomplete-item`, `.autocomplete-section-title`, `.autocomplete-suggestion`, `.autocomplete-category`, `.autocomplete-attribute-group`)

## Problem

**Scrolling with the popup open moved the page underneath it.** Two independent causes, and fixing
either alone leaves the bug reachable:

1. `.search-overlay-scrim` is `position: fixed; inset: 0` with its own `overflow-y: auto`, and at
   the time `.search-overlay-col` scrolled too. Neither set `overscroll-behavior`, so a wheel
   gesture that reached the end of a column or of the scrim **chained** into the document behind it
   — the browser default. The scrim is `rgba(30, 27, 75, 0.92)` with a 28px blur, so the page does
   not *appear* fully hidden: content visibly slid around under the columns.
2. **There was no body scroll lock anywhere in the app** (grep for `document.body.style`, a body
   `overflow: hidden`, or any scroll-lock helper: no hits). So a gesture that never lands on a
   scrollable descendant — the wheel over a short column, Space/PageDown, a flick on the panel's
   own padding — reached the document regardless of overscroll behaviour.

**The popup was also taller than the screen**, which is what made cause 1 easy to hit. Measured from
the CSS (16px root, `body { line-height: 1.6 }`): the attribute list dominates, because
`MAX_ACP_OPTIONS = 5` across the four `isUsedInAutocomplete` source fields puts 20 rows plus 4
section titles in one column.

| | before | after |
|---|---|---|
| Attribute row | 48px | **38px** |
| One attribute group (title + 5 rows + margin) | 299px | **236px** |
| Column 1 (4 groups + 3 popular terms) | **1381px** | **1104px** |
| Available at 1080p (`100vh` − 8.5rem header − 3rem − 1.5rem×2 panel padding) | 848px | 848px |

## Behaviour (testable)

- [x] `overscroll-behavior: contain` on `.search-overlay-scrim`, so the popup's scroller cannot
      chain into the page. Confirmed in the served bundle. It was applied to
      `.search-overlay-col` too, until `feature-acp-header-rides-scroll.md` made the scrim the
      only scroller — the columns no longer scroll, so they can no longer chain.
- [x] `SearchOverlay` locks `document.body` while `open`: `overflow: hidden` plus a `padding-right`
      equal to the measured scrollbar width (`window.innerWidth − documentElement.clientWidth`).
      Without the compensation the page reflows ~15px wider when the scrollbar disappears, and since
      the header stays visible (blurred, not covered) the shift would show.
- [x] The effect **restores the previous inline values** rather than clearing them, and its cleanup
      runs on unmount as well as on close — so closing the popup by navigating (`closeAndGo`) cannot
      strand the page unscrollable.
- [x] The effect sits **above** the `if (!open || !mounted) return null` early return and guards
      inside, alongside `useMounted()`, so hook order stays stable. This component's early return is
      why that placement matters.
- [x] Item padding trimmed: `.autocomplete-item` `0.75rem → 0.45rem` vertical, section title
      `0.65/0.35 → 0.45/0.25`, `.autocomplete-suggestion` and `.autocomplete-category`
      `0.65rem → 0.45rem`, `.autocomplete-attribute-group` margin `1.25rem → 0.6rem`. Horizontal
      padding unchanged everywhere. All six values verified in
      `_next/static/chunks/example-app_src_styles_*.css`.
- [ ] **Not confirmed in a browser** — no browser tooling was available in this session. The CSS and
      the effect are verified to reach the client, but the scroll gesture itself is unexercised, and
      that is the whole point of the change. Worth one manual pass: open the popup on a long page,
      wheel over a column to its end, then over the panel padding, then press Space.

## Not fixed: the popup still exceeds one screen

Column 1 is **1104px against 848px available** at 1080p — a 277px (20%) reduction, not a fit. Padding
cannot close the rest; the remaining levers are structural and none is applied here:

- `MAX_ACP_OPTIONS` 5 → 3 (`SearchOverlay.tsx:44`) would bring column 1 to ~792px and fit, at the
  cost of two values per attribute.
- Rendering values as wrapping chips instead of one per row would fit while keeping all five, but
  changes the markup and so the keyboard-navigation-in-visual-order guarantee in
  `feature-search-header-redesign.md`.
- `.search-overlay-panel`'s own `1.5rem` padding is a further ~48px, deliberately untouched: the
  request was the *items*' padding, and the panel envelope is part of the redesign in
  `feature-acp-visual-redesign.md`.

Because scrolling is now contained, exceeding one screen degrades to "the popup scrolls" instead of
"the page moves underneath", which is the difference that mattered. `feature-acp-header-rides-scroll.md`
then made that scroll move the search bar with it, which reclaims the header's own ~136px.

## SDK contract used

None — no request or field selection changed.

## Tracking (required)

None. No interaction changed; item clicks still route through `closeAndGo` / `attributeFilterUrl`.

## UI constraints

- No new token, no new colour, no new component, no markup change. Every padding value is a
  reduction of an existing one; `overscroll-behavior` is the only new property.
- The scrim's `-webkit-backdrop-filter` / `backdrop-filter` order is untouched — see the comment
  above it and `bugfix-acp-scrim-blur-dropped.md`; lightningcss keeps only the last of the pair.

## MUST NOT change

- **Keep both halves of the scroll fix.** `overscroll-behavior` alone does not stop a gesture that
  never touches a scrollable descendant; the body lock alone does not stop chaining out of the
  scrim once it reaches its end. Removing either reopens the bug in a subset of gestures.
- **The body lock must keep restoring the previous inline values and must keep its cleanup on
  unmount.** A lock that leaks leaves the whole app unscrollable, with no visible cause.
- **Keep the `padding-right` compensation** with the `overflow: hidden`, or the header jumps
  sideways every time the popup opens.
- **The scroll-lock effect must stay above the early return.** Moving it below is a hooks-order
  violation that only shows up when the overlay toggles.
