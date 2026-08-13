# Feature: Header logo — Gally rabbit + "Gally example" wordmark, and the ElasticSuite → Gally rename

## Status: implemented
## Page/Component: src/components/Header.tsx, src/components/Footer.tsx, src/components/IntroScreen.tsx, src/assets/gally-rabbit.svg, src/styles.css, app/layout.tsx, src/locales/{en,fr,de}/{common,category,cms}.json

The header brand was the official "elasticsuite solutions" lockup — one SVG carrying the
rabbit and both wordmarks, with no type set beside it
(`specs/feature-header-brand-lockup.md`, now superseded). It is now **the rabbit alone plus
"Gally example" set as type**, keeping the lockup's own two colours: "Gally" in white,
"example" in coral. **Every user-visible "ElasticSuite" in the app was then renamed to
Gally** — see the rename section below.

## The asset
- `src/assets/gally-rabbit.svg` — the rabbit alone, cropped out of
  `elasticsuite-solutions.svg` by keeping **only that lockup's third path** (the mark; paths
  1 and 2 are the "solutions" and "elasticsuite" wordmarks) and narrowing the viewBox from
  `0 0 219 63` to `0 0 67 63`. Path data is verbatim, brand coral `#F56553` untouched.
- The crop bound was measured, not guessed: rendered at 10 px/unit on an oversized canvas
  and trimmed, the mark's ink runs to x ≈ 66.8, y ≈ 62.6 — and slightly *past* 0 on both
  axes, because two curves near the origin have control points at `x -0.29` / `y -1.03`.
  The original lockup clips those same fractions of a unit, so `0 0 67 63` reproduces the
  framing it already had rather than "fixing" it.
- `elasticsuite-solutions.svg` is **kept but no longer imported**: it is the provenance
  source of this crop and the only copy of the official wordmarks.
- The `--` trap from the previous spec still applies and cost real time once already: **an
  XML comment may not contain two dashes in a row.** The new asset's comment therefore
  quotes no CSS token name and no sprite id. Validated with an XML parser after writing,
  and again over HTTP on the asset Next actually serves.

## Behaviour (testable)
- [x] Top-left is the rabbit at 2.5rem tall (~2.66rem wide, from the asset's 67:63 ratio,
      never a hard-coded width) followed by "Gally example" on one line.
- [x] "Gally" is `--white`, "example" is `--coral-500` — the same white/coral split the
      lockup had between "elasticsuite" and "solutions". Set in `--font-display` at
      1.15rem/600.
- [x] The words are **not translated**: a brand name, not copy. They are literals in the
      TSX, and both spans are `aria-hidden`, so the link is announced once — via
      `brand.ariaLabel`, updated to "Gally example — go to homepage" in all three locales.
- [x] Verified over HTTP on the running stack: the served asset parses as XML, `viewBox
      "0 0 67 63"`, 1 path, `fill #F56553`, 200 `image/svg+xml`; the rendered markup carries
      `.header-logo-mark`, `.header-logo-text`, `.header-logo-name` "Gally",
      `.header-logo-accent` "example", and the localized `aria-label` on `com_en` / `com_fr`.
- [x] Hero body says "Gally" in all three locales (`homepage.heroBody` in `category.json`,
      where the homepage strings live). Confirmed rendered on `com_en`, `com_fr`, `en_fr`.

## The rename (ElasticSuite → Gally)
Renamed everywhere it is **read by a visitor**:
- [x] Footer: "Powered by **Gally**", linking to `https://elasticsuite.io/products/gally/`
      — Gally's own product page on the vendor site, which is what the "Powered by" line
      should credit. **Not gally.io**: that domain belongs to an unrelated product (a
      creative-workflow platform; checked, it is not this Gally), so it must never be used
      as the Gally link. The repository (`github.com/Elastic-Suite/gally`) was the interim
      target before the product-page URL was supplied.
- [x] Intro overlay `.intro-logo`: `Elastic<span>Suite</span>` → `Gally <span>example</span>`,
      so it is the same wordmark as the header. On the light card the first word takes
      `.intro-logo`'s `--indigo-900` and the span keeps `--coral-500`.
- [x] Root metadata title default: "Gally Features — ElasticSuite Demo" → "Gally example —
      Features Demo". `SITE_NAME` in `src/sdk/seo.ts` was already `Gally`, so the per-page
      template ("… · Gally") needed no change.
- [x] `cms.json` About + FAQ copy, all three locales. Two sentences had to be **rewritten,
      not substituted**: they read "Our latest innovation, Gally, brings vector search…",
      which positioned Gally as a product *of* ElasticSuite and becomes self-referential
      once the subject is Gally. They now read "Its vector search understands semantic
      meaning…" / "Sa recherche vectorielle comprend le sens sémantique…" / "Die
      Vektorsuche von Gally versteht Bedeutung, nicht nur Stichwörter". A blind
      find-and-replace here produces nonsense — check the sentence, not just the token.
- [x] Verified rendered: footer link text and href on `com_en`/`com_fr`/`fr_fr`, "About
      Gally" / "À propos de Gally" on `/cms/about`, "Comment Gally améliore" on
      `/en_fr/cms/faq`, `<title>` on both locales. Zero `ElasticSuite` left in any rendered
      page.

**Deliberately kept** — these are provenance, and renaming them would make them false:
- `src/styles.css` and `app/layout.tsx` comments citing elasticsuite.io as the source of the
  design and of the Geist weights. The design *is* modelled on that site.
- `src/assets/elasticsuite-solutions.svg` and its comment, plus the crop note in
  `gally-rabbit.svg`. That asset is where the rabbit came from.
- `@elastic-suite/gally-sdk` — the published package name.
- `elasticsuite@smile.fr`, the author email in `gally-sample-data` PHP headers. Not
  user-visible, and not this app's file to edit.

## SDK contract used
- None. Presentation only.

## Tracking (required)
- No change. The lockup is a plain `LocaleLink`; no event fires from it.

## UI constraints
- Tokens only in CSS (`--white`, `--coral-500`, `--font-display`). The one raw hex is
  `#F56553` **inside the asset file**, which is the documented brand-asset exemption in
  `../docs/design-system.md`.
- Four rules: `.header-logo`, `.header-logo-mark`, `.header-logo-text`, plus
  `-name` / `-accent`.

## MUST NOT change
- **`.header-logo-mark` keeps an explicit `height` with `width: auto`.** Both come from the
  asset's intrinsic ratio; hard-coding a width would distort the rabbit.
- **Do not add a `.header-logo span { … }` catch-all.** The two words are coloured by their
  own classes precisely because such a rule once forced the accent colour onto every nested
  span. This is the third time that rule has been a problem — see the superseded spec.
- The words stay untranslated, and stay `aria-hidden` with the accessible name on the link.
- The link's `href="/"` and `brand.ariaLabel`: with no Home nav item
  (`feature-nav-remove-home.md`) this is the only header route to the homepage.
- The mark is coral on both light and dark, so — unlike the old white wordmark — the header
  surface is no longer a constraint on the *mark*. The **white "Gally"** is: the lockup still
  needs a dark surface, and the header is `--indigo-900`/`--indigo-700`.
- Do not "restore" the elasticsuite wordmark asset into the header on the grounds that it is
  the official one. Removing it was the explicit request.

## Not verified
- The intro overlay is gated on `introSeen` in client state, so it never appears in
  server-rendered HTML and could not be checked the way the rest was. The change is a
  literal string swap in JSX and `tsc` is clean, but nobody has looked at it.
- The German strings were edited in the same shape as en/fr, but **no localized catalog in
  the sample data maps to `de`** — `LANGUAGES` in `src/sdk/catalogs.ts` maps `de_DE → de`
  and the six demo catalogs are only `fr_FR`/`en_US`. The `de` bundle is therefore not
  reachable by URL here, so its rename is unexercised.
