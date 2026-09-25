# Bugfix: Search term stayed in the header after leaving the search page

## Status: implemented
## Page/Component: src/components/SearchBar.tsx

## Problem
The header, and the search bar in it, stays mounted across page changes
(`feature-persist-shared-ui-across-navigation.md`). The bar keeps its own `query` state. Submitting a search
cleared the autocomplete results but kept the term, which is right on the results page. Nothing cleared it
afterwards, so going from `/search?q=robe` to a category, a product or the homepage still showed "robe" in
the box.

## Behaviour (testable)
- [x] On `/search`, the submitted term stays in the box.
- [x] When the path changes to anything other than `/search` (read locale-free with `useAppPathname()`), the
      box is emptied and the autocomplete results are cleared.
- [x] Typing on another page is not affected: the reset runs only when the path changes, not on each keystroke.

## MUST NOT change
- Submitting a search, picking an autocomplete item and the story companion's `setQuery`/`submit`/`clear`
  handle work as before.
- The search page's own results and URL are untouched. Only the header box is reset.
