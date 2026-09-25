# Feature: light glass autocomplete overlay (ACP)

## Status: implemented
## Page/Component: src/styles.css (ACP rules), src/components/SearchOverlay.tsx (unchanged)

The dark indigo scrim (`rgba(30, 27, 75, 0.92)`) with light panel text clashed with the light
header (`feature-header-light-two-row.md`). Chosen from a mockup study (`gally-mockup` skill,
variant "G3 - indigo wash" out of white glass / pale indigo glass / indigo wash): a light wash,
pale `--indigo-50` at the top to `--indigo-100` at the bottom, 88% opaque, with the same 28px
blur, and the whole panel in dark text. The wash was picked over plain white because the white
product cards need a ground to separate from.

Supersedes the colour values in `feature-acp-visual-redesign.md`, `bugfix-acp-scrim-blur-dropped.md`
(the .92 indigo tint), `bugfix-acp-background-scroll-and-density.md` and
`bugfix-acp-attribute-value-typography.md`. Their layout, scroll and blur rules all stand.

## Behaviour (testable)
- [x] Scrim: `linear-gradient(180deg, color-mix(in srgb, var(--indigo-50) 88%, transparent),
      color-mix(in srgb, var(--indigo-100) 88%, transparent))` + `blur(28px)`.
- [x] Panel text dark: section titles `--indigo-900` over a `--gray-200` rule; terms and categories
      `--gray-900`; attribute values `--gray-800` with `--gray-600` counts; blog titles `--gray-900`
      with `--gray-600` meta; empty notes `--gray-600`; the focus prompt title `--indigo-900` and
      subtitle `--gray-600`.
- [x] Rows: `--gray-200` separators, hover `--indigo-50`, keyboard highlight `--indigo-100` plus the
      coral inset bar. A highlighted product card shows `--indigo-100` and its indigo ring.
- [x] Matched words in blog rows are `--coral-600` (`--coral-400` is too weak on a light ground).
- [ ] Skeleton rows use the global gray shimmer. (Not seen: skeletons only show while results load, and the capture waited past them.)
- [x] Legible over a busy page (a category grid behind the overlay).

Verified 2026-09-24 by a capture of the running app (`mockups/acp-footer-implemented/`, 1440px, footer also at 390px), compared with the picked mockup variant.

## SDK contract used
- None changed.

## Tracking (required)
- None changed.

## UI constraints
- Tokens only; the translucency is `color-mix()` of tokens, no new rgba value.

## MUST NOT change
- The scrim alone owns the tint and the blur; the panel stays background-less
  (`bugfix-acp-scrim-blur-dropped.md`).
- The standard `backdrop-filter` stays LAST in every prefixed pair.
- The keyboard highlight stays visible on both row types (list rows and product cards) - check it
  against the wash, which is itself indigo.
- Scroll ownership, the `--acp-scroll` header ride and the portal are untouched.
