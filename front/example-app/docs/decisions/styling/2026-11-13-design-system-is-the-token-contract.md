---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Treat docs/design-system.md as the contract for colours, sizes and components

## Context and Problem Statement

This decision is older than this ADR. It was made in commit `b1579c76` (2026-07-30), which
added [design-system.md](../../design-system.md) with its rules. Golden rule 3 in
[AGENTS.md](../../../AGENTS.md) carries the component half. The eco badge, in commit `3a414938`
(2026-09-22), is the worked example, recorded in
[feature-eco-badge.md](../../specs/feature-eco-badge.md).

A storefront grows one change at a time. Without a rule, each change can bring its own hex
value, its own padding, or its own version of a card or chip. The look then drifts, and the same
colour starts to mean two things.

How do we keep visual changes consistent?

## Considered Options

No alternative was recorded.

## Decision Outcome

Chosen option: `docs/design-system.md` is the contract.

-   Reference CSS variables only. Never hardcode hex, px or font-size in TSX or new CSS.
-   A new colour or spacing value is added as a token in `docs/design-system.md` first, then used.
-   Reuse the primitives in `src/components`. Reaching for a second card or chip idiom is the
    signal to stop.

Brand assets and swatch colours are the two written exceptions to the no-raw-hex rule.

The eco badge shows the rule at work. It needed a green. The only green token, `--success`, was
rejected for two reasons, either one enough:

-   `--success` already means "added to cart" on the same product card.
-   White text on `--success` reaches 2.78:1, below the 4.5:1 that WCAG AA needs.

A new token, `--green-800` (5.13:1), was added to the design system with its reason. The badge's
CSS sets only a background. Padding, radius and size come from the existing pill.

### Consequences

-   Good, because one colour keeps one meaning across the app.
-   Good, because a design change is often one token edit.
-   Bad, because a small visual change first needs a design-system edit.
-   Bad, because nothing enforces the rule. Raw hex older than the rule is still in
    `src/components/EventLog.tsx` and `src/components/TrackingInsights.tsx`.

### Confirmation

-   `git diff main -- src | grep -E '^\+.*#[0-9a-fA-F]{3,6}\b'` finds no new raw colour, unless it
    is a brand asset or in `src/components/swatchColors.ts`.
-   In review, every new `var(--...)` in `src/styles.css` has a row in `docs/design-system.md`.
-   In review, a new card or chip component is challenged against golden rule 3.
