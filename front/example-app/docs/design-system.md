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

## Rules for agents
- Reference CSS variables only — never hardcode hex, px, or font-size in TSX or new CSS.
- Facets must stay responsive (collapse on mobile, grid adapts).
- Adding a color/spacing value? Add a token here first, then use it.
- All visual rules live in one `src/styles.css` (~58KB) — treat changes to it as high-risk.