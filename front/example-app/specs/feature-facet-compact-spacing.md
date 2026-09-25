# Feature: Tighter spacing between facet groups

## Status: implemented
## Page/Component: src/styles.css (`.facet-group`)

## Problem
Each facet group had `1.5rem` of padding under it, then its divider, then `1.5rem` of margin before the next
group. That is 3rem of space per group, so the sidebar fit few facets on screen before scrolling.

## Behaviour (testable)
- [x] `.facet-group` uses `margin-bottom: 0.5rem` (was `1.5rem`) and `padding-bottom: 1rem` (was `1.5rem`).
      Space per group goes from 3rem to 1.5rem.
- [x] The divider (`border-bottom: 1px solid var(--gray-100)`) stays between groups.

## MUST NOT change
- `.facet-group:last-child` keeps no border, margin or padding.
- `.facet-group.story-highlight` keeps its own `0.75rem` padding.
- Facet titles, options and swatches are unchanged. Only the space between groups changed.
