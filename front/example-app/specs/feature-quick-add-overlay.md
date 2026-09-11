# Feature: quick-add overlay with inline configuration

## Status: implemented

## Page/Component
`src/components/QuickAdd.tsx` (new), `src/components/ProductCard.tsx`,
`src/components/SearchOverlay.tsx`, `src/components/VariantSelector.tsx`, `src/sdk/fields.ts`,
`src/sdk/productFields.ts`, `src/styles.css`, `src/locales/{en,fr,de}/product.json`.
Data, in the `gally-sample-data` repo: `src/DataFixtures/product_source_field.yaml`,
`src/DataFixtures/product_source_field_label.yaml`.

## Problem

A listing card called `addToCart({ sku, name, price, childSku: sku, image })` with no choice
offered. On the Venia catalogue the demo runs on, **70 of 85 products are configurable** — so the
common case was a blind add of a parent SKU with no size and no colour.

The root cause is not the button, it is that **the card could not tell a configurable from a
simple product at all.** `type_id` and `configurable_attributes` existed only inside `source`;
`source` is deliberately excluded from `PRODUCT_FIELDS` (~3 KB × 20 rows per grid, category and
autocomplete request); so `getProductFields` fell back to `typeId: 'simple'` for every listing row
and the card had nothing to branch on. The wrong belief was that this was a UI decision — it was a
missing field.

## What this does not fix, and does not pretend to

`feature-configurable-option-selection.md` records that the index carries `children.sku` but **no
per-child attribute values**, so a chosen combination still cannot resolve to a real child SKU.
This feature keeps the product page's honest behaviour: send the **parent** SKU with the chosen
labels as `variant`. The selection is now *stated* rather than *guessed* — it is not resolved.

## Behaviour (testable)

- [x] Add-to-cart moved out of the card body into a panel covering the picture, revealed on
      `:hover` and `:focus-within`. Verified: 14/14 cards on `cat_5` render one panel each, and
      the served CSS carries `opacity: 0; pointer-events: none` at rest with the hover/focus rule
      flipping both.
- [x] A **simple** product's panel is just the button, enabled, reading "Ajouter au panier".
      Verified on `/com_fr/category/cat_5`: 12 enabled buttons, 0 axis rows.
- [x] A **configurable** product's panel renders its axes as compact chips and the button is
      **disabled until every axis is answered**, reading "Choisir les options" until then.
      Verified on `/com_fr/category/cat_14`: 8 configurables → 16 axis rows (2 axes each),
      48 colour swatches, 40 size chips, all 12 buttons disabled (8 unanswered + 4 unavailable).
- [x] Out of stock still wins: the button reads "Indisponible" and is disabled regardless of axes.
      Verified: 4 such cards on `cat_14`.
- [x] The autocomplete row uses the same component, so a configurable cannot be blind-added there
      either. It keeps its own presentation — the panel stays in flow as the row's trailing
      control rather than covering anything, and **reveals on hover by sliding in from the right**
      (0.75rem, inside the row's 1rem right padding so no transformed box escapes the column).
      Because the panel keeps its space reserved, nothing reflows when it appears.
- [x] That ACP reveal also fires on `.highlighted` — the popup is arrow-key navigable, and
      without it the add button would exist only for people using a mouse.
- [x] The product page is unchanged: full axis headings, no compact rows. Verified on `VSK12`
      (2 headings) and `VA11-GO-NA` (0).
- [x] `npx tsc --noEmit` clean in the `example` container; dev server compiles with no `⨯`.
- [ ] **Not verified interactively** — no browser was available this session. The gating, the
      hover reveal, the cart line's variant string and the ACP staying open on add were reasoned
      through and are correct by construction, but nobody has clicked them. See *Manual checks*.

## SDK contract used

`PRODUCT_FIELDS` gains `configurable_attributes`, `fashion_size { label value }`, and Luma's
`color`/`size` pair so the feature is not Venia-only. Asking for an axis a catalogue does not use
costs nothing — the GraphQL `Product` type is global, so it returns null.

### The trap: `configurable_attributes` is a String, not a list

Declaring the source field is what puts it on the GraphQL type. Once there, it arrives in **four
shapes**, all measured on `com_fr` after a fixtures load:

| Shape | When | Count |
|---|---|---|
| `["fashion_color","fashion_size"]` (real array) | the raw `_source`, on the PDP | — |
| `"[\"fashion_color\",\"fashion_size\"]"` (JSON in a string) | GraphQL, 2+ axes | 66 |
| `"fashion_size"` (bare string) | GraphQL, 1 axis | 4 |
| `null` | GraphQL, 0 axes | 15 |

This is Gally's doing, not ours: `SourceFieldAttributeMapping` maps both `keyword` and `text` to
`TextAttribute`, whose `getSanitizedData()` returns `current($value)` for a one-element array and
`json_encode($value)` for anything longer, and whose GraphQL type is `String`. **No source-field
type emits a list of scalars** — `listOf` appears only in filter *input* types — so there is no
cleaner field to ask for. `parseAxisCodes()` in `src/sdk/productFields.ts` absorbs all four and is
the only place that knows.

## Tracking (required)

`ADD_TO_CART` still fires from listings, for simple and configured adds alike — the card adds in
place rather than navigating away, so no event was traded for the fix. Unchanged: the event is
pushed by `CartContext.addToCart`, with `child_sku` falling back to the parent SKU.

## UI constraints

- No new primitive. The chips are the existing `.swatch` and `.variant-option`, reused through
  `VariantSelector`'s new `compact` prop; the button is the same `.btn-primary`.
- Tokens only: `--white`, `--shadow-md`, `--gray-400`. No raw hex, px or font-size.
- **Superseded on this point by `feature-quick-add-bottom-band.md`:** the panel is now a
  bottom-anchored band of its content's height (`inset: auto 0 0 0`), because the listing picture
  grew to 300px and a full cover hides the product. The rest of this spec still holds, but note
  that the containment guard named below — "the panel is exactly its container" — is gone, and
  `.product-card-image`'s `overflow: hidden` now carries it alone.
- The panel **covers the whole picture** (`inset: 0`) and **rises from its bottom edge**:
  `translateY(100%)` → `translateY(0)` over 0.25s, with the opacity settling faster (0.15s) so
  the rise is what you actually see rather than a fade that happens to move.
- **Unavailable buttons do not react to hover.** See *The disabled-hover trap* below.
- It is **translucent + blurred**, not opaque: you keep seeing the product you are configuring.
  `--scrim-light` (a new token, `rgba(255,255,255,0.55)`) over `backdrop-filter: blur(6px)`. The
  blur is what carries legibility over arbitrary photography — a flat tint that reads over the
  placeholder gradient would not survive a dark garment. That is also what lets the tint stay
  this light: **lowering the alpha without the blur would make the chips unreadable.**
- The option chips get their **own opaque ground** (`--white` fill, `--gray-400` border) and the
  swatches a firmer 2px edge at 22px. Facet-sidebar styling washes out against a translucent
  backdrop, and a swatch that does not show its colour clearly carries no information at all.
- **The button sits on the bottom edge**, so the row of them lines up across the grid whatever
  number of option rows a product has above it. "Unavailable" is the same button, so it aligns
  too. Done with `margin-top: auto` rather than `justify-content: flex-end` on the panel — with
  the panel scrollable, flex-end makes overflowing content unreachable off the top.
- **`-webkit-backdrop-filter` first, standard last.** lightningcss treats the pair as one
  property and keeps only the last; standard-first ships `-webkit-` alone and Blink drops the
  blur silently (`bugfix-acp-scrim-blur-dropped.md`). Verified on the **served** chunk, not the
  source: 0 `-webkit-backdrop-filter`, `backdrop-filter: blur(6px)` present.
- `@media (hover: none)` releases `top` so the panel sits at the bottom edge at its natural
  height with the blur off — a permanent full-picture blur is not a resting state, and without
  the rule entirely add-to-cart would not exist on a phone at all.
- `@media (prefers-reduced-motion: reduce)` cuts the fade.

## The overlap bug this design also fixes

The first implementation parked the panel at `transform: translateY(100%)` at rest. That does not
hide it — it moves it **below the picture**, which is to say directly on top of the name and the
price, invisible but still swallowing their clicks at `z-index: 2`. `.product-card` has
`overflow: hidden`, but it clips at the *card* edge, not the picture edge, so nothing caught it.

Two independent guards now:

- The panel is exactly its container (`inset: 0`), so it has nowhere to overflow to.
- `.product-card-image` carries `overflow: hidden` of its own.

And at rest it is `opacity: 0` + **`pointer-events: none`** — deliberately not `visibility: hidden`,
which would drop the panel out of the tab order and make `:focus-within` unable to ever reveal it.

The bottom-to-top animation reintroduces the same `translateY(100%)` the original bug used. That is
safe *only* because all three guards are now in place at once — the clip contains it, the opacity
hides it, and `pointer-events` disarms it. Treat them as one mechanism, not three optional niceties.

## The disabled-hover trap

An unavailable product's button was lighting up indigo under the cursor. The cause is ordering, not
a missing rule: `.quick-add-button:disabled` sets the grey, but `.btn-primary:hover` is declared
*further down the file* at the same (0,2,0) specificity, so hovering simply overrode it.

**The obvious fix is wrong.** Adding `:not(:disabled)` to `.btn-primary:hover` lifts that shared
rule to (0,3,0) — where it starts beating `.btn.added` (0,2,0), and the add confirmation silently
dies for exactly as long as the pointer rests on the button you just clicked. That is the failure
the comment above `.btn.added` already warns about; the file's whole ordering around those two
rules exists to avoid it.

So the fix matches harder locally instead: `.quick-add-button:disabled:not(.added):hover` at
(0,4,0). The `:not(.added)` is not decoration — a configurable's button goes disabled again the
instant it is added, while still showing "✓ Added", so without it the green confirmation would be
repainted grey on the very hover that triggered it.

## Data (gally-sample-data)

`configurable_attributes` declared as a `keyword` source field, all flags off: it is plumbing, not
merchandising — never searched, never a facet. Gally already hardcodes this field as `keyword` in
the base mapping it applies to every index it creates (`IndexRepository.php:458`), so the
declaration aligns with that rather than competing with it. No document edits: the field is already
present in all 85 Venia documents. Labels added for `com_en` and `com_fr`.

## MUST NOT change

- **`PRODUCT_FIELDS` must not gain `source`.** The standing rule from
  `feature-configurable-option-selection.md`. `configurable_attributes` exists precisely so that
  the listing does not need it.
- **Never synthesise a child SKU.** No `{sku}-{index}`, no parsing colour codes out of
  `children.sku`. The suffixes are opaque and inventing one poisons the tracking data the
  recommender and popular-terms modules consume.
- **The `<Link>` must keep wrapping only the picture, not the whole `.product-card-image` box.**
  It used to wrap the box; the panel's buttons and chips cannot live inside an anchor — nested
  interactive elements are invalid HTML, and in practice every chip click would also navigate.
  This is the single easiest thing to undo by accident while tidying the card's JSX.
- **The ACP button keeps its `autocomplete-add-to-cart` class** (passed via `buttonClassName`).
  Five existing rules target it, including a (0,4,0) selector whose whole job is stopping the card
  fade and hover scale from animating under the add confirmation. Dropping the class silently
  breaks the confirmation.
- **`.quick-add-button:disabled` must stay declared before `.btn.added`.** Equal specificity
  (0,2,0), so document order is what lets the green confirmation beat the grey disabled tint.
- **`.product-card-image` must keep `overflow: hidden`.** The panel is parked at
  `translateY(100%)` at rest — a full panel height below the picture — and that clip is the only
  thing containing it. Remove the clip and the resting panel lands back on the name and price,
  which is the original bug. `opacity: 0` and `pointer-events: none` are the second and third
  guards; keep all three.
- **`.quick-add-button:disabled:not(.added):hover` must keep both its `:disabled` and its
  `:not(.added)`.** It exists at (0,4,0) to out-rank `.btn-primary:hover` (0,2,0) without
  touching that shared rule — see *The disabled-hover trap* below.
- **At rest it is `pointer-events: none`, never `visibility: hidden`** — the latter breaks the
  keyboard path entirely, on both the card and the ACP row.
- **The ACP reveal must keep its `.highlighted` selector**, or the add button disappears for
  keyboard users while looking perfectly fine to whoever tests it with a mouse.
- **The ACP's reduced-motion override must stay declared *after* `.autocomplete-product
  .quick-add`.** Media queries add no specificity, so moving it up beside the card's block
  silently loses to the later rule and the slide keeps playing.
- **The scrim alpha and the blur are a pair.** Dropping `backdrop-filter` while keeping a 0.55
  tint leaves the chips floating unreadably over photography.
- **Line identity stays `sku + variant`** (`bugfix-cart-variant-line-identity.md`). The variant
  string is built in axis order, matching the product page exactly, so the same combination lands
  on the same line whichever surface added it.
- Availability is still `getProductFields().available`, never `stock.status` directly.

## Known divergence, open for a decision

**The overlay gates on a complete selection; the product page does not.**
`feature-configurable-option-selection.md` states "add-to-cart must not be gated on a selection",
reasoning that the parent SKU goes either way so gating buys nothing. That reasoning holds on a
page where the axes are large and unmissable; it does not hold on a hover panel whose entire
purpose is capturing the combination. The two surfaces are therefore deliberately different today.
Worth resolving one way or the other rather than leaving as an accident.

## Manual checks still owed

1. Hover a configurable card → panel slides up; pick colour **and** size → button enables; add →
   cart line shows "Doré / M" as its variant.
2. Add the same product twice with **different** combinations → two separate cart lines.
3. Tab to a card → panel appears via `:focus-within` and the chips are reachable.
4. In the autocomplete, add from a row → the popup stays open and the row flashes green.
5. On a touch device or with hover emulation off → the panel is visible at rest.

## Notes

- After an add the selection resets, so the button returns to "Choisir les options" rather than
  re-adding the same combination on a second click.
- `src/hooks/useStoryActions.ts:194` targets `.product-detail-actions .btn-coral`, which stopped
  existing when the product page's button became `.btn-primary`. The demo story's add step falls
  through today. Pre-existing, untouched, and in this blast radius.
