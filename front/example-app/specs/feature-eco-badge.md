# Feature: eco badge

## Status: implemented
## Page/Component
`src/sdk/fields.ts`, `src/sdk/productFields.ts`, `src/components/EcoMark.tsx` (new),
`src/components/ProductCard.tsx`, `src/views/ProductPage.tsx`, `src/styles.css`,
`src/locales/{en,fr,de}/product.json`.
Data side, in the `gally-sample-data` repo: `02_papershop`, source field `llv_is_eco`.

## Why

`02_papershop` has a virtual category, `Sélection éco-responsable` (`cat_llv_54`), whose rule is
`llv_is_eco = true`. It holds 104 of the 250 products and is the repo's only virtual category that
selects on something a visitor can care about.

A virtual category looks exactly like a static one: the listing gives no clue that a rule picked
its contents. The point of marking the products is to make the rule visible — every card in that
listing carries the same mark, and the same mark turns up on a fraction of the cards in every
other listing, which is the rule's reach.

`feature-product-picture-badges.md` already draws badges from `getProductBadges()`, but a card
shows **exactly one** (`ProductCard.tsx`, `.slice(0, 1)`), and that spec makes "sale outranks new
outranks material" a `MUST NOT change`. Measured in the fixtures: of the 104 eco products, **16
are on sale and 11 are new**, 23 distinct. A fourth badge ranked below sale and new would
therefore be missing from 23 of the 104 cards in the very listing it exists to explain, and
ranking it above sale would delete 16 sale pills from the catalogue as a side effect.

So the eco mark is not a badge. It sits in the opposite corner, outside the single-badge slot, and
never competes with one.

## Behaviour (testable)

- [x] A product with `llv_is_eco === true` draws a green text pill in the **top-right** of its
      picture, on the card and on the PDP hero, from the same rule.
- [x] The existing badge stack is untouched: still top-left, still exactly one on a card, still
      the full list on the PDP.
- [x] A product carrying both draws both. `LLV-PAP-AGE-008` is eco and on sale: its server-rendered
      HTML contains `product-card-badge--sale` and `product-card-badge--eco` together. This is the
      case the design exists for.
- [x] Products outside `02_papershop` are unaffected, and their own badges still draw:
      `com_fr/category/cat_5` renders 14 cards, 0 eco pictos, 2 sale and 10 material pills;
      `fashion_fr/category/cat_fio_16` 0 pictos and 9 sale pills; `toolbox_fr` 0 pictos.
- [x] Every card in the virtual category carries it: `papershop_fr/category/cat_llv_54` renders 20
      cards and 20 pictos, four of which also show a sale pill.
- [x] The rule's reach is visible outside that listing too: `category/cat_llv_2` (Papeterie, mixed)
      renders 20 cards and 7 pictos.
- [x] The picto is server-rendered, present in HTML fetched with curl and no JavaScript executed,
      because `PRODUCT_FIELDS` is shared by `src/sdk/server.ts` and the client hooks.
- [x] The picto carries an accessible label in all three locales, as `title` and `aria-label`:
      "Sustainable materials" / "Matières durables" / "Nachhaltige Materialien", each appearing
      twice in the PDP HTML.
- [x] `npx tsc --noEmit` clean inside the `example` container; dev server compiles with no `⨯`.

**Verified from markup and CSS, not from a rendered screenshot:** that the picto lands in the
top-right and cannot overlap the badge stack. The two wrappers are the same absolutely-positioned
box at the same `top`, one anchored `left` and the other `right`, so overlap needs a card narrower
than the two pills combined — well below `--product-grid-column`. Worth one look in a browser
before this is demoed.

## SDK contract used

`PRODUCT_FIELDS` gains `'llv_is_eco'`. It is a **bare boolean**, like `new` and `sale` — a boolean
source field, not a select, so no `{ label value }` sub-selection (that is a GraphQL error) and the
filter input would take a real `Boolean`. Confirmed present on the GraphQL `Product` type by
introspection: the type carries 235 fields, one per source field across every catalog, because all
four catalogs share a single `product` metadata.

Asking every catalog for a field only one of them uses costs nothing and is the established
pattern — `fields.ts` already does it for the `fashion_*` axes and says so.

`isEco` is derived in `getProductFields()` with `=== true`, not a truthiness check, for the reason
already written next to `isNew`: in the raw `_source` an unset boolean attribute is `[]`, and `[]`
is truthy. `02_papershop` happens to write an explicit `false`, but the guard is what makes the
rule safe on a catalog that does not.

## Tracking (required)

None added, none changed. The picto is presentational, sits inside the existing
`.product-card-image` box, and touches no handler. Page view, search, product view and add-to-cart
all fire exactly as before.

## UI constraints

- **No new visual primitive.** The picto reuses `.product-card-badge` with an `--eco` modifier.
  What is new is a positioning wrapper, `.product-card-badges--corner`, which changes only which
  corner it anchors to — the same relationship `.product-card-badges` already has to the pill.
- **Text, no glyph.** Two cuts were thrown away getting here. The first was an icon-only leaf,
  which nobody read as "sustainable" without being told. The second kept the leaf beside the word,
  which was legible but left a hand-drawn bezier in the codebase with no provenance — and it would
  have been the only inline `<svg>` in `src/components` and `src/views`. This app has no icon
  system: every other glyph is a text symbol or an emoji in an i18n string, `"✓ Added"` being the
  precedent for one inside a coloured pill. So the mark is what the other three badges already
  are, a word in a coloured pill: Eco / Éco / Öko, with the attribute's full label
  ("Matières durables") as the `title`. Terse on the card, unambiguous on hover.
- **Colour is `--green-800` (#2e7d32), a token added for this.** This is the one badge whose colour
  carries the message; no amount of indigo says sustainable, so it steps outside the
  coral-promotes / indigo-classifies split the other three follow, and the spec is where that
  exception is recorded.
- **It is not `--success`, the only pre-existing green.** Two independent reasons, either
  sufficient. `--success` already means "added to cart" on this very component —
  `.product-card.just-added` plays that glow — so a chip in the same green would read as state
  rather than as a property. And white text on `--success` reaches only **2.78:1**, under the
  4.5:1 that AA requires for the badge's 0.7rem text. `--green-800` is **5.13:1**, and is far
  enough from `--success` to not read as the same signal.
- `docs/design-system.md` gained the token and the reason, per its own rule at line 64: add the
  token there first, then use it.
- `.product-card-badge--eco` sets a background and nothing else. Padding, radius, weight and
  size all come from the base pill, so no hex, px or font-size was introduced.

## MUST NOT change

- **The eco mark must never enter `getProductBadges()`.** That list is ordered by priority and
  truncated to one by the card. Putting eco in it re-introduces the exact collision this feature
  exists to avoid: either 23 of 104 eco cards lose their mark, or 16 sale pills disappear.
- **`.product-card-badges--corner` must stay a position-only modifier.** If it grows its own
  background, radius or font, the pill has been forked and there are two badge idioms again. The
  colour belongs to `.product-card-badge--eco`, which is a variant like `--sale` and `--material`.
- **`--green-800` must not be swapped for `--success`** to "reuse the green we already have". That
  is the change this spec exists to prevent: it collides with the add-to-cart glow on the same
  component and drops the text to 2.78:1 contrast.
- **Do not put an icon back in this pill** without first deciding where icons come from in this
  app. There is no icon library and no icon asset; a one-off inline SVG here was tried and removed
  precisely because it had no provenance and no second user.
- **The card's `.slice(0, 1)` stays.** The picto does not live in that array, so raising the slice
  to "make room" would only stack sale and new pills, which
  `feature-product-picture-badges.md` forbids for its own reasons.
- **`'llv_is_eco'` must stay in `PRODUCT_FIELDS`**, not be inlined at a call site. The shared
  constant is what keeps the SSR fetch and the post-hydration refetch in lockstep; a one-off list
  makes the picto flicker in after hydration.
- **`isEco` must keep `=== true`.** A `||` or a truthiness check badges every product on any
  catalog whose documents omit the field.
- `EcoMark` is imported by both `ProductCard` and `ProductPage` on purpose. Inlining the SVG in
  either is how the two surfaces start to disagree.

## Notes / not done

- The mark is papershop-only today because `llv_is_eco` is the only flag wired. `01_fashion` has
  `fio_vegan`, `fio_handmade` and `fio_hypoallergenic`, which are the cheapest next candidates:
  one more field in `PRODUCT_FIELDS` and one more condition, no new CSS.
- No facet or filter was added for `llv_is_eco`. The attribute is already `isFilterable`, so it
  can surface as a facet on its own once coverage rules allow; that is data and admin, not app.
- The virtual category's own product count reads 0 in `getCategoryTree` while the listing returns
  104. That is a backend gap recorded in the catalog guide, unrelated to this feature.
