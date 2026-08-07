# Bugfix: Homepage hero CTA linked to an empty search query

## Status: implemented
## Page/Component: src/pages/Homepage.tsx, src/locales/{en,fr,de}/category.json

## Problem
The hero button reads "Shop dresses" / "Découvrir les robes" but linked to
`/search?q=` — the `q` parameter was present and empty. `SearchPage` treats an empty
`q` as "browse everything": the heading falls back to `page.allProducts` and the
result set is the whole catalog. So the headline CTA of the homepage silently dropped
its intent and dumped the visitor into an unfiltered listing. No error, nothing in the
console — the page looked like it worked.

## Behaviour (testable)
- [x] The hero button links to `/search?q=<term>` and the search page receives it.
      Verified by clicking through in a real browser: href `/example/search?q=robe`,
      landed URL `?q=robe`, heading "Résultats pour « robe »", 17 products.
- [x] **The query term is localized, not hardcoded `dress`.** New key
      `homepage.shopDressesQuery` — `dress` (en), `robe` (fr), `dress` (de, placeholder
      locale convention). The catalog language follows the locale selector, so a French
      visitor must search the French term.
- [x] Passed through `encodeURIComponent`, like every other `/search?q=` construction
      in the app (`SearchBar.tsx`, `SearchOverlay.tsx`).

## Why localized rather than just `q=dress`
Both work — `dress` returns 17 products on `com_fr` too, because the index carries
English tokens and spellcheck absorbs the rest. But a French button saying "Découvrir
les robes" that searches `dress` is wrong on inspection, and the app already localizes
its search terms this way: `search.json`'s `overlay.suggestions` is `dress…` in en and
`robe…` in fr. Checked against the live index: `com_fr` + `robe` → 17 products,
`com_en` + `dress` → 18.

## Not changed
- `CartPage.tsx:89`'s empty-cart link is **also** `/search?q=` — but there it is
  correct. Its label is `empty.browse` ("Browse products"), and the intended
  destination really is the unfiltered listing.

## SDK contract used
- None directly. The empty-`q` browse path it accidentally used relies on `useSearch`
  falling back to `product_search` with an empty search string, since `product_catalog`
  400s without a `currentCategoryId` (../docs/sdk-reference.md).

## Tracking (required)
- No change, and now more accurate: the `SEARCH` event fired from `SearchPage` carries
  the real query term instead of an empty string.

## MUST NOT change
- `encodeURIComponent` on the term — the key is translator-editable and a future locale
  may use a multi-word or accented term.
- The `shopDresses` / `shopDressesQuery` pair must stay in sync. If the label stops
  being about dresses, the query has to move with it in all three locales.
