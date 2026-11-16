# Feature: phone header and search overlay tabs

## Status: implemented

## Page/Component: src/styles.css, src/components/SectionLinks.tsx, src/components/SearchBar.tsx, src/components/SearchOverlay.tsx, src/locales/{en,fr,de}/search.json

Chosen from the mockup study `mockups/mobile-layout`, variant B. Desktop (769px and up) is not
changed by anything here.

## Problem

On a 390px phone the header took about 430px before any content:

-   The section links (Products, Blog, Vector search) were cut off at the right edge. At 360px
    "Vector search" was not visible at all, and nothing showed the row could scroll.
-   The cart sat alone on its own row.
-   The category menu wrapped onto 4 rows of about 51px each.

The search overlay then started below all of it: on a 360px phone the first suggestion sat at about
520px. Its product rows were wider than their column (346-367px rows in a 286px grid), and the
add-to-cart controls took 45% of each row while staying invisible, so product names wrapped one word
per line. On touch screens those controls could never be shown: `.autocomplete-product .quick-add`
re-hid what the `(hover: none)` rule opened.

## Behaviour (testable)

Header, 600px and below:

-   [ ] The section links are a full-width pill track under the logo, equal widths, the current
        section in a white pill. With expert mode on, the fourth link (Search Intelligence) shares
        the track. On a page that is no section (home, cart), no pill is shown.
-   [x] The cart sits at the right of the logo row, with its hidden label and its count.
-   [ ] The catalog selects have their own row and show full names at 360px.

Header, 768px and below:

-   [x] Between 601 and 768px the section links are one row that scrolls sideways, with a fade at
        the edge.
-   [x] The category menu is one row that scrolls sideways, with a fade at the edge. It has no hover
        flyouts and no chevrons: a tap opens the category page.

Search overlay, 768px and below:

-   [x] While the overlay is open, the rows above the search are hidden and the search sits at the
        top, with a Cancel button that closes the overlay.
-   [x] The overlay shows three tabs: Products (selected when it opens), Blog, Suggestions.
        Suggestions holds the popular search terms, the attribute values and the categories.
-   [x] Clicking a tab keeps the overlay open and the field focused.
-   [ ] Arrow keys still walk every row in the same order as before. When the highlight reaches a
        row in another group, the tab switches to that group.
-   [ ] The tabs are not shown in the empty "start typing" state.
-   [x] Product rows fit their column; name and price use the row width, and the add-to-cart controls
        are always visible on their own line underneath.
-   [ ] The German add-to-cart button ("In den Warenkorb") stays on one line at 360px.

All widths:

-   [ ] From 769px up, header and overlay are pixel-identical to before (the hero banner's rotating
        cards aside).

Verified 2026-10-09 with `mockups/mobile-layout-implemented` (screenshots of the running app,
catalog `com_en`, at 360, 390, 768, 1024 and 1280px) and a Playwright measure: no page is wider
than the viewport at 360, 390 or 768px, and the selects row is exactly the header width at 360px
(it overflowed by 29px until `.context-selectors` got `min-width: 0`). Not verified, hence
unticked: full select names at 360px (the row fits, but each select is 144px wide and cuts
"COM English Catalog" short; the shorter fashion names fitted in the mockup); the pill track with expert mode on (four links); the no-pill state was seen only on the
search page; keyboard tab-following; the tabs hidden in the empty prompt state; German at 360px
(no German catalog was loaded); Cancel closing the overlay and restoring the scroll position;
desktop pixel for pixel (checked by eye at 1024 and 1280px only).

## SDK contract used

-   None changed. The overlay keeps its requests; the tabs only show and hide what it already renders.

## Tracking (required)

-   None changed. Search, add-to-cart from the overlay and page views fire as before.

## UI constraints

-   The section pill track and the overlay tabs reuse the segmented-pill look of the search results
    type switch (`--gray-100` track, white active pill, `--shadow-sm`). Tokens only.
-   The overlay tab bar paints only the pill track; the panel stays background-less and the scrim
    keeps the tint and blur (`feature-acp-light-glass.md`).
-   The 600px breakpoint is raw px in `@media`, as the existing 768/900/1200 ones are.

## MUST NOT change

-   Desktop: every rule added here sits under `max-width`. `.header-nav` stays `flex: 0 0 auto`
    from 769px up (`feature-header-search-drop.md`), the category menu keeps wrapping with its
    flyouts (`feature-category-nav-root.md`), and the overlay keeps its three columns.
-   The section links stay links with `aria-current`, not a `role="tablist"`
    (`feature-header-nav-switch.md`). The footer keeps its underlined links: the pill style is scoped
    to `.header-nav`.
-   The 200ms `onBlur` delay stays (`feature-acp-focus-empty-state.md`). Overlay tabs and Cancel
    never take focus from the field.
-   The keyboard order over `flatItems` (suggestions, products, categories, blog) stays
    (`feature-acp-visual-redesign.md`, `feature-blog-cms.md`). Tabs only change what is visible.
-   The scrim stays the only scroller: no `max-height` on the panel, no `overflow-y` on a column
    (`feature-acp-header-rides-scroll.md`).
-   No `filter`, `transform` or `position` on an ancestor of `.search-bar-wrapper`; the header rows
    fold with `display: none` (`feature-header-search-drop.md`).
-   `--acp-page-offset` stays in both scrim paddings. On phones it is 0 while the rows are folded,
    because the offset recorded at open time no longer matches the folded header.
-   `.autocomplete-product .quick-add` keeps its desktop rules, the `.highlighted` reveal, the
    reduced-motion override, the `.added` selector and the `:disabled` grey
    (`feature-quick-add-overlay.md`, `feature-add-to-cart-feedback-everywhere.md`). The phone rule is
    a separate block placed after them. Never `visibility: hidden`.
