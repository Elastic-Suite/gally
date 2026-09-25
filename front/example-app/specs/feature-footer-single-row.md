# Feature: Footer on a single row

## Status: implemented
## Page/Component: src/components/Footer.tsx, src/styles.css (`.footer`, `.footer > p`, `.footer-nav`), src/locales/{en,fr,de}/common.json

## Problem
The footer had two rows: the lockup and section links, then a full-width rule and the line
"Powered by Gally - Gally SDK Features Demo". It took more height than it needed, and the tagline
talked about the SDK, which a demo visitor does not care about.

## Behaviour (testable)
- [x] One row: the brand lockup on the left, "Powered by Gally" in the centre, the section links on the right.
- [x] The centre line stays centred on the page whatever the widths of the lockup and the links
      (`grid-template-columns: 1fr auto 1fr`).
- [x] The line reads only "Powered by Gally" / "Propulsé par Gally" / "Betrieben mit Gally", with Gally as
      the indigo link. The `footer.tagline` key is deleted from all three locales.
- [x] No full-width rule inside the footer any more.
- [x] Under 768px the three parts stack, centred: lockup, line, links.

## MUST NOT change
- `BrandLockup` and `SectionLinks` are the same components as the header's, unchanged
  (`feature-footer-light.md`).
- The Gally link still points to `https://elasticsuite.io/products/gally/` and opens in a new tab.
- The footer background, top border and colours are unchanged.
