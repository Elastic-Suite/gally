# Bugfix: the product selection assumes every catalogue is loaded

## Status: implemented
## Page/Component
`src/sdk/fields.ts`. Call sites updated in `src/sdk/server.ts`, `src/sdk/axisLabels.ts`,
`src/hooks/useSearch.ts`, `src/views/ProductPage.tsx` and `app/[locale]/layout.tsx`.

## Problem

Load a subset of the sample data and the storefront renders nothing at all — every catalogue,
not just the missing ones. The homepage comes back with zero product cards and a search page
with zero results.

### Root cause

`PRODUCT_FIELDS` named every catalogue's attributes in one flat list: `llv_is_eco`, the eight
`fio_*` size axes and `llv_color`/`llv_format`/`llv_material`. The comment justified it with
"the GraphQL Product type is global, so it simply returns null".

That was true only while all four catalogues always loaded. Gally builds the GraphQL `Product`
type from the source fields in the database, so a field belonging to a catalogue that was not
loaded does not exist. GraphQL rejects an unknown field at **validation**, before any resolver
runs, and the whole query fails:

```
Cannot query field "llv_is_eco" on type "Product".
```

One absent field therefore kills the query for every catalogue, which is why a Venia page went
blank because of a paper-shop attribute.

This became reachable when the sample data gained `GALLY_SAMPLE_DATA_CATALOGS`, which lets a
load pick a subset — CI sets it to `default` so the e2e assertions stop moving when a demo
catalogue is added.

## Fix

Split the selection the same way the fixtures are split: a common set, plus one group per
catalogue.

- `CATALOG_AXIS_CODES` — variant axes keyed by catalogue code (`com`, `fr`, `uk`, `toolbox`,
  `fashion`, `papershop`).
- `CATALOG_EXTRA_FIELDS` — the non-axis fields one catalogue owns: `fashion_material` on Venia,
  `llv_is_eco` on the paper shop.
- `productFields(catalogCode)` / `productDetailFields(catalogCode)` / `axisCodes(catalogCode)`
  replace the `PRODUCT_FIELDS`, `PRODUCT_DETAIL_FIELDS` and `AXIS_CODES` constants.

A catalogue now asks only for the fields its own fixtures declare, and you can only browse a
catalogue that is loaded — so the mismatch is impossible by construction rather than something
to remember. An unknown catalogue code degrades to the common fields: no axes and no badge, but
a page that renders.

The axis map was derived from the fixtures rather than guessed, by reading
`configurable_attributes` out of every `product_documents.json`:

| catalogue | axes | extra |
|---|---|---|
| `com` (Venia) | `fashion_color`, `fashion_size` | `fashion_material` |
| `fr` (Luma) | `color`, `size` | — |
| `uk` | none (no indexed products) | — |
| `toolbox` | none (no configurables) | — |
| `fashion` (Fiora) | 8 × `fio_*` | — |
| `papershop` | `llv_color`, `llv_format`, `llv_material` | `llv_is_eco` |

Server and client must keep asking for the same shape, or the page changes under the user after
hydration. Both now derive it from the catalogue: `server.ts` resolves the catalogue from the
localized-catalogue code through the already-cached `resolveLocale()`, and `useSearch` reads
`selectedCatalog` from `CatalogContext`.

`fetchAxisLabels()` takes the catalogue code too, and returns `{}` without a request for a
catalogue that has no axes.

## Verification

Against an instance loaded with `make fixtures_load catalogs=default`, so the `fio_*` and
`llv_*` source fields genuinely do not exist:

- `npx tsc --noEmit` clean.
- `/example/com_fr/search?q=dress` renders 140 product cards, zero GraphQL errors.
- `/example/fr_fr/search?q=bag` renders 59 product cards, zero GraphQL errors.

Before the fix the same requests produced zero cards and
`Cannot query field "llv_is_eco" on type "Product"`.

## Note

`CATALOG_AXIS_CODES` still has to be extended when a catalogue is added — that part of
`bugfix-listing-axes-missing-for-new-catalogs.md` stands. What changed is the blast radius:
forgetting an entry now costs that one catalogue its variant pickers, instead of breaking the
query for all of them.
