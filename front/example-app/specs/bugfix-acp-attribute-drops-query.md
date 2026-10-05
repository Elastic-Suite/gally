# Bugfix: an ACP attribute value searches for the typed text too

## Status: implemented
## Page/Component: src/components/SearchOverlay.tsx, src/components/SearchBar.tsx, src/views/SearchPage.tsx, app/[locale]/search/page.tsx

## Problem
- Type "books" in the search bar without pressing Enter, then click a brand in the autocomplete
  panel. The search page opens with the heading "Results for "books"" and only shows books of that
  brand.
- Root cause: `attributeFilterUrl` always built `/search?q=<typed text>&f_<field>=<value>`.
  It treated the text being typed as a query the visitor had asked for. Clicking an attribute
  value means "show me this brand", not "search what I typed, filtered by this brand".

- Second cause, exposed by the first fix: with no `q`, `useSearch` and `fetchSearchProducts` send
  `searchQuery: '*'`. The API answers a `'*'` search with zero results, filter or not. Measured on
  `papershop_fr`: `'*'` + material lin gives 0, a root-category browse (`cat_llv_1`) + material lin
  gives 10. `docs/sdk-reference.md` already warns against the wildcard.

## Behaviour (testable)
- [x] Clicking an attribute value in the ACP opens `/search?f_<field>=<value>`, with no `q`.
- [ ] Choosing it with the keyboard (arrows + Enter) opens the same URL.
- [ ] The search page shows "All products" with the filter chip and the facet value checked.
- [x] With no `q`, SearchPage browses the root category (`product_catalog` on `categories[0]`), so
      `/search?f_llv_material__value=lin` lists the 10 linen products.
- [ ] The search route skips its server fetch when there is no `q`, instead of seeding an empty
      `'*'` result.
- [ ] Pressing Enter in the search bar still opens `/search?q=<typed text>`.

## SDK contract used
- With no `q`, SearchPage passes `categoryCode: categories[0].id` to `useSearch`, which then sends
  `product_catalog` with that category. Same pattern as `Homepage.tsx`.

## Tracking (required)
- No change. `trackSearch` only fires when there is a query, so a brand hand-off logs no search.

## UI constraints
- No UI change.

## MUST NOT change
- The `f_<field>=<value>` param format, which SearchPage seeds its filters from.
- Product, category, blog and term suggestion links in the ACP.
- The known side effect: the count next to an ACP value was computed for the typed text, so it can
  be lower than the number of results on the brand-only page.
