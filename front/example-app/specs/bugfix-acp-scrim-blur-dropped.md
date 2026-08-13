# Bugfix: the ACP scrim lost its blur in the Next build

## Status: implemented
## Page/Component: src/styles.css (`.search-overlay-scrim`)

## Problem
Reported as "overlay transparency was increased, the ACP is less visible". Nothing had touched the
overlay's CSS — the reported change came from the build.

`.search-overlay-scrim` declared, in this order:

```css
backdrop-filter: blur(28px);
-webkit-backdrop-filter: blur(28px);
```

Next 16 minifies CSS with **lightningcss**, which treats a property and its `-webkit-` form as the same
declaration and keeps only the **last** one. The shipped stylesheet therefore contained
`-webkit-backdrop-filter` *alone* — and Blink does not implement the prefixed form (it is Safari's
spelling; Chrome has only ever supported the unprefixed property). So in Chrome and Firefox the scrim
had **no blur at all**, only its flat `rgba(30,27,75,…)` tint.

Root cause is not the property order as a style question — it is the wrong belief that the
prefixed-last convention inherited from CRA's autoprefixer pipeline is still harmless. Under
autoprefixer both declarations survived and order didn't matter; under lightningcss the last one wins
and silently deletes the other. The regression therefore arrived with
`specs/feature-nextjs-migration-phase1.md` and stayed invisible in code review, because the source
still reads correctly.

Why it presented as "more transparent": the panel deliberately owns no background of its own
(`specs/feature-acp-visual-redesign.md`), so the scrim is the *only* ground the panel's light text
gets. With the blur gone, a category grid behind the overlay showed through sharply and fought every
column.

## Behaviour (testable)
- [x] Declaration order inverted — `-webkit-backdrop-filter` first, `backdrop-filter` last — so the
      standard property is the one lightningcss keeps. A comment in `styles.css` says why, because the
      order looks like a mistake to anyone who doesn't know the minifier's behaviour.
- [x] Verified on the **served** stylesheet, not the source: `/example/_next/static/chunks/…styles….css`
      now contains `backdrop-filter: blur(28px)`, and `getComputedStyle('.search-overlay-scrim')
      .backdropFilter` reports `blur(28px)` in a real browser (it reported `none` before).
- [x] Prefix emission is left to lightningcss's browserslist targets: the dev target
      (`last 1 safari version`) needs no prefix at all, and the production target (`>0.2%, not dead`)
      makes it re-add `-webkit-` on its own. Hand-writing the prefix last is what broke this.
- [x] Scrim tint raised `rgba(30,27,75,.72) → .92` in the same pass. `.72` was tuned while the blur was
      silently broken, so it was compensating for the wrong thing; with the blur working, `.92` keeps
      the columns unambiguously readable over a product grid while the blur still shows a hint of the
      page underneath. `.72–.82` is now a legitimate choice again if more glass is wanted — the blur is
      doing its share of the work.

## SDK contract used
- None. CSS only.

## Tracking (required)
- No change.

## UI constraints
- No new token: the tint is an `rgba()` of the existing `--indigo-900` hex, the same idiom the rule
  already used (`docs/design-system.md`).

## MUST NOT change
- **Keep the standard property last in every `backdrop-filter` pair** in this stylesheet, and check the
  built CSS — not the source — before believing a prefixed property shipped. The same collapse applies
  to any other prefixed/standard pair added later.
- The scrim keeps owning the blur and tint alone; the panel stays background-less
  (`specs/feature-acp-visual-redesign.md`). Giving the panel its own surface would hide this class of
  bug rather than fix it.
- `.header-search-band`'s `transition` still lists `backdrop-filter`; the band no longer declares one.
  Harmless, and left alone deliberately — see the band section of `specs/feature-acp-visual-redesign.md`
  before "tidying" either half.
