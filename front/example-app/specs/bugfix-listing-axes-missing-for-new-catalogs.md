# Bugfix: quick-add ignores variants in the newer catalogues

## Status: implemented
## Page/Component
`src/sdk/fields.ts`. Behaviour visible in `src/components/ProductCard.tsx` and
`src/components/QuickAdd.tsx`, neither of which changed.

## Problem

On a listing in Fiora Fashion, the mini add-to-cart button put a configurable product straight
into the basket without asking for a colour or a size. Reported on `FIO-FRO-RL-008`, a dress with
12 children, but it affected **all 409 configurables in `01_fashion` and all 51 in `02_papershop`**.

### Root cause

Not the data, which is what it looked like at first. Asked directly, the API returns everything
needed for that SKU: `configurable_attributes` is `["fio_color","fio_clothing_size"]`, and the
two fields carry 3 colours and 4 sizes with translated labels. The fixtures are complete — field
labels and option labels are present in all three locales for all three catalogues.

The wrong belief was that `PRODUCT_FIELDS` asks for whatever axes a product declares. It cannot:
GraphQL needs every field named up front, so the list hardcodes them, and it was written when only
Venia and Luma existed. It named `fashion_color`, `fashion_material`, `fashion_size`, `color` and
`size` — and nothing else.

So on a Fiora row `source.fio_color` was simply absent. `getVariantAxes()`
(`src/components/VariantSelector.tsx`) maps each declared axis code to `source[code]`, builds its
options from that, then drops any axis whose option list is empty. Every axis was dropped, the
card saw `axes.length === 0`, and `QuickAdd` fell through to the plain add-to-cart it uses for
simple products.

No error anywhere. The row looked like a valid simple product, because from the projection's point
of view that is exactly what it was.

The comment above the list even said "asking for an axis a catalogue does not use costs nothing" —
true, and the reason the fix is safe. What nobody did was add the axes of the three catalogues
that arrived later.

## Behaviour (testable)

- [x] On a Fiora listing, a configurable product opens the quick-add overlay with its axes and
      does not add to the basket until every axis is answered. Verified on `FIO-FRO-RL-008`:
      3 colours and 4 sizes.
- [x] The same holds in Le livre & le lièvre, whose axes are `llv_color`, `llv_format` and
      `llv_material`.
- [x] Venia and Luma are unchanged — their axes were already in the list.
- [x] Toolbox Bricolage is unaffected: it has no configurable products at all.
- [x] A simple product still adds in one click, in every catalogue.
- [x] `npx tsc --noEmit` clean inside the `example` container.

## The complete axis set

Measured from the fixtures, by reading every distinct `configurable_attributes` value per
catalogue:

| Catalogue | Axes | Already asked for? |
|---|---|---|
| `default` (Venia) | `fashion_color`, `fashion_size` | yes |
| `default` (Luma) | `color`, `size` | yes |
| `01_fashion` | `fio_color` plus one of `fio_clothing_size`, `fio_bottom_size`, `fio_men_size`, `fio_outerwear_size`, `fio_shoe_size`, `fio_lingerie_size`, `fio_sport_size` | **no** |
| `02_papershop` | `llv_color`, `llv_format`, `llv_material` | **no** |
| `00_toolbox` | none | n/a |

Eleven fields added. Fiora varies size by garment family, which is why it needs seven size axes
rather than one.

## SDK contract used

`PRODUCT_FIELDS` only. No query, request type or sort changed, so ranking is untouched. The added
fields are `{ label value }` selections on select attributes, the same shape as the four that were
already there, and they return null in catalogues that do not use them.

## Tracking (required)

Unchanged. This fixes what the add-to-cart button does *before* it adds; the add itself, and the
`trackAddToCart` call behind it, are the same code.

## UI constraints

No styling, no new primitive, no new token. The overlay this restores was already built and
specified in `feature-quick-add-overlay.md`; it simply never had data to work with here.

## MUST NOT change

- **A catalogue that introduces a variant axis must add that axis to `PRODUCT_FIELDS` in the same
  change.** This is the coupling that broke: the data was correct and complete, and the listing
  still behaved as though the product were simple, silently. There is no error to catch it.
- **Do not reach for `source` to avoid maintaining this list.** `PRODUCT_DETAIL_FIELDS` exists for
  that and is deliberately kept off listings — `source` is the whole document, about 3 KB for a
  configurable, twenty rows at a time. The standing rule from
  `feature-configurable-option-selection.md` still holds.
- **Do not "tidy" the list by dropping axes that return null.** Null in one catalogue is the axis
  another catalogue depends on; that is the whole design of a global Product type.
- `getVariantAxes()`'s final `.filter(axis => axis.options.length > 0)` must stay. It is correct —
  an axis with no options cannot be offered — it was just hiding a projection gap. Removing it
  would render empty radio groups instead.

## Notes / not done

- **The axis heading still falls back to the raw attribute code.** `VariantSelector` reads
  `t('page.axis.<code>')` with the code as its default, and `src/locales/*/product.json` carries
  keys for Venia's and Luma's four axes only. The eleven new ones have no key.
  Measured after this fix: a Venia listing announces "Couleur" and "Taille", a Fiora listing
  announces `fio_color` and `fio_clothing_size`.
  The compact overlay does not render the visible `<h4>`, so nothing looks wrong on screen — but it
  passes the same string to `aria-label` on the radiogroup, so **a screen reader on a Fiora or
  Le livre listing hears the raw attribute code**. Sighted users see the correct behaviour; this is
  an accessibility gap, not a cosmetic one, and it is worth fixing sooner than "some time".
  Separate change: the labels exist, translated, in the search response's `aggregations`.
- Gally does hold these labels, translated, and returns them publicly in the search response's
  `aggregations` (`fio_color` → Colour / Couleur / Farbe). The admin endpoints that also hold them,
  `/api/source_field_labels` and `/api/source_fields`, require authentication and the storefront
  has none. That is the material for the label fix, not for this one.
