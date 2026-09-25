# Feature: configurable axis labels from the API

## Status: implemented
## Page/Component: src/components/VariantSelector.tsx, src/contexts/AxisLabelContext.tsx, app/[locale]/layout.tsx

## Why

Axis headings on a configurable product were i18n keys: `t('product:page.axis.<code>')` with the
raw code as fallback. `src/locales/{en,fr,de}/product.json` carried four codes — `fashion_color`,
`fashion_size`, `color`, `size` — so Venia and Luma read correctly and every newer catalogue did
not. Fiora Fashion showed `fio_clothing_size`, Le livre & le lièvre showed `llv_format`. Adding a
catalogue meant hand-writing three translations per axis, and the app never learned what the
catalogue itself already knew.

`GET /product_source_field_labels?codes[]=…&localizedCatalog=…` now answers exactly that question.
It is public, needs no token, takes an explicit code list and returns `{ code, label }` per code,
translated for the localized catalogue. See
`api/packages/gally-standard/src/Product/Entity/Source/ProductSourceFieldLabel.php`.

`specs/feature-configurable-option-selection.md` (lines 99-102) rejected the aggregation's
localized label for a concrete reason: the PDP's server pre-fetch returns the document only, so the
heading would be absent from the SSR HTML and appear on hydration. That objection does not apply
here — the labels are fetched in `app/[locale]/layout.tsx`, which already runs on the server and
already resolves the catalogue, so the heading is in the first byte of HTML.

## Behaviour (testable)

Checked against the running stack with `curl`, i.e. with no JavaScript, so a tick here also means
the string is in the server-rendered HTML.

- [x] `FIO-FRO-RS-003` on `fashion_{en,fr,de}` → `fio_color` reads Colour / Couleur / Farbe and
      `fio_clothing_size` reads Clothing size / Taille vêtement / Kleidergröße. Both were raw codes
      before this change.
- [x] `LLV-PAP-CRA-001` on `papershop_{en,fr,de}` → `llv_color` reads Colour / Couleur / Farbe.
- [x] `VA01` on `com_{en,fr}` → Color / Size and Couleur / Taille, unchanged from the hardcoded keys.
- [x] The heading is in the SSR HTML and does not change on hydration — the curl above carries it,
      and the dev server logs no hydration warning for those routes.
- [x] One request per catalogue per page load: the fetch is in `app/[locale]/layout.tsx`, beside
      `fetchCatalogs`/`fetchCategoryTree`, not in the PDP or in `VariantSelector`.
- [x] An axis the API has no label for renders `Ucfirst_code`, never blank — `fr_fr` renders
      `color` → Color and `size` → Size, which is that path.
- [~] The quick-add overlay announces the same label. **Verified indirectly**: the labels for the
      right locale are serialized into the listing page's payload (`Taille vêtement` on
      `fashion_fr`, `Kleidergröße` on `fashion_de`), and the overlay reads the same context. The
      overlay itself was not opened in a browser.

## SDK contract used

- Plain REST, not GraphQL, following `fetchCatalogs()` in `src/sdk/catalogs.ts`: `fetch` against
  `BASE_URI` with `Accept: application/ld+json`, reading `hydra:member`. `BASE_URI` already routes
  Node through `http://router/api` and the browser through `https://gally.localhost/api`.
- The code list sent is `AXIS_CODES`, newly exported from `src/sdk/fields.ts`. That file already had
  to name every catalogue's axes for the GraphQL selection; it is now the one list behind both the
  selection and the label request, so the two cannot drift.
- No `selectedFields`, no SearchManager — this endpoint is outside the search path.

## Tracking (required)

- None. This changes a heading's text, not a user action. Every existing
  `TrackingEventType` call on the PDP and in quick-add is untouched.

## UI constraints

- No markup, class or style change. `<h4>` heading, `product-variants` wrapper, swatch and
  `variant-option` rendering all stay exactly as they are. Only the string inside changes.

## MUST NOT change

- `getVariantAxes()` — axis discovery still comes from `source.configurable_attributes` via
  `parseAxisCodes()`, never from "every select attribute". Labels are a display concern and must not
  reach into discovery.
- The option ordering rules in `VariantSelector.tsx` (`sizeRank`, `ALPHA_SIZES`, the colour
  `localeCompare`). They exist because neither the raw `_source` order nor the aggregation order is
  useful.
- `isColorAxis()` deciding swatch vs text rendering **from the code**, not from the label. A
  translated label would break the `color`/`colour` test.
- Every axis code listed in `PRODUCT_FIELDS` stays requested in the GraphQL selection. The invariant
  from `specs/bugfix-listing-axes-missing-for-new-catalogs.md` holds: a catalogue that introduces an
  axis adds it in the same change. It now also earns that axis a label.
- `selected` starting empty. The PDP still claims no choice the shopper did not make.
- The compact quick-add variant still drops the visible `<h4>` and keeps the `aria-label`.
- The server must not fetch through `https://gally.localhost` — inside the container that is
  127.0.0.1 and refuses the connection.

## Known regression, accepted deliberately

Dropping `page.axis.*` makes the catalogue the single source of truth, which is the point. On the
demo dataset four catalogues have no label rows for their axes, so the endpoint returns
`ucfirst(code)` and those headings get worse than the hardcoded keys they replace:

| Axis | Catalogue | Before | After |
|---|---|---|---|
| `fashion_color` | `fr_fr`, `fr_en`, `en_fr`, `en_en` | Color / Couleur | Fashion_color |
| `fashion_size` | same four | Size / Taille | Fashion_size |
| `color` | `com_fr` and every `*_fr` | Couleur | Color |
| `size` | same | Taille | Size |

The fix is data, not code: add `SourceFieldLabel` rows for those codes in
`api/packages/gally-sample-data`. Doing it in the app would re-introduce the hardcoded list this
change removes.
