# Feature: Typography switched to Geist, matching elasticsuite.io

## Status: implemented
## Page/Component: public/index.html, src/styles.css, docs/design-system.md

The storefront was Playfair Display (serif titles) + Inter (body). It is now **Geist
everywhere**, the family elasticsuite.io sets its whole site in.

## What the brand site actually uses (measured, not assumed)
Read off https://elasticsuite.io/ in a real browser, after `await document.fonts.ready`:

| Family | Weights | Applied to |
|---|---|---|
| Geist | 400, 500, 600, 700 | body, h1, h2, p, nav, buttons — everything |
| Geist Mono | 300–700 | small label / eyebrow headings (their `h3`) |

Stack: `Geist, "Helvetica Neue", Helvetica, Arial, sans-serif`. Self-hosted as
`geist-v3-latin-*.woff2`.

**Discarded from that reading:** `Source Sans 3` and `Axeptio CJK Fallback` also appear
in `document.fonts`, but they are injected by the Axeptio cookie-consent widget. They
are a third-party vendor's fonts, not brand typography.

## Behaviour (testable)
- [x] `public/index.html` loads `Geist:wght@400;500;600;700` from Google Fonts.
      Those are the four weights elasticsuite.io ships **and** exactly the four this
      stylesheet uses (audited: 400×2, 500×15, 600×39, 700×23; no 300, so Inter's 300
      was dropped rather than carried over).
- [x] Verified in a real browser: `document.fonts` reports **only** `Geist` — Playfair
      and Inter are gone, not merely overridden. `document.fonts.check('700 2rem Geist')`
      is `true`, so the face really rendered and did not silently fall back to Helvetica.
      Computed `font-family` is Geist on the hero h1, body, buttons and nav links.
- [x] One `.woff2` is fetched — Google serves Geist as a variable font, so all four
      weights come from a single file. The previous pairing pulled two families.

## Token rename
- `--font-serif` → **`--font-display`** (10 use sites). The value is a sans now; a token
  called "serif" holding Geist would mislead the next reader.
- `--font-sans` keeps its name — still accurate.
- Both resolve to the same Geist stack today. They stay **two** tokens deliberately: the
  10 display sites still record "this is a title", so restoring a distinct display face
  is a one-line change in `:root`.
- Older specs (e.g. `feature-acp-focus-empty-state.md`) still refer to `--font-serif`.
  They are historical records and were not rewritten; `docs/design-system.md` notes the
  rename.

## Accepted consequence
There is **no serif in the app any more**. Playfair Display gave the hero, page titles
and blog post pages an editorial character that Geist does not reproduce — headings now
read as a tighter, more product-like sans. That was the explicit choice: fidelity to the
brand site over the storefront's previous look. The alternative considered and rejected
was keeping Playfair for titles and using Geist only for body/UI.

## Deferred
Geist Mono for uppercase eyebrow labels (facet titles, ACP section titles) — the device
elasticsuite.io uses on its `h3`. Not adopted; it needs a third token and touches facet
and ACP styling. The 12 `font-family: monospace` declarations in the debug/tracking
panels are untouched — a generic keyword for code, not brand type.

## SDK contract used
- None.

## Tracking (required)
- No change.

## UI constraints
- No new hex, no new spacing. Two typography tokens changed value; one renamed.
- No component markup changed — this is entirely `:root` plus the font `<link>`.

## MUST NOT change
- **Keep the weight list in `index.html` in sync with the stylesheet.** Using a weight
  that is not requested makes the browser synthesise it (faux bold), which looks subtly
  wrong rather than broken. Today: 400/500/600/700.
- The `"Helvetica Neue", Helvetica, Arial` fallback chain — it is elasticsuite.io's own,
  and it is what shows during `font-display: swap`.
- Do not re-point `--font-display` at a serif without an approved spec; the palette and
  the all-sans typography are now a matched pair.
