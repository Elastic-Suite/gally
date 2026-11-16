---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Read indexed `_source` data by three fixed rules

## Context and Problem Statement

This decision is older than this ADR. It is three rules, each made after a bug where the front
read the index with a wrong belief about its shape:

-   Commit `4c781dad` (2026-08-07): `selectedFields` for CMS pages lists raw `_source` names. The
    spec was added later that day, in `f9ef415b`. See
    `bugfix-cms-selected-fields-projection.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-cms-selected-fields-projection.md`).
-   Commit `5370d2a3` (2026-08-14): stock is read only through `isAvailable()`. See
    `bugfix-stock-count-zero-on-parents.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-stock-count-zero-on-parents.md`).
-   Commit `1c10296f` (2026-09-02): booleans from `_source` are tested with `=== true`. See
    `bugfix-new-badge-empty-array-truthy.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-new-badge-empty-array-truthy.md`).

The bugs were:

-   Gally indexes an unset boolean as `[]`, not `false`. `[]` is truthy, so `s.new || false` showed
    a "New" badge on every product page.
-   For non-product entities, the SDK filters `_source` down to the keys in `selectedFields`. Keys
    not listed are dropped with no error. Blog cards and posts rendered empty.
-   The product page showed "In stock (0 available)" with an active add-to-cart button. `qty` was
    never requested, and configurables really carry `qty: 0`.

How should code read data from the index so these do not come back?

## Considered Options

-   For stock: show a product with `status: true` and `qty: 0` as in stock, without a count
-   For stock: show it as out of stock

No alternative was recorded for the other two rules. Each was written as the fix of its bug.

## Decision Outcome

Chosen option: three rules, kept in `docs/sdk-reference.md` and the specs above.

-   A boolean from raw `_source` is tested with `=== true`, never a truthy read.
-   `selectedFields` for a non-product entity lists raw `_source` attribute names only. Adding a
    field to `CmsPage` means adding its `_source` name to `CMS_FIELDS` too.
-   Stock is read only through `isAvailable()` in `src/sdk/productFields.ts`, exposed as
    `available`. `status: true` with `qty: 0` is out of stock, chosen over an uncounted "in stock":
    a product whose only quantity signal is 0 should not offer an add-to-cart button. `qty` undefined means "not
    requested", not zero, so listings fall back to `status`.

### Consequences

-   Good, because the stock line, every add-to-cart button and the JSON-LD offers agree.
-   Good, because the stock rule keys on the quantity, not the product type, so it corrected
    itself when the sample data was fixed.
-   Bad, because none of the three rules is enforced by a type or a test. They hold through review.

### Confirmation

-   `grep -rn "stock.status\|stock?.status" src` finds no read outside `src/sdk/productFields.ts`.
-   `grep -nE "s\.(new|sale|llv_is_eco)\b" src/sdk/productFields.ts`: each match is followed by
    `=== true`. A new boolean read from `_source` joins that list the same way.
-   Every entry of `CMS_FIELDS` in `src/sdk/fields.ts` is a key present in the indexed document.

## More Information

See "Unset booleans in raw `_source` are `[]`" and "Non-product entities" in
[sdk-reference.md](../../sdk-reference.md). That file wins over any other doc in the app.
