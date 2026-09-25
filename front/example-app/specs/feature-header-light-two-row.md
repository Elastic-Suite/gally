# Feature: light two-row header, category row in the header, animated search border

## Status: implemented
## Page/Component: src/components/Header.tsx, src/components/CategoryNav.tsx, src/views/Homepage.tsx, src/styles.css

Chosen from a mockup study (variant "B2", made with the `gally-mockup` skill): the top layout of
a reference storefront - logo row, then a row of categories as plain text - on a light surface
instead of the dark indigo bar. The search band stays where it was. The hero goes light too.

Supersedes, each on the point named:
- `feature-header-nav-switch.md` - the header's Products/Articles segmented switch is gone.
- `feature-logo-gally-example.md` and `feature-header-brand-lockup.md` - "the lockup needs a dark
  surface". The wordmark's "Gally" is now `--indigo-900` on a light header.
- `feature-search-header-redesign.md` - "`CategoryNav.tsx` still rendered per-page, not part of
  the header". It is part of the header now.
- `feature-persist-shared-ui-across-navigation.md` - the nav's home (was the category layout).
- `bugfix-hero-spacing.md` - "gradient background" of the hero.

## Behaviour (testable)
- [x] Row 1 (`.header-inner`): logo, then Produits / Blog / (Search Intelligence, expert mode) /
      Recherche sémantique as plain text links, then the two catalog selects, then a cart icon.
      The active link is indigo with an underline.
- [x] Row 2 (`.category-nav`, inside `<header>`): top-level categories as plain text, a chevron on
      items with children, no card and no count. Hovering an item with children opens its
      submenu, which paints above the search bar.
- [x] Both rows sit on a light indigo tint (`--indigo-50` fading to white), with a thin
      `--gray-200` rule under each.
- [x] The category row is shown on every route, and keeps its active item and trail across
      category-to-category navigation without flashing (it is in the app shell now, outside
      `<main>`).
- [x] Scrolling still pins the search band at the viewport top, with both header rows scrolled out
      of view. No opaque strip behind the pinned band.
- [x] The catalog selects are light outlined pills with a drawn chevron and room before the
      pill's end.
- [~] Cart: an icon; the count badge shows when the cart is not empty; the label "Panier" / "Cart" /
      "Warenkorb" is still read by screen readers (visually hidden text).
- [~] Search input: 2px gradient border (indigo to coral) on white. On focus the colours sweep once
      around the pill's edge (1.4s, slowed from 0.9s). On blur they sweep back the other way. No motion under
      `prefers-reduced-motion`.
- [x] With the ACP open, the blue tint and blur of the scrim cover the whole screen, header rows
      included. Only the search input stays sharp, and the header rows dim as before.
- [x] Homepage hero: light, centred, large title in the brand gradient, grey body text, coral CTA.
- [x] Page background is white.

Verified 2026-09-24 by a capture of the running app (`gally-mockup` skill, study
`mockups/header-implemented/`): every `[x]` above, at 1440px, plus a 390px capture (both rows wrap,
the section links scroll sideways inside `.header-nav` as before). Not verified, hence `[~]`:
- the cart count badge with a non-empty cart (no add-to-cart in the capture), and screen-reader
  output for the cart label;
- the blur sweep caught mid-way (the capture landed near the end of it), and the
  reduced-motion case.

## SDK contract used
- None changed. `CategoryNav` still renders from `CatalogContext` categories.

## Tracking (required)
- None changed. No tracking call lives in the header, the nav or the hero.

## UI constraints
- Tokens only, rem units except 1px hairlines (as everywhere else in the file), no new colour. One new utility, `.visually-hidden`, for the cart label.
- The one `@property` (`--search-border-angle`) is what lets the gradient angle transition. It is
  registered at the top of `styles.css`, initial `90deg`; focus sets `450deg`. Browsers without it
  show the static gradient. A `conic-gradient` was tried first and rejected: from the centre of a
  pill this wide it reads as flat purple with a notch top and bottom, not the approved indigo-left,
  coral-right border.
- `--header-nav-height` / `--header-height` fallbacks in `styles.css` (4rem / 8.5rem) predate the
  second row. They only apply before hydration measures the real values, so they were left alone.

## MUST NOT change
- `.header-sticky-group` stays the sticky element, pulled up by the MEASURED
  `--header-nav-height`. `navRef` is on `<header>`, which now holds both rows, so the measurement
  includes the category row. Do not measure `.header-inner` alone: the band would then pin under
  the category row.
- The search band paints nothing (`feature-sticky-search-band.md`). The tint lives on `.header`,
  never on `.header-sticky-group` or `.header-search-band`.
- No ancestor of `.category-nav-submenu` may set a non-visible `overflow`: `.header` must not
  clip. `.header-nav`'s own `overflow-x: auto` is fine, because the category row is not inside it.
- The submenu's `z-index` stays above `.search-bar-wrapper`'s 110.
- Section links' active state reads `useAppPathname()`, never `usePathname()`
  (`bugfix-nav-active-locale-pathname.md`).
- The logo link keeps `href="/"` and `aria-label={t('brand.ariaLabel')}`, and the words stay
  `aria-hidden`.
- Search Intelligence keeps `expert-only`. Recherche sémantique must not get it.
- `CategoryNav` stays prop-less and reads the active category from `useParams()`.
- Submenus stay gated on children.
- The hero CTA stays inside `.hero` (`feature-hero-cta-per-catalog.md`).
- `--acp-scroll` transform, the overlay dimming of `.header-inner`, and the `--header-height`
  ResizeObserver are unchanged.
