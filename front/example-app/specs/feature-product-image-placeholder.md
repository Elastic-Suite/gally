# Feature: Placeholder for missing product images

## Status: implemented
## Page/Component: src/components/ProductImage.tsx (new), ProductCard, ProductPage, SearchOverlay, CartPage, VectorSearchPage, src/styles.css (`.product-image-placeholder`)

## Problem
Some demo products point at an image file that was never published. For example, 8 fashion products have
no image on the source demo, such as `/media/catalog/product/f/i/fio-hom-ch-005.jpg`, which returns 404.
The storefront drew the browser's broken-image icon for them. Products with no image URL at all showed a
different fallback on each page ("📷 name" on the card, "IMG" in autocomplete, "👗" in the cart).

## Behaviour (testable)
- [x] Every product picture is drawn by `ProductImage`: the card, the product page, the autocomplete
      thumbnails, the cart rows and the vector search rows.
- [x] When the URL is empty, or the image fails to load (404, broken file), it shows
      `.product-image-placeholder`: a pale picture icon centred in the image frame.
- [x] A failure that happens before React hydrates is caught too: on mount, an image that is `complete`
      with `naturalWidth === 0` switches to the placeholder.
- [x] The placeholder has `role="img"` and the product name as `aria-label`, like the image it replaces.
- [x] A new `src` resets the failed state, so a reused component shows the new product's image.

## MUST NOT change
- Working images render exactly as before: same `<img>`, same inline styles, same `loading`.
- Blog images and the brand logo are not product pictures and keep their own markup.

## Follow-up
The 8 missing fashion images still need real files. This placeholder only covers the gap.
