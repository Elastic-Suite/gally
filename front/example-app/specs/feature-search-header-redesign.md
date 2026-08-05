# Feature: Search bar & autocomplete overlay redesign

## Status: implemented
## Page/Component: src/components/Header.tsx, src/components/SearchBar.tsx, src/components/SearchOverlay.tsx

## Behaviour (testable)
- [x] Header is split into two sticky rows inside `.header-sticky-group` (`position: sticky` moved here from
      `.header`): row 1 (`.header`/`.header-inner`) keeps logo, nav links, catalog/locale selectors, cart —
      unchanged. Row 2 (`.header-search-band`) holds only the search form, background matches the app body
      (`var(--gray-50)`, no card/shadow) so it reads as part of the page, not a separate box.
- [x] Search input (`.search-bar-wrapper`) is sized to ~2/3 of the row width (`width: 66.6667%`, capped
      `max-width: 900px`, floored `min-width: 260px`), centered.
- [x] On focus/blur the whole search-bar-wrapper animates via `transform: scale(1 → 1.08)` (`.expanded` class,
      0.25s ease transition) — grows/shrinks the pill and its text/icon together. This only affects the wrapper;
      `SearchOverlay` is a portaled sibling and is never scaled by it.
- [x] Typing ≥2 characters (or once product `results` arrive) opens `SearchOverlay`, a `position:fixed` scrim
      portaled to `document.body` (`createPortal`, NOT nested in the header) with `backdrop-filter: blur(8px)`
      over a semi-transparent dark tint. Portaling is required: the header establishes its own stacking context
      (`position: sticky`), so a nested fixed overlay would be trapped inside it and could never render above
      unrelated siblings like `.main-content`.
- [x] While the overlay is open, the ENTIRE header also dims — not just the page below it:
      `.header-sticky-group:has(.search-bar-wrapper.overlay-open) .header-inner` gets `filter: blur(3px);
      opacity: .45; pointer-events: none`, and `.header-search-band:has(...)` swaps its background to a dark
      tint matching the scrim (`rgba(30, 27, 75, .92)`). The input itself keeps its normal light background
      (`.search-bar:focus { background: white }`) so it stays legible against the now-dark band.
- [x] Overlay panel is a 3-column grid (`grid-template-columns: repeat(3, 1fr)`, 1 column on mobile ≤768px):
      "🔍 Popular search terms" (static `SEARCH_SUGGESTIONS` list, client-filtered), "Products" (real
      `useAutocomplete()` API results), "📁 Category" (client-filtered flattened `categories` tree).
- [x] All 3 columns always render their title, even with zero matches. Each column shows exactly one of:
      shimmer skeleton rows (loading), an italic empty note ("No matching …"), or the item list. Products shows
      a skeleton while `useAutocomplete()`'s `loading` is true; Category shows a skeleton while
      `CatalogContext.loadingCatalogs` is true; Popular search terms has no loading state (synchronous static
      data) — empty note only.
- [x] `.search-overlay-panel` has `min-height: 20rem` (desktop) so the panel does not visibly grow/shrink
      between keystrokes as match counts change (verified: stays at 320px whether 0 or all columns are
      populated). Mobile drops the min-height (`min-height: 0`) since columns stack into one scrollable track
      there instead of sitting side by side.
- [x] Overlay vertical offset is NOT a hardcoded guess: `Header.tsx` measures `.header-sticky-group`'s real
      rendered height with a `ResizeObserver` and writes it to `--header-height` on `document.documentElement`.
      `.search-overlay-scrim` uses `padding-top: calc(var(--header-height) + 1rem)` (desktop) — this keeps the
      popup positioned correctly regardless of font metrics, header wrapping, or viewport size, on both
      breakpoints, with no separate magic numbers per breakpoint.
- [x] Keyboard navigation: all items across the 3 columns are flattened into one visual-order list (suggestions
      → products → categories) in `SearchBar.tsx`. `ArrowDown`/`ArrowUp` move a `highlightedIndex` through that
      list (wraps at both ends). `Enter` navigates to the highlighted item if one is set; with no highlight,
      `Enter` falls through to the normal form submit (raw-query search), unchanged from before. `Escape` blurs
      the input (200ms-delayed `onBlur` → `setFocused(false)` path — see the state-preservation bugfix below).
      The highlighted item gets `data-item-key` + `.highlighted` (indigo-50 bg + left accent bar, distinct from
      plain `:hover`) and is scrolled into view if its column is scrolled.
- [x] Clicking any item (mouse) still works via the pre-existing 200ms `onBlur` timeout race — unaffected by
      any of the above, since it depends on native focus/blur timing on the `<input>`, not DOM position.
- [x] **Bugfix — ACP state lost on blur:** `onBlur` used to call `clear()` after its 200ms delay, wiping the
      fetched `results` array outright. Blurring for any reason (tabbing away, clicking a non-interactive part
      of the overlay panel) permanently threw away the suggested products, and refocusing the same query didn't
      bring them back since `search()` only re-fires on `onChange`, not on focus. Fixed by dropping `clear()`
      from `onBlur` (it now only sets `focused = false`, still delayed so overlay-item clicks register first)
      and re-deriving `isOverlayOpen` as `focused && (results.length > 0 || query.length >= 2)` instead of
      `results.length > 0 || (focused && query.length >= 2)` — the overlay still visually closes on blur, but
      `results` is preserved, so refocusing re-opens it instantly with the same suggestions instead of an empty
      flash.
- [x] **Bugfix — search bar painted over the sticky top nav on scroll:** `.header-search-band` (containing
      `.search-bar-wrapper`, `z-index: 110`) is a normal in-flow row, not itself sticky — only `.header`
      (`position: sticky`) is. `.header` was `z-index: 100`, i.e. *lower* than the search bar, so as the page
      scrolled and the search band passed under the pinned `.header`, it rendered on top of it instead of
      disappearing behind it. Fixed by raising `.header` to `z-index: 120`. Also corrected
      `.header-sticky-group` (the flex item wrapping both rows, whose own z-index governs how the whole header
      block stacks against page content outside it) from a flat `z-index: 100` to `z-index: 40` by default —
      below `.category-nav-submenu`'s `z-index: 50`, so a category flyout that scrolls near the sticky header
      isn't covered by it — raised back to `100` via `:has(.search-bar-wrapper.overlay-open)` only while the
      ACP is open, so it still sits above the rest of the page then.

## SDK contract used
- No new SDK calls. Reuses `useAutocomplete()` (`src/hooks/useSearch.ts`) for the Products column exactly as
  before — this spec only newly *consumes* its pre-existing `loading` flag (was previously destructured away).
- Reuses `CatalogContext`'s pre-existing `categories` and `loadingCatalogs` for the Category column.

## Tracking (required)
- No new tracking event and no change to existing ones. Selecting any overlay item or submitting the form
  navigates to an existing route (`/search?q=...`, `/product/:sku`, `/category/:id`); the destination page's own
  effect fires tracking exactly as it does when reached any other way (e.g. `SearchPage.tsx` calls
  `trackSearch`/`trackDisplay` on mount/query-change regardless of entry point).

## UI constraints
- New rgba tints (`rgba(30, 27, 75, .45|.92)` for the scrim/dark band, `rgba(255, 107, 107, .25)` for the
  focus-ring) are the same indigo-900/coral-500 token values already used inline elsewhere in `styles.css`
  (e.g. `--shadow-*` and other coral-glow rules) — no new colors introduced, just the existing "hex token → raw
  rgb() for alpha" idiom this file already relies on (CSS custom properties can't be alpha-blended directly).
- New skeleton classes (`.autocomplete-skeleton-*`) reuse the existing `.skeleton-shimmer` animation, not a new
  loading primitive.
- `SearchBarContext`'s external-control contract (`setQuery`/`submit`/`clear`/`inputRef`, consumed by
  `useStoryActions.ts`) is registered from `SearchBar.tsx` with the exact same shape as before the split.

## MUST NOT change
- Nav links/`isActive`/`expert-only` logic, catalog/locale `<select>` behavior, cart badge + count — all remain
  in `Header.tsx`'s `.header-inner`, untouched by the search work.
- `CategoryNav.tsx` — still rendered per-page (`Homepage.tsx`, `CategoryPage.tsx`), not part of the header;
  no changes needed since it already renders below `<Header/>`.
- Suggestion/category matching logic (substring filter, top-3 slice) — only relocated/exported
  (`getSuggestionMatches`, `getCategoryMatches` in `SearchOverlay.tsx`), never rewritten.
