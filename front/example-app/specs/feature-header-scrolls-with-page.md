# Feature: the header and search bar scroll away with the page

## Status: implemented
## Page/Component: src/styles.css (`.header-sticky-group`, `.facets-sidebar`, `.search-overlay-scrim`), src/components/Header.tsx (`--header-height`), src/components/SearchOverlay.tsx (`--acp-page-offset`)

## Problem

The search band was pinned to the viewport top while a page scrolled
(specs/feature-sticky-search-band.md). The request is the opposite: the search bar stays where it
is in the page, and scrolls out of view with everything else.

## Behaviour (testable)

- [x] `.header-sticky-group` is `position: relative`, no longer `sticky`. Nav row, category row and
      search band all scroll away with the page. `z-index: 40` stays, and the popup rule still
      raises it to 100 above the scrim - that is the only reason the group keeps a position.
- [x] The blurred layer around the input (`.search-bar-wrapper::before`) is removed, with the
      `data-scrolled` attribute and the scroll listener in `Header` that set it. It only existed to
      separate the pinned bar from content scrolling under it, which no longer happens.
- [x] `--header-nav-height` is no longer published: its two readers (the negative sticky `top` and
      the facet sidebar offset) are gone. `--header-height` is still measured - the popup uses it.
- [x] The facet sidebar stays sticky, with `top: 1rem` instead of clearing the pinned band.
- [x] Opening the search popup after a small scroll: the header may sit partly above the viewport.
      `SearchOverlay` records `min(scrollY, --header-height)` as `--acp-page-offset` on open, and the
      scrim's top padding is `--header-height - --acp-page-offset + 1rem`, so the panel still starts
      right under the bar. `--acp-scroll` (the header riding the popup scroll) is clamped to
      `--header-height - --acp-page-offset`, the part of the header still on screen. Both
      properties are removed on close.

## SDK contract used

None.

## Tracking (required)

None - no interaction changed.

## UI constraints

- No new token, colour or component.
- The search bar, cart badge and catalog selectors are only reachable near the top of the page.

## MUST NOT change

- Keep `position: relative` on `.header-sticky-group`: without a position its z-index does nothing
  and the open popup's scrim would cover the search bar.
- Keep `--acp-page-offset` in both scrim paddings (desktop and the mobile media query).
