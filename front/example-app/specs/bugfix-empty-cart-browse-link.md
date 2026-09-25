# Bugfix: Empty cart "browse products" ran an empty search

## Status: implemented
## Page/Component: src/views/CartPage.tsx (empty state)

## Problem
The empty cart's "browse products" button linked to `/search?q=`, an empty search. That is not a
listing the storefront offers anywhere else, and `docs/sdk-reference.md` warns against faking a browse
with a search.

## Behaviour (testable)
- [x] The button links to `defaultListingPath(categories)` (`src/sdk/categoryTree.ts`): the current
      catalog's root category, the same place as the header's Products tab. With no categories it links
      to the homepage.

## MUST NOT change
- The button's label, style and placement.
