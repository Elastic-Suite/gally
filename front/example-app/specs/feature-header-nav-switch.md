# Feature: Header nav — Products / Articles as a segmented switch

## Status: implemented
## Page/Component: src/components/Header.tsx, src/styles.css

The header nav was three flat pill links (Products · Search Intelligence · Blog) whose only
selected state was a barely visible `rgba(255,255,255,0.15)` background — and which never
actually lit up, see `bugfix-nav-active-locale-pathname.md`. **Products and Articles are now
a segmented switch with a sliding thumb**, the same idiom as the search results type switch
(`feature-search-result-type-switch.md`), inverted for the dark bar. Search Intelligence
stays a plain link outside the switch: it is an expert-mode tool, not a third storefront
section.

## Behaviour (testable)
- [x] Products and Articles sit in one `.header-nav-switch` track: translucent white well
      (`rgba(255,255,255,0.12)`), pill radius, both segments the width of the wider one.
- [x] The selected segment is a raised solid `--white` pill with `--shadow-sm` and
      `--indigo-800` text — the strongest contrast available on the indigo bar. Unselected is
      transparent with `rgba(255,255,255,0.85)` text, white on hover.
- [x] **The thumb slides between the two segments** (280ms, `cubic-bezier(0.4, 0, 0.2, 1)`),
      exactly as on the results switch.
- [x] Each segment carries the *same* icon as its counterpart on the results switch — 🛍️
      Products, 📰 Articles — so the two switches read as the same pair of destinations.
      Icons are `aria-hidden`; the accessible name stays the label alone.
- [x] Labels come from the existing `nav.products` / `nav.cms` keys — no new i18n key, all
      three locales already covered.
- [x] `aria-current="page"` on the selected segment. They are links, not tabs, so this is
      **not** a `role="tablist"` — that is the one place this deliberately diverges from the
      results switch, which really is a tablist over one page's content.
- [x] Selected segment keeps its colour on hover: `.header-nav-tab.active` is declared after
      `:hover` and `.active:hover` is listed with it.
- [x] `@media (prefers-reduced-motion: reduce)` drops the slide.
- [x] Verified server-rendered on the running stack: `data-active` is `products` on
      `/com_en/category/cat_2` (with `header-nav-tab active` and `aria-current="page"`),
      `blog` on `/com_en/blog` and `/fr_fr/blog`, `none` on `/com_en` and `/com_en/cart`.
      `tsc --noEmit` clean, dev server `✓ Compiled` with no `⨯` lines.
- [ ] Not verified in a real browser — no browser tooling was available in this session, so
      the slide itself, and the 768px wrapped header, are unconfirmed by screenshot. The
      geometry is the same arithmetic as the results switch, which was measured frame by
      frame when it landed.

## The three-state thumb
`data-active` is `'products' | 'blog' | 'none'`, computed from the locale-free pathname.
`'none'` is a real state and the reason this could not be a straight copy of the results
switch: the homepage, the cart and `/explain` are inside neither section, and a switch that
always shows a selection would lie about where you are. It renders as `opacity: 0` on the
thumb — faded, not removed, so it can slide back in from where it left rather than jumping.

Otherwise the mechanism is the results switch's, verbatim and on purpose: `inline-grid` with
`1fr 1fr` columns so both segments are equally wide, one `::before` pseudo-element behind
both as the only moving part, `transform: translateX(calc(100% + 0.25rem))` where `100%` is
the thumb's own width. Compositor-only, so it can never reflow the sticky header row.

## SDK contract used
- None. Presentation only.

## Tracking (required)
- No change. Both segments are plain `LocaleLink`s; no event fires from the nav itself.
  Navigation-triggered tracking still comes from the destination pages.

## UI constraints
- No new visual primitive: this is the existing segmented-switch idiom re-skinned for a dark
  surface. If a third top-bar switch ever appears, factor the two into one before adding it.
- Tokens for every colour that has one (`--white`, `--indigo-800`, `--shadow-sm`,
  `--radius-pill`). The `rgba(255,255,255,…)` values are the header's own established idiom
  for translucent-on-indigo — `.context-select` and the plain nav links already use them.

## MUST NOT change
- **`.header-nav > a` must stay a child selector.** The plain-link rules (padding, hover
  background) are scoped to direct children so the switch's nested tabs never pick up that
  hover background — it would fight the thumb. Widening it back to `.header-nav a` puts two
  competing backgrounds on the selected segment.
- **The selected segment paints no background or shadow of its own.** The thumb draws both;
  a per-segment background leaves nothing continuous to animate, only a cross-fade.
- The `1fr 1fr` equal-width columns: the one-column translate depends on them, in every
  locale, with no JS measurement.
- The `'none'` state. Do not default it to `products` to "always show a selection".
- Search Intelligence stays outside the switch and keeps `expert-only`, which
  `.mode-direction .expert-only` hides in direction mode. Inside the switch it would break
  the two-column grid whenever the audience toggle changed.
