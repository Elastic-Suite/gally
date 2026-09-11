# Bugfix: "New" badge rendered on every product on the PDP

## Status: implemented
## Page/Component: src/sdk/productFields.ts (badges consumed by src/components/ProductCard + PDP)

## Problem

The "New" badge showed on products that are not new — on the product detail page, on all of them.

**Root cause — the wrong belief:** that an unset boolean source field arrives as `false`, or is
absent. It is neither. Gally indexes an attribute a product does not carry as an **empty array**.
In `api/packages/gally-sample-data/src/DataFixtures/elasticsearch/product_documents.json`, `new`
is `true` on 112 documents and `[]` on 222; `sale` is `true` on 84 and `[]` on 240.

`[]` is truthy in JavaScript. So the read

```ts
const isNew = s.new || s.is_new || false;   // returns []  →  truthy
```

evaluated to `[]` for every non-new product, and `productFields.ts:124` pushed the badge.

Two things kept it hidden:

- **It only bites on the raw-`_source` path.** The stitched GraphQL `Product` type returns plain
  booleans, so listings built from `PRODUCT_FIELDS` were correct. The PDP is on the other path
  because `PRODUCT_DETAIL_FIELDS` (`src/sdk/fields.ts:47`) asks for `source` — added for
  `type_id` and `configurable_attributes`, with the boolean side effect unnoticed.
- **`s.is_new` in the same line implied the shape was uncertain**, which read as deliberate
  defensiveness. It was not: `is_new` exists nowhere — not in the fixtures, not in the source-field
  YAML, not in the SDK, and not among the 118 stitched GraphQL fields. It was dead, and it
  disguised the real defect as a considered choice.

`isOnSale` on the next line was already written `s.sale === true` and was therefore correct. The
two lines disagreed about the same data shape, and the wrong one carried no comment while the
right one did.

## Fix

`src/sdk/productFields.ts` — `const isNew = s.new === true;`, with a comment stating why the
strict compare is load-bearing. The dead `s.is_new` read is gone.

## Behaviour (testable)

- [x] `new: []` in `_source` yields `isNew === false`; `new: true` yields `true`.
- [x] `sale` is unaffected — it already used `=== true`.
- [ ] Visual check on the PDP: the "New" badge appears on a known-new SKU and not on others.
      Not run; needs the stack up.

## SDK contract used

No request change. `PRODUCT_DETAIL_FIELDS` still asks for `source`; only the read of it changed.
The contract itself is now written down in `../docs/sdk-reference.md` — "Unset booleans in raw
`_source` are `[]`, not `false`".

## Tracking (required)

None. Display-only.

## UI constraints

None changed; no styling touched.

## MUST NOT change

- Do not go back to a truthy read (`s.new || …`) on anything from `_source` — that is the bug.
- Do not reintroduce `s.is_new`. It does not exist in this API.
- Any **new** boolean read from `_source` needs `=== true` for the same reason. `pureMaterial`
  and the other derived flags in this file read arrays deliberately and are not affected.
