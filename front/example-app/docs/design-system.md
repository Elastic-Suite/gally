# Design System — Graphic Contract

Style inspired by elasticsuite.io. Any visual change MUST comply, or reference an approved spec.

## Palette (fixed)
| Token           | Value     | Use                    |
|-----------------|-----------|------------------------|
| --color-indigo  | #1a1a2e   | headers, deep bg       |
| --color-coral   | #ff6b6b   | primary accent / CTAs  |
| --color-bg      | light     | airy backgrounds       |

## Typography
- Titles: **serif**. Body: **sans**. No other font families.

## Component patterns (do NOT re-style ad hoc)
- Buttons: pill shape.
- Hero: gradient background.
- Stats band below hero.
- Facet sidebar: price slider, checkbox (with search-in-options + show-more, server-backed via `viewMoreProductFilterOption` when `aggregation.hasMore`), color swatches, boolean toggles, category facet (single-select), active-filter chip row above the facet list ("Clear all" pill included).
- A facet with 0 or 1 possible value is never rendered (non-discriminant — see `specs/feature-facet-hide-single-value.md`), regardless of type.
- Header: two sticky rows — nav/selectors/cart, then a search band matching the page background (no card/shadow around the search bar). Search input grows via `transform: scale()` on focus, never via width/font-size/padding changes.
- Autocomplete popup: full-screen `backdrop-filter: blur()` overlay portaled to `document.body` (never nested inside the sticky header — it would be trapped in the header's own stacking context). Always 3 columns (popular terms / products / category), each always showing its title plus exactly one of: shimmer skeleton, italic "No matching …" note, or results. Fixed `min-height` so the panel doesn't jump size between keystrokes. Keyboard-navigable (arrows + Enter + Escape) — see `specs/feature-search-header-redesign.md`.

## Rules for agents
- Reference CSS variables only — never hardcode hex, px, or font-size in TSX or new CSS.
- Facets must stay responsive (collapse on mobile, grid adapts).
- Adding a color/spacing value? Add a token here first, then use it.
- All visual rules live in one `src/styles.css` (~58KB) — treat changes to it as high-risk.