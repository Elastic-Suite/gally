# Feature: light footer mirroring the header

## Status: implemented
## Page/Component: src/components/Footer.tsx, src/components/BrandLockup.tsx, src/components/SectionLinks.tsx, src/components/Header.tsx, src/styles.css

> **Superseded in part** by `feature-footer-single-row.md`: the two rows are now one (lockup, powered-by
> line, section links), the full-width rule is gone, and the line reads only "Powered by Gally".

Chosen from a mockup study (`gally-mockup` skill, variant "F2"): the footer matches the light
header (`feature-header-light-two-row.md`) instead of the old dark indigo bar. Row 1 repeats the
brand lockup and the section links; row 2 is the unchanged "powered by" line, centred under a
full-width `--gray-200` rule. The surface is the header's tint mirrored: `--indigo-50` rising from
the bottom to white.

The lockup and the links are not copied markup: they were extracted from `Header.tsx` into
`BrandLockup` and `SectionLinks`, and both places render the same components.

## Behaviour (testable)
- [x] Footer row 1: the lockup on the left, Produits / Blog / (Search Intelligence, expert mode) /
      Recherche sémantique on the right, grey, the current section underlined in indigo.
- [x] Row 2: "Propulsé par Gally - …" centred, the Gally link in indigo.
- [x] The header looks and behaves exactly as before the extraction.
- [x] The footer's active link follows the route (Produits underlined on a category page).

Verified 2026-09-24 by a capture of the running app (`mockups/acp-footer-implemented/`, 1440px, footer also at 390px), compared with the picked mockup variant.

## SDK contract used
- None.

## Tracking (required)
- None changed.

## UI constraints
- Tokens only. The link rules are shared by `.header-nav > a` and `.footer-nav > a`.

## Known, out of scope
- On narrow screens the floating Insights button (bottom left) covers part of the powered-by line.
  It did so on the dark footer too.

## MUST NOT change
- `BrandLockup` keeps `href="/"`, `aria-label={t('brand.ariaLabel')}` and the `aria-hidden` words
  (`feature-logo-gally-example.md`).
- `SectionLinks` keeps the header's rules: active state from `useAppPathname()`, `expert-only` on
  Search Intelligence only, the Vector search link always visible.
- The powered-by link targets the vendor product page, not gally.io (see the comment in Footer.tsx).
- `.footer p a` is the only coloured footer link rule: a plain `.footer a` would recolour the
  section links.
