# Bugfix: removing one variant of a product removed every line of that product

## Status: implemented
## Page/Component: src/contexts/CartContext.tsx (`removeFromCart`, `updateQty`), src/views/CartPage.tsx

## Problem

A cart line is identified by **sku + variant** — `addToCart` has always deduped on that pair
(`i.sku === item.sku && i.variant === item.variant`), and `CartPage` has always keyed its rows
`${item.sku}-${item.variant}`. But the two mutations keyed on the SKU alone:

```ts
setItems(prev => prev.filter(i => i.sku !== sku));            // removeFromCart
setItems(prev => prev.map(i => i.sku === sku ? {...i, qty} : i));  // updateQty
```

So one identity was used to *create* lines and a coarser one to *change* them. Removing "Pluie / M"
deleted "Menthe / L" with it, and `+`/`−` moved the quantity of every line sharing the parent SKU at
once.

The root cause is not the missing argument — it is that nothing could reach the bug, so nothing
caught it. `variant` was only ever set by the product page's option selector, and that selector
never rendered (see `feature-configurable-option-selection.md`), so every line in every cart had
`variant === undefined` and the two identities agreed by accident. Fixing the selector is what made
the defect reachable, which is why it is fixed in the same change rather than left as a follow-up.

## Behaviour (testable)

- [x] `removeFromCart(sku, variant?)` and `updateQty(sku, qty, variant?)` take the variant and match
      on the same pair `addToCart` dedupes on. `updateQty` at `qty <= 0` delegates to
      `removeFromCart` rather than repeating the filter.
- [x] All three call sites in `CartPage.tsx` pass `item.variant` (`:120`, `:122`, `:129`); a repo-wide
      grep confirms there are no others (golden rule 1).
- [x] `variant` stays optional, so `addToCart({...})` without one still produces a single line and
      the pre-existing single-line behaviour is unchanged.
- [ ] Two lines of the same parent (`VSK12` as "Pluie / M" and "Menthe / L") remove and re-quantify
      independently in the browser. **Not verified — browser interaction was unavailable in this
      session.** Verified only by reading the state transitions and by `tsc --noEmit`.

## SDK contract used

None — cart state is local to `CartContext`. The `ADD_TO_CART` event it pushes is untouched.

## Tracking (required)

Unchanged. `removeFromCart`/`updateQty` have never emitted tracking events, and this change does not
add any. `ADD_TO_CART` still fires from `addToCart` with `child_sku` falling back to `item.sku`.

## UI constraints

No visual change, no CSS.

## MUST NOT change

- **The mutation identity must stay sku + variant, matching `addToCart`'s dedupe key and
  `CartPage`'s row key.** All three must agree; if a future change adds a fourth notion of line
  identity (a child SKU, a line id), it has to replace all three at once, not one of them.
- `variant` must stay optional in both signatures — `ProductCard` and `SearchOverlay` add to cart
  without one.
