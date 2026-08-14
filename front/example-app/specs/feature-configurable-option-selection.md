# Feature: Configurable option selection on the product page

## Status: implemented
## Page/Component: src/components/VariantSelector.tsx (new), src/views/ProductPage.tsx, src/sdk/fields.ts, src/sdk/server.ts, src/hooks/useSearch.ts, src/components/swatchColors.ts (new, extracted from src/components/Facets.tsx)

## Problem

70 of the 85 products in the default `com` catalog are configurables, and the PDP had no working
option selector. The block at `ProductPage.tsx:125-140` looked like one and could never render:

1. It read `products[0]?.source?.fashion_color`, but `PRODUCT_FIELDS` never requested `source`, so
   `colors` was always `[]` and `hasVariants` always `false`. The wrong belief was that a product
   item carries a `source` wrapper by default — it does not. GraphQL `Product` **does** expose a
   `source` field (verified by introspection); the app simply never selected it, and the SDK returns
   product collection items with the stitched fields flat at the top level, no envelope. Note this
   is the *opposite* shape from non-product entities, where `Response` projects `data._source` into
   a flat object — see `bugfix-cms-selected-fields-projection.md`.
2. `type_id` was not requested either, so `p.typeId` was `undefined` and the type badge read
   "Simple" for every product, configurables included. `type_id` and `configurable_attributes` are
   **not** typed fields on `Product`: they are not declared source fields, so the stitching never
   adds them (introspection returns 118 fields; neither is among them). `source` is the only way to
   reach them.
3. Consequently `p.typeId === 'configurable'` was never true, and the invented child SKU on line 160
   — `` `${p.sku}-${selectedVariant}` ``, an *array index*, giving `VSK12-0` — never actually
   reached the cart. It was a live landmine, not a live bug: fixing (2) alone would have started
   emitting non-existent child SKUs into the `add_to_cart` and order tracking payloads.
4. The one axis it did try to render was hardcoded to `fashion_color`, so the four size-only
   configurables (`VA07`–`VA10`, the belts, `configurable_attributes: ['fashion_size']`) would have
   shown a one-option colour selector and hidden the axis that actually varies.

## What the data does and does not support

**A chosen combination cannot be resolved to a child SKU, and this feature does not pretend
otherwise.** `children.sku` is indexed (20 real SKUs for `VSK12`, e.g. `VSK12-RN-8`), but no
per-child attribute values are: only `children.sku`, `children.url_key`, `children.description`
and `children.indexed_attributes` exist, and those are **deduplicated value sets, not per-child
arrays** — `VSK12` carries 20 skus and 1 url_key. There is no correlation to read, even though
`children_attributes` claims children carry `fashion_color`/`fashion_size`. So:

- Add-to-cart sends the **parent** SKU and records the chosen labels as the cart line's `variant`.
- **The page does not switch to a child's stock, price or image when the selection changes**, and no
  storefront could: the instance's 112 product source fields contain no children field, `stock` is a
  single `{status, qty}` object on the parent (`StockAttribute::getFields()`), and children are not
  documents — an `equalFilter` on `VSK12-RN-8` returns 0 rows. See
  `bugfix-stock-count-zero-on-parents.md`.
- Nothing can be greyed out as unavailable, because the availability matrix is not in the index.
  The axes are the parent's option lists, which are a **superset** of what children exist:
  `VSK12` offers colour `Doré` (no child carries it) and sizes `XL`/`2` (children have `4/6/8/10`
  plus one size-less SKU).

Fixing that belongs to `api/packages/gally-sample-data`, not here. Reading child data through the
typed GraphQL path would not help either: nested source fields go through `NestedAttribute`, whose
`getSanitizedData()` calls `current($value)` on a list and would return only the first child.

## Behaviour (testable)

- [x] Axes come from `source.configurable_attributes`, in that order, keeping only codes that have
      at least one option in `source`. Deriving them from "every select attribute with >1 value"
      would promote `fashion_material` and `fashion_style` into axes, which they are not.
- [x] `VSK12` (`com_fr`): two axes — `Couleur` as 5 swatches, `Taille` as 6 chips; badge reads
      "Configurable" (previously "Simple").
- [x] `VA07` (belt, `configurable_attributes: ['fashion_size']`): a **size** axis only, `S M L XL`.
      This is the case the old code got backwards.
- [x] `VA11-GO-NA` (simple): no selector at all, badge "Simple".
- [x] `MH01` on `fr_fr` (Luma, `configurable_attributes: ['color','size']`): both axes render with
      localized headings — nothing is hardcoded to `fashion_*`.
- [x] Sizes are ordered by `sizeRank()`, not by the order they arrive in: numerics ascending, then
      the alpha scale in wearing order, then unrecognised labels (stable). `VSK12` renders
      `2 4 6 8 10 XL` where `_source` order is `XL 8 6 4 10 2` and the aggregation's is
      `10 2 4 6 8 XL`. `VD01` renders `XS S M L XL`.
- [x] Colour options are sorted by label (`localeCompare`) for the same reason — neither source
      carries the source field's `position`.
- [x] Nothing is pre-selected. `selectedOptions` starts `{}`; the previous `useState(0)` claimed a
      colour choice the user never made. Add-to-cart stays enabled, since the SKU sent is the same
      either way.
- [x] The cart line's `variant` is the selected labels joined `" / "`, or `undefined` when nothing
      is selected. `childSku` is no longer passed at all; `CartContext` already falls back to
      `item.sku`, so the `add_to_cart` payload's `child_sku` is the parent SKU.
- [x] Every axis renders in the **server** HTML, not after hydration: `curl` of
      `/example/com_fr/product/VSK12` contains both `role="radiogroup"` blocks with all 11 options.
      This is the invariant `bugfix-ssr-product-list-behind-suspense.md` exists to protect.
- [ ] Cart: `VSK12` added as "Pluie / M" and again as "Menthe / L" produces two lines that remove
      and re-quantify independently. **Not verified — requires browser interaction, which was not
      available in this session.** The context-level change is specced separately in
      `bugfix-cart-variant-line-identity.md`.
- [ ] The `add_to_cart` tracking payload's `child_sku` equals the parent SKU. **Not verified for
      the same reason**; verified by code path only (`CartContext.tsx:53`).

## SDK contract used

- New `PRODUCT_DETAIL_FIELDS = [...PRODUCT_FIELDS, 'source']` in `src/sdk/fields.ts`, used by
  **both** PDP callers — `fetchProductBySku` (`src/sdk/server.ts`) and `ProductPage`'s `useSearch`.
  They must stay identical or the post-hydration refetch drops the `source` the server pass
  rendered the axes from; that is the trap the file header already warned about.
- `useSearch` gained an optional `selectedFields` option defaulting to `PRODUCT_FIELDS`, rather
  than a second hook.
- `source` is deliberately **not** added to `PRODUCT_FIELDS`: it is the whole raw document (~3 KB
  for `VSK12`) and the grid, category listings and autocomplete request 20 at a time.
- The axis heading is an i18n key (`product:page.axis.<code>`), **not** the matching aggregation's
  localized label. The label is available (`fashion_color__value` → "Couleur"), but
  `fetchProductBySku` returns the document only and `ProductPage` seeds `aggregations: []`, so a
  heading taken from there would be absent in the SSR HTML and pop in on hydration.

Side effect, checked rather than fixed: `getProductFields` does `product.source || product`, so on
the PDP it now takes the `source` branch — which is what its comment always claimed. Verified
field by field against a live `VSK12`: `name`/`description` arrive as arrays (already unwrapped),
`price` as `[{price, original_price, is_discounted}]` (already handled by the `??` chain), `stock`
as `{status, qty}`. `new` is absent from `_source`, so `isNew` is false on the PDP — which renders
no "new" badge.

## Tracking (required)

- `TrackingEventType.PRODUCT_VIEW` on mount: unchanged.
- `TrackingEventType.ADD_TO_CART` via `CartContext`: unchanged call, but its `child_sku` is now the
  parent SKU instead of a fabricated `{sku}-{index}` string. No tracking call was added or removed.

## UI constraints

- **No CSS added.** Swatches reuse `.facet-swatches`/`.swatch` from the colour facet; chips reuse
  the existing `.variant-option`/`.variant-options`. No third chip idiom (golden rule 3).
- `src/components/swatchColors.ts` holds raw hex, as `Facets.tsx` did before the extraction. These
  approximate a **product attribute's values**, not design-system colours, and cannot be tokens —
  see the note added to `docs/design-system.md`.
- Options are `role="radio"` inside a `role="radiogroup"` labelled by the axis heading, keyboard
  operable via Enter/Space. `Facets.tsx`'s swatches were left as they are; retrofitting them is
  out of scope.
- New strings in all three locales (`page.axis.*` in `src/locales/{en,fr,de}/product.json`), and
  the now-unused `page.color` was removed. Checked on `com_fr`, which is what the app lands on.

## MUST NOT change

- **`PRODUCT_FIELDS` must not gain `source`.** It is shared by the grid, category listings and
  autocomplete; adding the raw document there multiplies every listing payload by 20.
- **The two PDP field selections must stay the same list.** If one drifts, the page changes under
  the user after hydration.
- **Never reintroduce a synthesised child SKU.** No `{sku}-{index}`, no parsing colour codes out of
  `children.sku`. The child SKU suffixes are opaque 2-letter codes (`RN`, `MT`, `LL`, `LA`) that
  cannot be mapped to a localized label from the data, and inventing one poisons the tracking data
  the recommender and popular-terms modules consume.
- **Axes must keep coming from `configurable_attributes`**, never from a hardcoded attribute code —
  that is what makes the belts and the Luma catalog work.
- **Nothing pre-selected**, and add-to-cart must not be gated on a selection: the parent SKU is
  what gets sent either way, so gating would add friction without buying correctness.
- The type badge must keep reading `type_id` from `source`; it is not obtainable any other way.
