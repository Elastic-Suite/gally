# Bugfix: Homepage hero sat flush against the header search bar

## Status: implemented
## Page/Component: src/styles.css (`.hero`)

## Problem
`.main-content` gives every page a `2rem` top padding. `.hero`'s `margin: -2rem -2rem 2rem` bled it edge-to-edge
horizontally (canceling the container's `2rem` side padding) but the `-2rem` on top *also* canceled the
container's top padding — collapsing the gap between the header's search bar and the hero to zero, so the hero
sat flush against it with no breathing room.

## Behaviour (testable)
- [x] Changed `.hero`'s margin to `0 -2rem 2rem` — keeps the horizontal full-bleed background, restores the
      natural `2rem` gap above the hero.
- [x] `border-radius` switched from bottom-corners-only (`0 0 var(--radius-lg) var(--radius-lg)`, meant for a
      hero flush against the header above it) to all corners, since the hero no longer touches the header.

## MUST NOT change
- Horizontal full-bleed effect and gradient background — unaffected, only the top margin/radius changed.
