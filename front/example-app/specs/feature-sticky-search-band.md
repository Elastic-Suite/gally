# Feature: the search bar stays put while a page scrolls

## Status: implemented
## Page/Component: src/styles.css (`.header-sticky-group`, `.header`, `.header-search-band`, `.facets-sidebar`), src/components/Header.tsx (`--header-nav-height`)

## Problem

Nothing in the header stayed put while scrolling a page. `.header` was `position: sticky; top: 0`,
which achieved almost nothing: **a sticky element is constrained to its containing block**, and
`.header`'s parent `.header-sticky-group` is only as tall as the nav row plus the search band, so the
row unpinned again after roughly one band height of scrolling and left with the page.
`.header-search-band` was never positioned at all.

`docs/design-system.md` described "two sticky rows", which is what made this look intentional rather
than broken. Corrected there.

The same trap caught the first attempt at this change: making `.header-search-band` sticky is
equally useless, and for exactly the same reason — its containing block is the same short group. The
element that can stick is **the group**, whose own containing block is `.app-layout` and spans the
page.

## Behaviour (testable)

- [x] `.header-sticky-group` is `position: sticky` with
      `top: calc(-1 * var(--header-nav-height, 4rem))`. The negative offset pulls the nav row
      (brand, nav, catalog selectors, cart) above the fold as the page scrolls, leaving the search
      band flush with the viewport top. The nav is still painted, just off-screen — no separate
      hide/show state to keep in sync.
- [x] `Header` publishes `--header-nav-height` next to the existing `--header-height`, from the same
      `useLayoutEffect` + `ResizeObserver`, now observing both the group and the nav row. Both are
      measured rather than assumed because the nav row wraps on mobile
      (`--header-height` fallback is `8.5rem` desktop / `11.5rem` mobile).
- [x] `.header` is no longer sticky, and its `z-index: 120` went with it: inert on a static block
      child, and leaving it would imply a stacking order the row no longer takes part in.
- [x] **The band stays fully transparent**, so the header still reads as seamless with the page at
      rest. An earlier attempt gave the whole band a translucent background; that was removed in
      favour of the halo below, which does the same job without re-introducing a full-width surface.
- [x] **The band paints nothing.** No background, no veil — only padding, so the header stays
      seamless with the page.
- [x] **Separation is one blurred layer around the input**, on `.search-bar-wrapper::before`:
      `backdrop-filter: blur(8px)`, `inset: -0.75rem`, **no tint**. The page stays visible through
      it, just unreadable close to the bar.
- [x] **A radial mask feathers it in every direction** —
      `radial-gradient(closest-side, #000 45%, transparent 100%)`. This is the part the earlier
      attempts got wrong: without a mask the layer reads as a hard-edged plate, and with a
      *vertical* ramp the effect only appears above the bar. `closest-side` fits the box, so the
      falloff radiates from the input outward.
- [x] `z-index: -1` keeps it behind the input while staying inside the wrapper's own stacking
      context (`position: relative; z-index: 110`), so it cannot fall behind the band. Negative
      `inset` means it extends past the input rather than shrinking it — no layout shift.
- [x] Always rendered at `opacity: 0` (a pseudo-element existing in one state cannot transition) and
      revealed **only when scrolled and only while the ACP is closed**:
      `.header-sticky-group[data-scrolled]:not(:has(.search-bar-wrapper.overlay-open))`.
- [x] `Header` toggles `data-scrolled` at `scrollY > nav.offsetHeight` — the point at which the band
      becomes the topmost row and content starts passing behind the bar. An attribute rather than a
      variable, so CSS owns the ACP condition. Passive, rAF-coalesced, read once on mount so a
      back-navigation restoring a scrolled position is not missed.
- [x] Prefixed-first/standard-last for `backdrop-filter`. Verified in the served bundle, and the two
      prefix pairs behave **differently**: lightningcss collapses `backdrop-filter` and keeps only
      the standard property, but ships **both** spellings of `mask-image`. Do not assume symmetry
      between prefix pairs — check the output.

### Rejected on review

Implemented, looked at, removed. Recorded so they are not re-proposed as obvious improvements:

- **A flat translucent band** — `rgba(--gray-50, 0.85)` + `blur(12px)` on `.header-search-band`.
  Too heavy: a full-width surface across the whole header.
- **An unmasked pill halo**, `inset: -0.5rem` with a tint. A hard-edged plate, and 8px of bleed is
  too little for any falloff.
- **A progressive blur** across the band: two stacked masked layers (16px and 6px) ramping from the
  top edge down. Technically the real "blur gradient", but judged ugly — and because the ramp was
  vertical it only showed *above* the bar, never around it. **The axis was the mistake**, which is
  why the surviving version masks radially around the input instead.
- `--gray-50-rgb`, added for the flat band, was removed with it: no tint remains anywhere.

### Regression introduced and fixed while iterating

Removing the progressive-blur experiment by slicing between two file offsets also deleted
`.header-search-row`'s declarations (`max-width: 1400px; margin: 0 auto; display: flex;
justify-content: center`), which sat between the block being removed and the next rule. **The search
bar rendered flush left** until it was restored. A selector-set diff against `HEAD` (401 selectors,
both sides) now confirms nothing else was lost. Lesson: remove CSS by matching the exact rule text,
never by cutting between offsets.

- [x] `padding-bottom: 0.75rem` added to the band. At rest `.main-content`'s `2rem` supplied the gap
      under the bar; once pinned, content scrolls right up to the band's edge with nothing between it
      and the input.
- [x] `.facets-sidebar`'s sticky offset follows the band:
      `calc(var(--header-height) - var(--header-nav-height) + 1rem)` — the band's height, derived
      from the two published values. It was a hardcoded `top: 80px` from when nothing in the header
      stayed put; the band's bottom edge now sits at ~100px, so the sidebar would have slid under it.
- [x] The group's `z-index: 40` is now *effective* (sticky is positioned, so it creates a stacking
      context). That is the value the existing comment already intended: **below**
      `.category-nav-submenu`'s `50`, so a scrolled-under category flyout is not covered by the
      header. Previously inert, since the group was static.
- [x] With the ACP open the group's `:has(.overlay-open)` rules still win — `z-index: 100` over the
      scrim's `90`, plus the `--acp-scroll` transform from `feature-acp-header-rides-scroll.md`,
      which composes with the sticky offset rather than replacing it.
- [ ] **Not confirmed in a browser.** No browser tooling was available in this session. Every rule and
      custom property is verified present in the served bundle, and the sticky-containing-block
      reasoning is the documented CSS behaviour — but "does the bar actually stay put, and does the
      facet sidebar clear it" is a look-at-it question. Worth one pass on `/search?q=robe` (long
      result list plus the facet sidebar) and on a product page.

## SDK contract used

None.

## Tracking (required)

None — no interaction changed.

## UI constraints

- No new token, no new colour, no new component, no new visual primitive. The blurred layer paints no
  surface of its own — it only blurs what is already behind it.
- Cost: one `backdrop-filter` on an element that composites while scrolling, at `opacity: 0` unless
  scrolled, so it is only paid in the state that needs it.
- `.header-search-band` keeps a `transition: background, backdrop-filter` that nothing sets. It
  predates this work and is left alone.
- Cost: the band occupies ~100px of every viewport permanently. The nav row's ~64px is reclaimed by
  scrolling it away, which was the point of pinning the band rather than the whole header.
- The cart badge and catalog selector are only reachable at scroll-top, an accepted consequence of
  that choice.

## MUST NOT change

- **The sticky element must stay `.header-sticky-group`.** Moving `position: sticky` onto `.header`
  or `.header-search-band` recreates the original bug: both are constrained to the group's short box
  and will unpin after ~64px. This is the single most re-breakable thing here.
- **The band itself must paint nothing.** Three band-wide treatments were built and rejected; the
  separation belongs on the bar, not across the header.
- **Keep the mask.** Without it the layer is a hard-edged plate — the failure mode of two earlier
  attempts. And keep it *radial*: a vertical ramp puts the effect above the bar instead of around it.
- **Keep it to one layer and no tint.** Stacked layers were tried and rejected; a tint re-introduces
  the colour that was explicitly removed from the band.
- **Keep both gate conditions.** Unconditional, it shows at scroll-top where there is nothing to
  separate from; without `:not(:has(.overlay-open))` it stacks pointlessly under the ACP's scrim.
- **Keep the negative `top` tied to `--header-nav-height`.** A hardcoded value desynchronises the
  moment the nav row wraps at a narrow width.
- **Do not restore `.facets-sidebar { top: 80px }`** or any other fixed offset — it must track the
  band's measured height.
