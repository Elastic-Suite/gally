# Feature: product picture badges

## Status: implemented

## Page/Component
`src/sdk/fields.ts`, `src/sdk/productFields.ts`, `src/components/ProductCard.tsx`,
`src/views/ProductPage.tsx`, `src/styles.css`, `src/locales/{en,fr,de}/product.json`.
Data side, in the `gally-sample-data` repo:
`src/DataFixtures/elasticsearch/product_documents.json`, `src/DataFixtures/product_source_field_label.yaml`.

## Why

The card already drew a "New" badge from the `new` attribute, and already had a struck-through
original price behind `isDiscounted`. **Neither had ever rendered a single time on the demo
catalogue**, for two separate reasons that both had to be fixed for any of this to be visible:

1. `new` and `sale` are real, declared, filterable boolean source fields — but they carry values
   only in the Luma (`fr_*`) blocks. On `com`, the catalogue `front/example-app` actually lands
   on, all 85 products had **no `new`, no `sale`, no `eco_collection`, no `erin_recommends`**.
   Measured on the live index before this change: `new` 0/85, `sale` 0/85.
2. The SDK appends its own `price { price }` to every product query
   (`gally-admin/packages/sdk/src/graphql/Request.ts:181`) and nothing ever asked for the rest of
   the price row, so `original_price` and `is_discounted` never reached a listing card. The
   discount UI was unreachable code on the grid; it only worked on the PDP, which requests `source`.

## Behaviour (testable)

- [x] Badges overlay the product picture from the top-left corner, in priority order:
      **on sale → new → material**.
- [x] **A grid card shows exactly one badge — the highest-priority one.** The picture is 180px
      tall in a grid of them; a stack of pills eats the product it is selling. Verified on
      `/com_fr/category/cat_5`: 14 cards, 14 badges, never two on one card.
- [x] **The PDP shows all of them**, stacked, because the hero picture has the room. Verified:
      `VA13-GO-NA` renders "En promo" *and* "100 % 14K Gold".
- [x] Priority is the order `getProductBadges()` returns, and callers truncate rather than
      re-sort — so the badge a card shows is always the one the PDP leads with. Verified on
      `VA13-GO-NA`: card shows "En promo", PDP leads with "En promo".
- [x] **Availability is never a badge.** The card's disabled add-to-cart button already reads
      "Unavailable", and the PDP has a stock line above that same button, so a badge was a third
      statement of the same fact — and the one most likely to crowd out an actual merchandising
      badge. Verified: `/com_fr/category/cat_5` renders no availability badge, and the
      out-of-stock cards there still show their disabled button.
- [x] **New** — `new === true`. 12 curated Venia SKUs, spread over accessories, dresses, bottoms,
      skirts, sweaters and tops, all in stock. *Requires `make fixtures_load`; unverified until then.*
- [x] **On sale** — `sale === true || price[0].is_discounted`. 9 SKUs. Verified live on
      `/com_fr/category/cat_5`: `VA13-GO-NA` and `VA19-GO-NA` render "En promo".
- [x] **100% \<material\>** — `fashion_material` has exactly one entry. 22 of 85 Venia products.
      Verified live: "100 % Cashmere" on `VSW11`, "100 % 14K Gold" / "100 % Sterling Silver"
      across `cat_5`.
- [x] Where more than one badge is drawn (PDP only), they stack rather than overlap.
      Verified: `VA13-GO-NA` renders sale *and* material as two pills, not one on top of the other.
- [x] The same badges appear on the PDP hero picture, from the same rule. Verified on
      `/com_fr/product/VSW11` and `/com_fr/product/VA13-GO-NA`.
- [x] Server-rendered — the badges are in the SSR HTML, not painted in after hydration.
- [x] The struck-through original price now renders on the grid, as a side effect of the price
      projection fix. Verified: `98,00 €` struck beside `78,00 €` on `VA13-GO-NA`.
- [x] `npx tsc --noEmit` clean inside the `example` container; dev server compiles with no `⨯`.

## SDK contract used

`PRODUCT_FIELDS` gains `'sale'` and `'price { original_price is_discounted }'`. `new` and
`fashion_material` were already requested.

Two traps worth keeping written down:

- **`new` and `sale` are bare booleans on the GraphQL `Product` type** — not `is_new`, and not
  `{ label value }`. They are boolean source fields, not selects, and the filter input takes a real
  GraphQL `Boolean` (`filter: [{new: {eq: true}}]`), not an option code.
- **Asking for `price { … }` is safe even though the SDK appends its own.** GraphQL merges two
  selections of the same field, so the query ends up with the union. This is the only way to reach
  `original_price`/`is_discounted` on a listing row short of patching the SDK.

Because both constants are shared by the client hooks and `src/sdk/server.ts`, the SSR fetch and
the post-hydration refetch stay in lockstep automatically. Do not inline a one-off field list.

## Tracking (required)

None added, none changed. The badges are presentational and sit inside the existing `<Link>`; the
card's add-to-cart handler and every existing tracking call are untouched.

## UI constraints

- One primitive, not a new one: `.product-card-badge` stays the pill it already was. The change is
  a `.product-card-badges` **wrapper** that owns the positioning, because N absolutely-positioned
  siblings at the same `top`/`left` can only ever show one badge.
- Colour follows the split the blog topic pill already documents: **coral promotes, indigo
  classifies.** New = `--coral-500` (unchanged), Sale = `--coral-600`, material = `--indigo-800`,
  out of stock = `--gray-500`.
- No raw hex, px or font-size introduced anywhere.

## Data (gally-sample-data)

`new` on 12 SKUs and `sale` on 9, written **identically into `com_en` and `com_fr`** — a
merchandising flag is a fact about the product, not about the locale, and cross-locale select
divergence must stay at 0 (it does).

`sale` and `price[].is_discounted` are deliberately the **same 9 products**, so the badge and the
struck-through price can never contradict each other. The 6 added discounts raise `original_price`
and leave `price` alone: the price facet and the price sort both aggregate on `price.price`, so
this adds a discount story without moving any existing search behaviour.

`new` and `sale` never overlap, matching how the Luma catalogue treats them.

The two fields also gained their missing `com_en` `SourceFieldLabel`, and their `com_fr` labels
were translated (`New` → `Nouveauté`, `Sale` → `Promotion`) — they were English on the French
catalogue, which is the admin half of the known `com_fr` translation gap.

Dataset baselines after the change, unchanged from before it: 104 declared product fields, 67
unused, 125 undeclared select values, 0 cross-locale select divergence.

## MUST NOT change

- **The card must keep showing at most one badge, and must not re-sort.** The priority lives in
  `getProductBadges()`'s return order and nowhere else; `ProductCard` only truncates. Sorting at
  the call site, or raising the card's slice, breaks the guarantee that a card and its PDP agree
  on which badge leads.
- **Sale outranks new outranks material.** Sale is the only badge that changes what the product
  costs today and the only one that expires, so it wins the card's single slot.
- **Do not add an out-of-stock badge back.** It was there before this feature and was removed on
  purpose: the disabled add-to-cart button states it on both surfaces, and the PDP states it twice
  already. Availability belongs where the visitor acts on it, not on the picture. If a future
  change wants it visible in the grid, restyle the button — do not spend badge space on it.
- **`.product-card-badge` must not get `position: absolute` back.** The wrapper positions; the
  badge does not. Putting it back silently collapses every badge onto the first one, which is the
  exact bug this feature fixes and it looks like a styling nit in review.
- **`'price { original_price is_discounted }'` must stay in `PRODUCT_FIELDS`.** It looks redundant
  next to the SDK's own `price { price }` and it is not. Removing it silently kills both the sale
  badge and the struck-through price on every listing, with no error anywhere.
- **`new`/`sale` must stay out of `{ label value }` sub-selection form.** They are booleans;
  giving them a sub-selection is a GraphQL error, and `is_new` is not a field.
- **Do not add `source` to `PRODUCT_FIELDS`** to reach these — the standing rule from
  `feature-configurable-option-selection.md` still holds.
- The badge set must stay derived in `src/sdk/productFields.ts`, not in `ProductCard.tsx`: that
  file is `'use client'`, and the server-rendered shells import the rule too.
- `getProductFields`'s existing keys and `ProductCard`'s props are unchanged; three call sites
  (`SearchPage`, `CategoryPage`, `ProductSlider`) depend on them.

## Notes / not done

- `feature-configurable-option-selection.md` line 109 records that "`new` is absent from
  `_source`, so `isNew` is false on the PDP — which renders no 'new' badge." That is **no longer
  true** for the 12 flagged SKUs once the fixtures are reloaded.
- The `new`/`sale` **option** Yes/No labels are inverted in the fixtures (`code: '0'` is labelled
  "Yes"), and their `defaultLabel`s are `'0'`/`'1'`. Left alone: the boolean filter takes a real
  Boolean rather than an option code, and at 12/85 and 9/85 coverage neither field reaches the
  facet coverage threshold, so nothing renders those labels today. Pre-existing, and the same
  inversion affects `eco_collection`, `erin_recommends` and `es_is_*`.
- `eco_collection`, `erin_recommends` and `performance_fabric` are declared and filterable and
  remain empty on `com`. They are the cheapest next badges if more are wanted — data only, no
  code: `getProductBadges()` is where they would be added.
- There is no best-seller, rating or review attribute anywhere in the schema; a "Best seller"
  badge would need a new source field, which was explicitly out of scope for this change.
