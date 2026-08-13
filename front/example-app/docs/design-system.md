# Design System — Graphic Contract

Style inspired by elasticsuite.io. Any visual change MUST comply, or reference an approved spec.

## Palette (fixed)
| Token           | Value     | Use                    |
|-----------------|-----------|------------------------|
| --color-indigo  | #1a1a2e   | headers, deep bg       |
| --color-coral   | #ff6b6b   | primary accent / CTAs  |
| --color-bg      | light     | airy backgrounds       |

## Brand assets (the one exemption to the palette rule)
- `src/assets/gally-rabbit.svg` — **the header brand mark**: the rabbit alone, cropped out of the
  official lockup below (third path only, viewBox narrowed `0 0 219 63` → `0 0 67 63`). The wordmark
  beside it, "Gally" in `--white` + "example" in `--coral-500`, is set as type in the header, not
  drawn in the asset. See `specs/feature-logo-gally-example.md`.
- `src/assets/elasticsuite-solutions.svg` — the official "elasticsuite solutions" lockup (mark +
  both wordmarks), taken verbatim from the sprite on elasticsuite.io. **No longer rendered
  anywhere**; kept as the provenance source of the crop above and as the only copy of the official
  wordmarks. Do not put it back in the header — removing it was an explicit request.
- Both keep their **brand** colours `#F56553` and `white`, deliberately *not* tokens, and must not be
  "corrected" to `--coral-500`. Brand assets are the only place raw hex is allowed, and only inside
  the asset file — never in TSX or CSS.
- **The header lockup needs a dark surface**, now because of the white "Gally" rather than a white
  wordmark in the asset. The mark itself is coral and works on either. It is legible today because
  the header is `--color-indigo`.
- Editing an SVG asset? **An XML comment may not contain `--`.** A provenance comment mentioning a
  sprite id like `…multi--caption`, or a token name like `--color-indigo`, silently makes the file
  undecodable: the browser reports `complete: true` with `naturalWidth: 0`, `width: auto` collapses
  to `0`, and the logo vanishes with no console error. Validate with an XML parser after editing.

## Typography
- **Geist everywhere** — titles and body alike, weights 400/500/600/700, loaded from Google Fonts in `public/index.html`. This matches elasticsuite.io, which sets its whole site in Geist with the stack `Geist, "Helvetica Neue", Helvetica, Arial, sans-serif`. No other font families.
- Two tokens, both currently Geist: `--font-display` (titles, 10 sites) and `--font-sans` (everything else). The split is kept so a distinct display face can return by editing one line. **`--font-serif` no longer exists** — it was renamed when the serif went away; older specs still mention it.
- There is deliberately **no serif** any more. The previous Playfair Display / Inter pairing gave the storefront an editorial look; dropping it was an explicit decision to match the brand site. See `specs/feature-geist-typography.md`.
- `font-family: monospace` in the debug/tracking panels is untouched — it is a generic keyword for code, not brand type. elasticsuite.io uses Geist Mono for that role; adopting it was considered and deferred.

## Component patterns (do NOT re-style ad hoc)
- Buttons: pill shape.
- **Add to cart is `--indigo-800` (`.btn-primary`), not coral** — everywhere it appears: product card, product page, autocomplete row. Coral (`.btn-coral`) stays for marketing CTAs such as the homepage hero. So "coral = CTA" in the palette table above means the *marketing* CTA; the transactional one is indigo. See `specs/feature-add-to-cart-indigo.md`.
- Hero: gradient background.
- Stats band below hero.
- Facet sidebar: price slider, checkbox (with search-in-options + show-more, server-backed via `viewMoreProductFilterOption` when `aggregation.hasMore`), color swatches, boolean toggles, category facet (single-select), active-filter chip row above the facet list ("Clear all" pill included).
- A facet with 0 or 1 possible value is never rendered (non-discriminant — see `specs/feature-facet-hide-single-value.md`), regardless of type.
- When that leaves **no** facet at all, the sidebar shows a `.facets-empty` italic note instead of a bare "Filters" heading on an empty card — three messages, because the causes differ: nothing matched / filters removed everything (actionable) / results too uniform to filter. See `specs/feature-facet-empty-state.md`.
- Header: two sticky rows — nav/selectors/cart, then a search band matching the page background (no card/shadow around the search bar). The search input is one fixed size regardless of focus — the old `transform: scale()` grow-on-focus is gone, and a coral focus ring is the only focus affordance (`specs/feature-acp-visual-redesign.md`); if a focus emphasis is ever wanted back, use `transform`, never width/font-size/padding. The nav's Products/Articles pair is the segmented switch below in its dark-surface form; Search Intelligence stays a plain pill link beside it. See `specs/feature-header-nav-switch.md`.
- Autocomplete popup: full-screen `backdrop-filter: blur()` overlay portaled to `document.body` (never nested inside the sticky header — it would be trapped in the header's own stacking context). Always 3 columns (popular terms + attributes / products / category + blog), each **section** always showing its title plus exactly one of: shimmer skeleton, italic "No matching …" note, or results. The popular terms are the engine's own `termSuggestions` (products + blog, merged and deduped), never a hardcoded list — see `specs/feature-acp-real-term-suggestions.md`. Fixed `min-height` so the panel doesn't jump size between keystrokes. Keyboard-navigable (arrows + Enter + Escape), in visual order — see `specs/feature-search-header-redesign.md`.
- Blog rows in the popup mark their matched query words with `.autocomplete-mark` (coral, no background) — the only place text highlighting is used, because a `cms_page` hit often matches on body copy the row doesn't show. See `specs/feature-blog-cms.md`.
- Segmented switch: centered pill track (`--gray-100`) holding equal-width pill segments, with a single raised `--white` + `--shadow-sm` thumb that **slides** between them (`transform` only, 280ms, cut under `prefers-reduced-motion`). Used in two places, and only these: the search results Products/Articles selector, and the header nav's Products/Articles pair — where the track becomes `rgba(255,255,255,0.12)` and the selected label `--indigo-800`, because the surface is indigo. The header one adds a third `data-active="none"` state (thumb at `opacity: 0`) for routes inside neither section; a switch over page content never needs that. Segments are equal-width (`grid-template-columns: 1fr 1fr`) because the slide is a one-column translate — that is a requirement of the effect, not a free choice. It reuses the pill idiom rather than adding a third tab/chip primitive — the underline-tab style it replaced is gone from the app entirely. See `specs/feature-search-result-type-switch.md`.
- Blog cards reuse the `.product-card` idiom (white surface, same radius/shadow, same hover lift); browse chips reuse `.filter-chip` with a `.filter-chip-selected` state. No second card or chip primitive.

## Rules for agents
- Reference CSS variables only — never hardcode hex, px, or font-size in TSX or new CSS.
- Facets must stay responsive (collapse on mobile, grid adapts).
- Adding a color/spacing value? Add a token here first, then use it.
- All visual rules live in one `src/styles.css` (~80KB) — treat changes to it as high-risk.
- **Vendor-prefixed properties: standard spelling LAST.** Next minifies with lightningcss, which
  treats `foo` and `-webkit-foo` as one declaration and keeps only the last — so the CRA-era
  prefixed-last convention silently *deletes* the standard property. Better still, declare only the
  standard one and let the browserslist targets add prefixes. Either way, verify on the served
  `/example/_next/static/chunks/…styles….css`, never on the source: this cost the ACP its
  `backdrop-filter` blur in Chrome and Firefox for the whole Next migration
  (`specs/bugfix-acp-scrim-blur-dropped.md`).