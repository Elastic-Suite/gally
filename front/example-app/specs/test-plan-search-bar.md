# Test plan: the search bar and autocomplete (search and listing, part 4)

## Status: implemented - 17 tests in `src/test/search-bar.test.tsx`, all passing

Last part of the search-and-listing aspect: `SearchBar` (typing, opening and closing, submit, keyboard,
the guided demo's handle) and `SearchOverlay` (the panel: terms, attributes, products, categories,
articles). Both rendered in jsdom with fake autocomplete data and a fake router, driven with the
keyboard and the mouse. The autocomplete hooks themselves are covered by part 1.

About 35 tests in 1-2 files. The ticked spec lines match the code except one (decision 1). The visual
lines (glass, blur, motion, panel height, 768 px layout) stay out.

Sources: `feature-search-header-redesign.md` (partly superseded), `feature-acp-focus-empty-state.md`,
`feature-acp-real-term-suggestions.md`, `bugfix-acp-attribute-drops-query.md`,
`feature-mobile-header-and-acp-tabs.md`, `bugfix-search-term-kept-after-leaving-search.md`,
`feature-header-search-drop.md`, `bugfix-acp-background-scroll-and-density.md`, and item 1 of
`AUDIT-graphql-coverage.md` (another session's audit).

## Decisions

1. **Blog term suggestions never show.** `useCmsAutocomplete` asks with `isAutocomplete: false`
   (`useCms.ts`); the SDK adds `termSuggestions` to the query only when it is true
   (`gally-admin/packages/sdk/src/graphql/Request.ts:196-198`), and for documents it changes nothing
   else (`getRequestType` is undefined for non-products, `:118-126`). Checked live: the API does return
   blog terms ("dre" gives "dress fabric types", "how to style a dress", "dress care guide"), so the
   popular-terms column is missing them. `feature-acp-real-term-suggestions.md` ticks them as working.
    - (a) Pin it.
    - (b) Fix: `isAutocomplete: true` in `useCmsAutocomplete`, a bugfix spec, and the part 1 request test
      updated on purpose. Recommended.
    - **Decided 2026-10-23: neither - blog suggestions are not wanted.** Recorded in
      `feature-acp-real-term-suggestions.md`; nothing changes in the code.
2. **The autocomplete is invisible to screen readers.** No combobox pattern: the input has no
   `role="combobox"`, `aria-expanded`, `aria-controls` or `aria-activedescendant`; the panel has no
   `listbox` / `option` roles; the rows are clickable `<div>`s (`SearchOverlay.tsx`, each column). The
   arrow keys move a highlight a sighted keyboard user sees, but a screen reader announces nothing.
   The input's only name is its placeholder - a weak fallback.
    - (a) Pin it; the tests drive the keyboard through the input as today.
    - (b) Fix first: the WAI-ARIA combobox pattern - the input as `combobox` with a real label,
      `aria-expanded` / `aria-controls`, each column a labelled `listbox`, each row an `option` with an
      id and `aria-selected`, the highlight as `aria-activedescendant`. Same look and same keys. A bigger
      change than the facet fixes (two components, every row type), with its own spec; the tests then
      find everything by role.
    - Recommended: (b), as a separate step before the tests.
    - **Decided 2026-10-23: (b), done** - `bugfix-autocomplete-screen-reader.md`; checked in a browser.
3. **No blog SEARCH event, ever.** `trackSearch` always sends `metadataCode: 'product'`, so a search
   on `/search` never tells Gally that articles were searched. Premium term suggestions for articles
   are built from such events (`gally-doc/premium/term-suggestion.md`), so with decision 1 fixed the
   blog terms would still only ever come from the sample data. Not part of this plan's tests - a
   tracking question: should `/search` also send a SEARCH for `cms_page` with the article count?
    - **Decided 2026-10-23: no blog SEARCH events.** Recorded in `feature-acp-real-term-suggestions.md`.

## A - The search bar

-   Typing calls both autocompletes with the query; focus opens the panel; blur closes it after 200 ms,
    so a click on a row still lands; Escape blurs; the mobile Cancel button closes at once.
-   Submit goes to `/search?q=<trimmed, encoded query>` in the current catalog, then clears and
    closes; an empty or blank query does nothing.
-   Keyboard: nothing highlighted at first; Down goes to the first item, Up to the last, both wrap; the
    order is terms, attributes, products, categories, articles; Enter on a highlighted item goes to that
    item's URL, not the typed text; arrows do nothing under 2 characters.
-   Leaving `/search` clears the query (bugfix-search-term-kept-after-leaving-search).
-   The guided demo's handle: `setQuery` searches without navigating, `submit` navigates, `clear`
    empties.
-   While the panel is open the page does not scroll, and closing restores it (body overflow and the
    scrollbar padding).

## B - The panel (SearchOverlay)

-   Under 2 characters: the prompt only - no columns, no tabs (feature-acp-focus-empty-state).
-   Terms: products first, then articles, duplicates removed; a term opens `/search?q=<term>`.
-   Attributes: no `name`, no slider, at most 5 values each; a value opens `/search?f_<field>=<value>`
    without `q` (bugfix-acp-attribute-drops-query), from the mouse and from Enter.
-   Products with their quick-add; categories matching the query, at most 3; articles with the query
    marked in the title. Each column: a skeleton while loading, a "no matching" note when empty.
-   Mobile tabs: Products selected on open, the tab follows the keyboard highlight, the tabs never take
    focus.

## Outcome

-   Nine deliberate breaks, each made a test fail: the highlight not announced, the input not a
    combobox, the highlighted option not selected, attribute values without their attribute name,
    expanded during the prompt, blur closing at once, submit not trimmed, arrows not wrapping, the term
    kept after leaving `/search`.
-   Pinned on the way: submit keeps the typed term in the box; it is cleared when the visitor leaves
    `/search`.
-   jsdom needed `matchMedia` and `scrollIntoView` stubs; the bar uses both.

## Out of scope here

-   The look and motion: glass, blur, the bar moving into place, panel height, the 768 px layout.
-   The autocomplete hooks (part 1) and the quick-add itself (part 3).
