---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Build the product field selection per catalog

## Context and Problem Statement

This decision is older than this ADR. It was made in commit `3a414938` (2026-09-22) and is
recorded in
`bugfix-product-fields-assume-every-catalog-loaded.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-product-fields-assume-every-catalog-loaded.md`).
The rule about new axes comes from
`bugfix-listing-axes-missing-for-new-catalogs.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-listing-axes-missing-for-new-catalogs.md`),
added in the same commit.

`PRODUCT_FIELDS` named every catalog's attributes in one flat list. Its comment said the
GraphQL `Product` type is global, so a missing field just returns null.

That was only true while all four catalogs were loaded. Gally builds the `Product` type from the
source fields in the database. A field of a catalog that is not loaded does not exist. GraphQL
rejects an unknown field at validation, before any resolver runs, so the whole query fails:

```
Cannot query field "llv_is_eco" on type "Product".
```

One paper-shop field therefore blanked every catalog, Venia included. This became reachable
when the sample data could load a subset of catalogs, which CI does.

How should the storefront choose which product fields to request?

## Considered Options

-   One flat field list for every catalog
-   One field list per catalog

## Decision Outcome

Chosen option: "One field list per catalog", because a catalog then asks only for fields its
own data declares. You can only browse a loaded catalog, so the mismatch cannot happen.

In `src/sdk/fields.ts`:

-   `CATALOG_AXIS_CODES` holds the variant axes per catalog code.
-   `CATALOG_EXTRA_FIELDS` holds the other fields one catalog owns, such as `llv_is_eco`.
-   `productFields(catalogCode)`, `productDetailFields(catalogCode)` and `axisCodes(catalogCode)`
    replace the old constants.

An unknown catalog code falls back to the common fields: no axes and no badge, but a page that
renders. The server and the client both derive the selection from the catalog, so the page
does not change after hydration.

### Consequences

-   Good, because a missing catalog no longer breaks the others.
-   Bad, because `CATALOG_AXIS_CODES` must still be extended by hand. A catalog that adds a variant
    axis must add it in the same change. Nothing checks this: a forgotten axis silently makes the
    listing treat the product as simple.
-   Neutral, because forgetting an entry now costs only that one catalog its variant pickers.

### Confirmation

-   `grep -rn "export const PRODUCT_FIELDS" src` finds nothing. The name survives only in comments.
-   In review, a pull request that adds a catalog with configurable products also adds its axes
    to `CATALOG_AXIS_CODES`.
-   Load `make fixtures_load catalogs=default`, then open `/example/com_fr/search?q=dress`: product
    cards render and no GraphQL error is logged.

## More Information

The listing spec says not to request `source` to avoid this list: it is the whole document,
about 3 KB per configurable, twenty at a time. It is kept for the product page only.
