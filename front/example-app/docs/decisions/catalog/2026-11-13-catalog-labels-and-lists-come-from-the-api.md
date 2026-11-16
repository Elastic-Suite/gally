---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Take catalog-dependent labels and lists from the API, not from front lists

## Context and Problem Statement

This decision is older than this ADR. It was made in three steps, each recorded in a spec:

-   Commit `db155913` (2026-08-13): popular search terms in the autocomplete come from the
    engine. See [feature-acp-real-term-suggestions.md](../../specs/feature-acp-real-term-suggestions.md).
-   Commit `3a414938` (2026-09-22): variant axis headings come from the API. See
    [feature-axis-labels-from-api.md](../../specs/feature-axis-labels-from-api.md).
-   Commit `796b6165` (2026-10-12): sort options and the default sort come from the API. See
    [feature-dynamic-sort-options.md](../../specs/feature-dynamic-sort-options.md).

In each case the front held its own list of something the catalog already knew:

-   Axis headings were i18n keys for four axis codes. Venia and Luma read correctly. Newer
    catalogs showed raw codes such as `fio_clothing_size`. Each new catalog needed three hand
    translations per axis.
-   Both listings hardcoded their sort options, and the two lists had drifted apart. A field the
    merchant marks for sorting never reached the storefront.
-   The popular terms column filtered a fixed list of ten invented terms per locale. It never
    reflected what anyone had searched, and never followed the catalog.

Where should a label or list that depends on the catalog come from?

## Considered Options

-   Ask the API for it
-   Keep a list in the front (i18n keys or hardcoded arrays)

## Decision Outcome

Chosen option: "Ask the API for it", because the API already holds the data, translated for the
localized catalog, and a front list goes stale as soon as a catalog is added or changed.

-   Axis headings: `GET /product_source_field_labels`, called once per page load in
    `app/[locale]/layout.tsx`, as plain REST like `fetchCatalogs()`. The heading is in the server
    HTML. An axis with no label shows the code with a capital first letter, never blank.
-   Sort: `productSortingOptions` builds both listings' selects. A category request sends no sort,
    so the API applies the category's configured default, and the select shows what the API
    reports it applied.
-   Popular terms: `termSuggestions` from each search response. The fake arrays are deleted.

### Consequences

-   Good, because a new catalog gets correct headings, sort options and terms with no front change.
-   Good, because a merchant's back-office setting (sortable field, default sort) shows in the shop.
-   Bad, because the API returns fixed English for four sort fields, and every shop lists other
    shops' sortable fields. `useSortOptions` overrides those four labels and hides fields with
    another demo shop's prefix. Both are logged in `missing-features.md` as workarounds.
-   Neutral, because an empty `termSuggestions` now means the engine has no popular term for the
    query.

### Confirmation

-   `grep -rn '"suggestions"' src/locales` finds nothing. Only the column's title and empty-note
    keys remain.
-   No `<option>` list is hardcoded in `src/views/CategoryPage.tsx` or `src/views/SearchPage.tsx`.
-   On `fashion_fr`, `curl` a configurable product page and find `Taille vêtement` in the HTML.

## Pros and Cons of the Options

### Keep a list in the front

-   Bad, because axis headings needed three hand translations per axis for each new catalog.
-   Bad, because the two sort lists had already drifted apart.
-   Bad, because invented terms never reflected real searches.

## More Information

An earlier spec rejected the aggregation's localized label for axis headings, because the
product page's server fetch did not carry it. That objection does not apply to the label
endpoint, which is fetched on the server in the layout.
