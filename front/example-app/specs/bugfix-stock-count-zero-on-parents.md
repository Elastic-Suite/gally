# Bugfix: "In stock (0 available)" — one availability rule, and qty 0 now means out of stock

## Status: implemented
## Page/Component: src/sdk/productFields.ts (`isAvailable`, `getProductFields.available`), src/views/ProductPage.tsx, src/components/ProductCard.tsx, src/components/SearchOverlay.tsx, app/[locale]/product/[sku]/page.tsx, app/[locale]/category/[code]/page.tsx, src/locales/{en,fr,de}/product.json

## Problem

The product page printed a self-contradicting stock line — `✓ En stock (0 disponible(s))` — with an
enabled add-to-cart button beside it. Two separate causes:

1. **The count was never fetched.** `t('page.inStock', { count: p.stock.qty })` was fed
   `p.stock.qty`, but the SDK auto-appends only `stock { status }` to every product query
   (`graphql/Request.ts`), and `PRODUCT_FIELDS` never asked for `qty`. So `qty` was `undefined` on
   *every* product and i18next rendered the count as `0` — a simple product with 100 units said "0
   available" too. Requesting the raw `source` for the PDP
   (`feature-configurable-option-selection.md`) fixed that: simples now show their real quantity.
2. **For a product with children the quantity really is 0.** Verified against the running instance
   and the committed documents, not inferred:
   - `VSK12` is `stock: {qty: 0, status: true}` — both in `_source` and through a typed
     `stock { status qty }` selection.
   - `qty == 0` holds for exactly the 72 `com` documents that have `children.sku`, and for none of
     the 13 that don't. The correlation is total.
   - It is faithful to the source platform: a configurable's own stock item carries no quantity, the
     salable quantity lives on its children — and **Gally indexes no child stock**. The instance
     declares 112 product source fields with no children field; `stock` is a single
     `{status, qty}` object (`StockAttribute::getFields()`, `isList() === false`); children are not
     documents (an `equalFilter` on `VSK12-RN-8` returns 0 rows, as does `id: "400"`, a
     `children_ids` entry).

## The decision

**`status: true` with `qty: 0` renders as out of stock.** A deliberate workaround, chosen over
showing an uncounted "in stock": a product whose only quantity signal is 0 should not offer an
add-to-cart button. The sample data is being updated so configurables carry a real quantity, at
which point those products become available again **with no code change** — the rule keys on the
data, not on the product type.

`isAvailable()` in `src/sdk/productFields.ts` is the single expression of it, and `getProductFields`
exposes it as `available` so the stock line, every add-to-cart button and both JSON-LD offers read
the same value. Structured data claiming `InStock` over a page that says out of stock is a validator
error, not a detail.

**`qty === undefined` is "not requested", not "zero".** Only the PDP requests `source`, so only the
PDP knows the quantity; listings fall back to `status`. Without that distinction every card in every
listing would read as unavailable.

## Behaviour (testable)

- [x] `status && qty > 0` → counted string. `VA11-GO-NA` → "En stock (100 disponible(s))",
      `VVP01` → 1000.
- [x] `status && qty === 0` → `page.outOfStockLong`, add-to-cart **disabled** and labelled
      `card.outOfStock`, JSON-LD `OutOfStock`. Verified in the served HTML for `VSK12` (all three
      agree), `VA07` and `VA24` (bundle).
- [x] `!status` → unchanged out-of-stock branch. `VT05` (both `com` locales since the data fix; it was
      `com_en` only when this was written).
- [x] `status && qty === undefined` → `page.inStockNoCount` (status without a count). This is the
      listing path; it is also why the missing-stock fallback in `getProductFields` sets only
      `{status: true}` and deliberately omits `qty`.
- [x] Listings are unchanged by this: `/search?q=robe` still renders 0 unavailable badges and the
      category JSON-LD still emits 12 × `InStock`, because `PRODUCT_FIELDS` does not request `qty`.
- [x] New key `page.inStockNoCount` in all three locales (golden rule 5), checked on `com_fr`.

## Resolved: the sample data was fixed

The gap this spec originally recorded — listings offering add-to-cart on products whose PDP said out
of stock — is **closed**, because the fix landed where it belonged, in the data.
`api/packages/gally-sample-data` now guarantees `status == (qty > 0)` for all 536 documents: 63 of 85
`com` products in stock with quantities of 7–197, 22 out of stock at `qty: 0`, identical across both
locales of a catalogue.

So `status` alone is now a sufficient signal, and listings (which only fetch `status`) agree with the
PDP (which fetches the quantity too). Verified after reloading: a search for `robe` shows 6
"Indisponible" grid badges and the matching PDPs show "Rupture de stock" with a disabled button and
`OutOfStock` in the JSON-LD.

The `isAvailable()` rule stays exactly as it is. It is now a **guard** rather than a workaround:
nothing in Gally prevents an importer from producing `status: true, qty: 0` again, and if that
happens the storefront must keep refusing to sell the product rather than advertising 0 units.

If listings ever need the quantity, add `'stock { status qty }'` to `PRODUCT_FIELDS` — duplicate
field selections merge with the SDK's auto-appended `stock { status }`, confirmed against the live
API. Not needed today.

## SDK contract used

No new call. `qty` arrives inside the `source` the PDP already requests via `PRODUCT_DETAIL_FIELDS`.

## Tracking (required)

None — display and button state only. `ADD_TO_CART` still fires from `addToCart` unchanged.

## UI constraints

No CSS, no new colour, no new component. Same `--green-600` / `--coral-500` spans in the same place.

## MUST NOT change

- **`isAvailable` stays the only availability rule.** Anything that shows stock, disables a cart
  button or emits a schema.org `availability` reads `available` — never `stock.status` directly.
  Four call sites were converted precisely so they cannot drift apart.
- **Keep the `qty === undefined` ≠ `qty === 0` distinction.** Collapsing them (for instance by
  restoring `{status: true, qty: 0}` as the missing-stock fallback) marks every listing card
  unavailable.
- **Do not special-case by `type_id`.** The rule keys on the quantity, which is why it self-corrected
  the moment the sample data was fixed, with no code change — and bundles/grouped products carried the
  same 0.
- **Do not sum or synthesise child quantities.** There is no per-child stock indexed to sum.
- Note for demos: `VT05` is out of stock in **both** `com` locales now. It used to be `status: false`
  in `com_en` only — the dataset's single locale-parity violation — which made the out-of-stock path
  unreachable in the default `com_fr` demo. 21 other products join it; `GUIDE.md` §3 lists the counts.
