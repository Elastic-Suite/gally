# Feature: Header brand lockup — official "elasticsuite solutions" SVG

## Status: SUPERSEDED by specs/feature-logo-gally-example.md
> The header no longer renders this lockup. The rabbit was cropped out of the asset and
> "Gally example" is now set as type beside it — which is the reversal this spec's own
> History section anticipated. `src/assets/elasticsuite-solutions.svg` is kept as the
> provenance source of that crop and as the only copy of the official wordmarks; it is no
> longer imported by any component. Everything below is history: `.header-logo-img` is now
> `.header-logo-mark`, and `brand.ariaLabel` now says "Gally example".
## Page/Component: src/components/Header.tsx, src/assets/elasticsuite-solutions.svg, src/styles.css, src/locales/{en,fr,de}/common.json

The top-left home link is the official ElasticSuite Solutions lockup: one SVG holding
the rabbit mark, "elasticsuite" in white and "solutions" in coral. No text is set
beside it — the asset is the whole lockup.

## History
1. Originally `Elastic` + coral `Suite`, set in the header's own type.
2. Then a composed lockup: the Gally rabbit (cropped out of `api/public/gally-logo.svg`)
   + serif "Gally" + a translated "by ElasticSuite solutions" baseline.
3. Now the official ElasticSuite asset, replacing all of that.

**Step 3 removes the word "Gally" from the header**, which reverses the brand-visibility
goal behind step 2. That was the explicit request. If it is ever reversed, the Gally
rabbit is one command away — crop `api/public/gally-logo.svg` to `viewBox="0 0 88 85"`,
which drops the unreadable `#2716B7` wordmark (mark and wordmark share compound paths,
so cropping is the only clean split).

## The asset
- Source: the inline SVG sprite on https://elasticsuite.io/ , symbol id
  `brand__elasticsuite-solutions-multi--caption`, `viewBox="0 0 219 63"`, 3 paths.
- **The supplied snippet could not be used as given.** It was
  `<svg viewBox="0 0 219 63"><use xlink:href="#brand__elasticsuite-solutions-multi--caption"/></svg>`
  — a reference into that sprite, carrying no artwork. Dropped into this app it renders
  nothing, because the sprite is not on our page. The symbol was extracted and its
  wrapper converted to an `<svg>` root so the file stands alone. Paths are verbatim.
- The snippet's `class="max-lg:hidden h-10"` is Tailwind, which this app does not use.
  `h-10` is carried over as `height: 2.5rem`; `max-lg:hidden` is not needed — the lockup
  renders 139×40 CSS px, narrow enough to keep on the first header row at 420px.
- Brand colours `#F56553` / `white`; see the palette exemption in ../docs/design-system.md.

## Behaviour (testable)
- [x] Top-left renders the lockup at 139×40 CSS px, intrinsic 219×63, inside a
      `<Link to="/">`.
- [x] Accessible name on the link (`brand.ariaLabel`), `alt=""` on the `<img>`, so the
      lockup is announced once rather than twice. Updated to "ElasticSuite Solutions —
      go to homepage" / "… aller à l'accueil" so it matches what is now visible.
- [x] Verified in a real browser at 1400px and 420px: `naturalWidth` 219 (asset decodes),
      rendered 139×40, header still one row at 420px.

## Trap this cost real time
The first version of the asset had a provenance comment quoting the sprite id
(`…multi--caption`) and a token name (`--color-indigo`). **An XML comment may not contain
`--`**, so the file was not well-formed. The failure is silent and misleading: the
browser reports `complete: true` but `naturalWidth: 0`, `width: auto` therefore computes
to `0`, and the logo is invisible with an empty console. ImageMagick had rendered the
pre-comment version happily, so it passed local rendering. Validate SVG assets with an
XML parser after editing; the comment now avoids `--` and points here for the id.

## Removed with this change
- `src/assets/gally-mark.svg` (no longer referenced).
- `.header-logo-mark` / `-text` / `-name` / `-baseline` / `-accent` rules, and the
  mobile rule that hid the baseline under 768px.
- The `brand.baseline` i18n key and the app's only `<Trans>` usage — the accent span it
  existed to interpolate is now part of the artwork.

## SDK contract used
- None. Presentation only.

## Tracking (required)
- No change. The lockup is a plain router `<Link>`; no event fires from it.

## UI constraints
- No colour or font set in CSS for the lockup; two rules only (`.header-logo`,
  `.header-logo-img`). No new token.

## MUST NOT change
- **The `<img>` must keep an explicit `height` with `width: auto`.** Both come from the
  asset's intrinsic ratio; hard-coding a width would distort it.
- The link's `to="/"` and `brand.ariaLabel`. With the Home nav item gone
  (`feature-nav-remove-home.md`), this is the only header route to the homepage.
- The asset stays on a dark surface — the wordmark is white and disappears on light.
- Do not reintroduce a `.header-logo span { … }` catch-all; nothing needs it now, and it
  is what previously forced the accent colour onto every nested span.
