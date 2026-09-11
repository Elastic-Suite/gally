# Feature: product SKU on the listing card

## Status: implemented
## Page/Component: src/components/ProductCard.tsx, src/styles.css

Every product card now names its SKU, so a listing can be read against the catalogue without
opening each product page. The card body keeps the height it had before: the line is paid for by
vertical padding, not by a taller card.

## Behaviour (testable)
- [ ] The SKU appears in the card body, directly under the product name and above the price.
- [ ] It uses the same wording and the same translation key as the product page,
      `product:page.sku` - "SKU: 24-MB01" / "Référence : 24-MB01" / "Artikelnummer: 24-MB01".
      No new locale key was added.
- [ ] Colour is `--gray-500` and the weight is normal, the same muted treatment
      `.product-detail-brand` gives the SKU on the product page.
- [ ] The size is card-scaled, not the product page's 0.9rem: `--product-card-sku-size` is
      0.75rem on the small card and 0.8rem inside `.products-grid` above 1200px. The product
      page's 0.9rem sits under a 2rem title; on a card whose name is 0.9rem it would read as a
      second title.
- [ ] A long SKU stays on one line and truncates with an ellipsis, so the card grid keeps
      even rows.
- [ ] The card body is not taller than before. Measured against the old box, at both sizes:
      small 5.29rem before / 5.29rem after, large 6.19rem before / 6.16rem after.
- [ ] The SKU shows on every card, which includes the home-page carousel and the category and
      search listings - `ProductCard` is one component and splitting it by caller would be a
      second card idiom (golden rule 3).

## Verified
- `npx tsc --noEmit` inside the `example` container: no errors.
- `docker compose logs --timestamps example`: three `✓ Compiled` events after the change, each
  followed by a 200, no `⨯` after them. The `⨯` lines in the buffer predate the change.
- **Not verified visually.** Nobody opened the listing in a browser, so the checkboxes above stay
  unticked: the height arithmetic is computed from the CSS (0.9rem/1rem name at line-height 1.6,
  0.75rem/0.8rem SKU at 1.4, padding 0.45rem/0.65rem per side), not measured in a rendered page.

## SDK contract used
No request change. `sku` was already read from `getProductFields(product)` in `ProductCard` and
used to build the product link.

## Tracking (required)
None added or changed. `trackDisplay` in `src/views/CategoryPage.tsx` and the add-to-cart events
from `QuickAdd` are untouched.

## UI constraints
- Two new tokens in `:root`, both raised on `.products-grid` like the five that were already
  there: `--product-card-sku-size` and `--product-card-body-padding-y`.
- No new hex, no new font stack, no new visual primitive. `.product-card-sku` is the card-scale
  version of the muted meta line the stylesheet already draws.
- `.skeleton-card-body` reads the same padding tokens as `.product-card-body`, so the skeleton
  shrinks with the card. Its three shimmer rows already match name + SKU + price.

## MUST NOT change
- **Horizontal padding of the card body stays `--product-card-body-padding`** (1rem / 1.25rem).
  Only the vertical padding was reduced. Collapsing the two back into one shorthand value would
  either re-inflate the card or pull the text to its edges.
- **The five size variables stay on `.products-grid`, never on `.product-card`** - the rule from
  `feature-larger-product-grid.md` holds for the two new ones too. The carousel and the
  autocomplete draw the small card precisely because the size lives on the grid.
- `.skeleton-card-body` must keep reading the same padding tokens as the real body. A skeleton
  with a different box causes the layout shift it exists to prevent.
- The SKU line reuses `product:page.sku`. Do not fork a card-specific key: the product page and
  the card would then drift apart in one locale and nothing would warn.
- The link around the name still wraps the name only, and the SKU line is not a link.
