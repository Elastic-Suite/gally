# Bugfix: the product image does not fill the product page frame

## Status: implemented
## Page/Component: src/views/ProductPage.tsx

## The problem

`.product-detail-image` is a square box (`aspect-ratio: 1`, styles.css:1767) with a gradient
background. The image inside was capped at `maxHeight: 400px`, so it floated in the middle of that
box with the gradient showing around it. On the three generated catalogs - papershop, toolbox and
fashion - the images are square 600x600 and could fill the frame exactly, so the cap was throwing
away quality the images already had.

The cap is not wrong for every catalog. The older Venia/Luma images are 161x200: scaling those into
the full frame magnifies them and looks worse than the letterbox does.

## Behaviour (testable)

- [x] A papershop, toolbox or fashion product fills the square frame, no gradient border.
- [x] A Venia/Luma product keeps the 400px cap and the gradient around it.
- [x] `objectFit: contain` throughout, so nothing is ever cropped - a non-square image letterboxes
      rather than losing its edges.
- [x] A product with no image still renders the camera placeholder.

## How the two cases are told apart

On the media shard in the image URL - `/l/l/`, `/t/b/`, `/f/i/` are the generated catalogs. The
shard is what actually correlates with the image resolution, which is the real reason for the
difference. Catalog code would need a lookup and would be wrong if a catalog ever mixed sources.

## SDK contract used

None changed. `getProductFields()` already returns `image` as a full URL
(`src/sdk/productFields.ts:59`), which carries the shard.

## Tracking (required)

Untouched. The product-view event still fires from the same effect.

## MUST NOT change

- The Venia/Luma cap. Removing it is not a cleanup, it is a regression - those images are 161x200.
- `objectFit: contain`. Switching to `cover` would fill the frame for every catalog but crop the
  product, which is wrong for a packshot.
- The badge overlay above the image, which shares its rule with the grid card.

## Not done here

The real fix for the old catalog is better source images, or `next/image` serving sized variants
from a high-resolution original. That needs the media URL to stop being hardcoded
(`src/sdk/index.ts:14`): the Next optimizer fetches server-side, and from inside the `example`
container `https://gally.localhost/media/...` is refused while `http://router/media/...` works.
Parked with the team.
