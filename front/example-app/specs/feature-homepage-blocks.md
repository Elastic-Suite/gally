# Feature: homepage blocks - wide hero, promo cards, panel sliders

## Status: implemented

## Page/Component

`src/views/Homepage.tsx`, `src/components/HomeHero.tsx`, `src/components/HomePromoCards.tsx`,
`src/components/ProductSlider.tsx`, `src/sdk/homepageBlocks.ts`, `src/styles.css`,
`src/locales/{en,fr,de}/category.json`.

## Why

The homepage was one centred text hero over two identical horizontal sliders. It did not look like
a shop, and the two sliders looked like every other product row in the app (cart, product page).
The three sample shops now each get a merchandised homepage, built from their own product photos.

## Layout

Top to bottom, with the same `3rem` gap between the four blocks so they read as evenly spaced:

1. **Hero** - a wide panel. Headline, one line of copy and the button bottom-left, three product
   photos on the right.
2. **First slider** ("Notre sélection") as a panel: title column on the left, 3 products.
3. **Two promo cards** side by side: product photo on the left, dark panel on the right with a
   title, one line and a "Découvrir" button to a category.
4. **Second slider** as a panel, mirrored: 3 products, title column on the right.
5. The existing "ready to transform" call to action, unchanged.

The hero and the two slider panels share one surface: the `--gray-100` to `--indigo-50` gradient,
a `--gray-300` border and `--shadow-md`. The border is what separates them from the white page;
without it the light ground blends into the background.

## Behaviour (testable)

- [x] On `fashion`, `toolbox` and `papershop`, the hero shows that shop's headline, copy and three
      product photos, and two promo cards each link to a category of that shop.
- [x] Hero and card text is translated in `en`, `fr` and `de`.
- [x] The hero button is still the measured per-catalog search of
      `feature-hero-cta-per-catalog.md` (label and query unchanged), only restyled dark.
- [ ] A catalog with no blocks entry (`com`, `fr`, `uk`) keeps the old centred text hero and shows
      no promo cards. Its sliders still use the panel layout.
- [x] Each slider shows 3 products, not 8, on every catalog.
- [x] The two sliders do not show the same products. The second row lists `categories[2]`, the
      second top-level category, falling back to `categories[1]` when a catalog has only one.
- [ ] Each panel has a "see all" link to the category it lists.
- [x] Below 768px: the hero stacks photos over copy, the cards stack, and each panel puts its
      title above a horizontally scrolling row.
- [ ] The cart and product page sliders look exactly as before.
- [x] `npx tsc --noEmit` clean inside the `example` container.

## Which category the second row lists

`categories` is flat: the root, then its children (`src/sdk/catalogs.ts`). The first row browses
the root, and the second used to browse `categories[1]`, the first top-level category. The root's
top products all come from that first category, so both rows showed the same items - obvious once
a row is cut to 3.

Measured on 2026-10-02 (`product_catalog`, default order, first 3 SKUs of each row):

| Shop      | Row 1 (root)                           | `categories[1]`                   | `categories[2]`                                   |
| --------- | -------------------------------------- | --------------------------------- | ------------------------------------------------- |
| fashion   | FIO-FRO-RS-003, -002, -001             | Femme: same 3                     | Homme: FIO-HOM-SH-007, -006, -005                 |
| toolbox   | TBX-ELP-PO-004, -003, -002             | Outillage électroportatif: same 3 | Batteries & Chargeurs: TBX-BAT-CH-009, -008, -007 |
| papershop | LLV-PAP-CRA-001, LLV-PAP-BIL-008, -007 | Papeterie: same 3                 | Livres: LLV-LIV-VOY-005, -004, -003               |

`fashion_en` gives the same ids and SKUs. "The last category" was rejected: on papershop it is
"Sélection éco-responsable", which shares two of row 1's three products.

## Verified

On 2026-10-02, on screenshots of the running stack:

- Full-page shots of `fashion_fr`, `toolbox_fr`, `papershop_fr` and `papershop_de`, and
  `papershop_fr` at 390px. Each shows the shop's hero, 3 products per row, the two cards and a
  second row from `categories[2]` (Homme, Batteries & Chargeurs, Livres / Bücher).
- Hero buttons read "Découvrir les robes", "Découvrir les perceuses", "Füllhalter entdecken".
- Key parity across the three `category.json` files. `tsc --noEmit` exit 0, `✓ Compiled` with no
  new error line in the `example` log.

**Not verified, and why:**

- The legacy fallback (`com`, `fr`, `uk`): those fixtures are not loaded in the running instance.
  It rests on reading the code - no `HOMEPAGE_BLOCKS` entry renders the old `.hero` and no cards.
- Cart and product page rows: the cart shot was an empty cart, with no row to compare. They rest
  on reading the code - without `panel`, `ProductSlider` renders the same markup as before.
- The "see all" link targets were not clicked; they are `/category/<id>` like `CategoryNav`'s.

## Known issue

The fixed "Gally Insights" button (bottom-left of the viewport) covers the first panel's "see all"
link at the scroll position of the first screen. It overlaps whatever is at that spot on every
page; it was not changed here.

## Content

Image paths and category ids live in `src/sdk/homepageBlocks.ts`, keyed by catalog code. Category
ids belong to the catalog, not to the localized catalog, so one entry serves all three languages.
Text lives in `category.json` under `homepage.blocks.<catalog>`, so a French visitor gets French
copy. Images are real product photos (the demo data has no lifestyle photos), resolved through
`mediaUrl()` like every other product image.

The copy names no counts ("201 models"). A count goes stale with the next fixture change.

## SDK contract used

Unchanged requests: both rows are `useSearch({ pageSize, categoryCode })` browses, as before. Only
`pageSize` drops from 8 to 3, and the second row lists `categories[2]` instead of `categories[1]`.

## Tracking (required)

`trackDisplay` on the first row is kept. It now reports 3 products, which is what is on screen.
This is why the rows fetch 3 products instead of hiding cards with CSS: hidden cards would still
be reported as displayed. The promo cards and the hero are plain category and search links; the
pages they open fire their own tracking.

## UI constraints

- New button variants `.btn-dark` (`--gray-900`) and `.btn-light` (`--white`), pill-shaped like
  every `.btn`. The dark one is the hero CTA; the light one sits on the dark card panels.
- Tokens only. The cut-out photos are blended into the panel with `mix-blend-mode: multiply` and a
  radial mask, because they sit on an off-white square that would otherwise show as a box.
- No carousel arrows, dots or terms link. There is one slide and no terms page, and controls that do nothing look broken in a demo.

## MUST NOT change

- **The hero button's label and query stay the measured pair per catalog and language**
  (`feature-hero-cta-per-catalog.md`). This change restyles the button; it does not turn it into a
  category link.
- **The panel layout is opt-in through `ProductSlider`'s `panel` prop.** Cart and product page call
  `ProductSlider` without it and must keep the plain scrolling row.
- **The rows fetch 3 products; do not fetch more and hide the rest.** See Tracking.
- **The hero and the two panels share one surface.** Changing one ground without the others breaks
  the reason the page reads as one set of blocks.
- A catalog without a blocks entry falls back to the old hero, not to another shop's photos.
- **The second row is not `categories[1]`.** It repeats row 1 on every sample shop. A different
  rule needs re-measuring on all three shops first.
