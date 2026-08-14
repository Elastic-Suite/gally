# Bugfix: autocomplete attribute values were set larger than the attribute name

## Status: implemented
## Page/Component: src/styles.css (`.autocomplete-attribute-text`, split from `.autocomplete-category-text`)

## Problem

In the autocomplete popup, each attribute **value** was typeset larger and heavier than the
attribute **name** it sits under — the hierarchy inverted:

| Element | Rule | Was |
|---|---|---|
| Attribute name ("Couleur") | `.autocomplete-section-title` | 0.85rem, 700, uppercase |
| Attribute value ("Pluie") | `.autocomplete-attribute-text` | **1.05rem, 600** |

A value is a filter link — clicking it navigates to `/search?q=…&f_<field>=<value>`
(`attributeFilterUrl`) — not a heading, so it should read as subordinate to its own label.

Density made it worse rather than being incidental to it: `MAX_ACP_OPTIONS = 5` across the four
source fields flagged `isUsedInAutocomplete` (`fashion_color`, `fashion_size`, `fashion_material`,
`fashion_style` — all four return aggregations for `robe`, verified live) puts **up to 20 such rows**
in one column, stacked under the popular terms that `feature-acp-real-term-suggestions.md:80` already
notes are pushing those sections down.

The root cause of it going unnoticed: `.autocomplete-attribute-text` shared its declaration with
`.autocomplete-category-text`, so the two row types could not be sized independently and whoever set
1.05rem was sizing category rows, which do want prominence.

## Behaviour (testable)

- [x] `.autocomplete-attribute-text` is now **0.9rem / weight 500** — a size already used in the file
      (`.autocomplete-blog-title`), so no new value enters the type scale.
- [x] The shared declaration is split. `.autocomplete-category-text` keeps **1.05rem / 600**:
      one or two navigation rows in the third column, not a dense filter list.
- [x] Confirmed in the **served** CSS bundle, not just the source — `.autocomplete-attribute-text
      { font-size: .9rem; font-weight: 500 }` and `.autocomplete-category-text { font-size: 1.05rem;
      font-weight: 600 }` both present in `_next/static/chunks/example-app_src_styles_*.css`.
- [x] Nothing else in the popup moved: popular terms stay 1.05rem/600 (the headline feature of that
      column), the section title stays 0.85rem/700 uppercase, `.autocomplete-attribute-count` stays
      0.85rem, blog rows stay 0.9rem/0.75rem.
- [ ] Not visually confirmed in a browser — no browser tooling was available in this session. The
      evidence is the served CSS, so the numbers are certain but the *look* is unreviewed.

## SDK contract used

None — pure CSS. The attribute sections still come from the autocomplete request's aggregations via
`getAutocompleteAttributes`, filtered to `isUsedInAutocomplete` source fields by the backend.

## Tracking (required)

None — no interaction changed. Clicking a value still navigates through `attributeFilterUrl`, so the
search page fires its own tracking as before.

## UI constraints

- No new token and no new value in the scale; both numbers already existed in `src/styles.css`.
- No colour change: the value keeps `rgba(255, 255, 255, 0.95)` on the popup's dark scrim.
- No markup change, so keyboard navigation order and `data-item-key` handling are untouched.

## MUST NOT change

- **Do not re-merge `.autocomplete-attribute-text` with `.autocomplete-category-text`.** They were
  one rule, which is exactly why the attribute rows could not be toned down without shrinking the
  category rows. They are different things in different columns.
- **The attribute value must stay visually subordinate to `.autocomplete-section-title`.** If the
  section title is ever restyled, re-check this pair — the bug was the inversion, not the number.
- Popular-terms rows stay the largest text in that column; they are the feature the column exists for.
