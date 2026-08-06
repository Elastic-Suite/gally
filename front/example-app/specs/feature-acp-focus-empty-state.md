# Feature: ACP opens on focus + empty-query prompt state

## Status: implemented
## Page/Component: src/components/SearchBar.tsx, src/components/SearchOverlay.tsx, src/styles.css, src/locales/{en,fr,de}/search.json

## Context
Follow-up to `specs/feature-acp-visual-redesign.md` and `specs/feature-search-header-redesign.md`. Those two
describe the ACP as opening only once there is something to show (`focused && (results.length > 0 ||
query.length >= 2)`). This spec supersedes that open-condition: the ACP now opens on focus alone, so the
search journey starts the instant the user clicks the bar. Everything else in those docs (portal,
`ResizeObserver` header-height, keyboard nav, blur/tint values, column ratios) is unchanged.

## Behaviour (testable)

### Opens on focus, whatever the query
- [x] `isOverlayOpen` is now `focused` alone (`SearchBar.tsx`). Clicking/tabbing into the empty search bar
      opens the full-screen scrim + panel immediately; the header dim (`.overlay-open`) and z-index bump
      behave exactly as before, just triggered earlier.
- [x] Blur still closes it, and `results` are still deliberately NOT wiped on blur (the state-preservation
      bugfix from `feature-search-header-redesign.md` stands) — refocusing restores the previous columns
      with no empty flash.

### Empty-query prompt state
- [x] While `query.trim().length < 2`, the panel renders a single centered `<SearchPrompt />` instead of the
      three columns. Threshold is `< 2`, not `=== 0`, on purpose: 2 chars is the `useAutocomplete` minimum
      (`useSearch.ts`) and also the `getSuggestionMatches`/`getCategoryMatches` minimum, so a 1-char query
      can only ever render three "No matching…" notes — an error-looking state for someone who has simply
      started typing.
- [x] Copy is i18n'd as `search:overlay.promptTitle` / `search:overlay.promptSubtitle`, marketing-voiced
      ("start your search journey"), EN: *"Start typing to find your next favorite look"* /
      *"Products, categories and trending searches appear as you type — two letters are all it takes to get
      started."* FR translated; DE mirrors EN, as every other key in `de/search.json` already does.
- [x] The prompt reuses the existing panel envelope (`.search-overlay-panel` + a
      `.search-overlay-panel-prompt` modifier that only switches the grid for a centered flex box), so the
      scrim, blur, tint, header offset and max-height are identical between the two states — no second
      surface, no layout jump when the third character lands.

### Bugfix — ACP stayed open after selecting an item
- [x] Selecting an ACP item used to close the overlay only as a side effect: `closeAndGo` cleared `query`
      and `results`, which made the old `focused && (results.length > 0 || query.length >= 2)` condition go
      false. With the condition now `focused` alone, clearing no longer closes anything — the ACP stayed up
      showing the prompt state on top of the page just navigated to.
- [x] Fixed with an explicit `closeOverlay()` in `SearchBar.tsx` (`setFocused(false)` + `inputRef.blur()`),
      called from every path that ends the search interaction:
      - overlay item click — passed down as the new `close` prop and called in `SearchOverlay`'s `closeAndGo`
      - `Enter` on a keyboard-highlighted item (`handleKeyDown`)
      - form submit (`handleSearch`)
      - the `searchBarRef` handle's `submit()` and `clear()` (story companion)
- [x] Form submit was already leaking before this change: it navigates and calls `clear()` but leaves
      `query` set, so `query.length >= 2` kept the old condition true and the ACP stayed open behind the
      results page. Now closed explicitly.
- [x] `Escape` (blurs the input) and click-outside (native blur on the scrim) still close via the existing
      200ms-delayed `onBlur` path — untouched.

## SDK contract used
- None. No change to `useAutocomplete()` (still 2-char minimum, 300ms debounce, `isAutocomplete: true`,
  `pageSize: 5`) or any other data-fetching contract. The empty state fires no request at all.

## Tracking (required)
- No change — item selection/navigation still goes through the same `navigate()` calls, so page-view and
  product-view tracking is untouched.

## UI constraints
- New CSS uses only existing tokens (`--font-serif`) plus `rgba(255,255,255,…)` of the panel's own text
  color, same idiom as the rest of the ACP block in `styles.css`. No new color tokens, no new primitives.
- `.search-overlay-panel-prompt` / `.search-prompt-*` live next to the existing `.search-overlay-*` rules.

## MUST NOT change
- The `results`-preservation-on-blur behavior and the 200ms `onBlur` delay (a click on an ACP item is a
  plain `div`, not a button/link — shortening the delay breaks selection).
- The 2-char autocomplete threshold in `useAutocomplete` — the prompt-state cutoff is derived from it, not
  independent of it.
- Keyboard navigation logic and the flattened cross-column `highlightedIndex`: with an empty query
  `flatItems` is empty, so arrow keys are inert in the prompt state by construction, not by a special case.
