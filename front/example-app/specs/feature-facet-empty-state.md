# Feature: Message when the facet sidebar has nothing to show

## Status: implemented
## Page/Component: src/components/Facets.tsx, src/styles.css, src/pages/SearchPage.tsx, src/pages/CategoryPage.tsx, src/locales/{en,fr,de}/facets.json

## Problem
`Facets` drops every aggregation with 0 or 1 option as non-discriminant
(`feature-facet-hide-single-value.md`). When that leaves nothing — or when the API
returns no aggregations at all — the sidebar still rendered its "Filters" heading and
then nothing: an empty white card ~85px tall. It reads as a component that failed to
load, not as an answer.

Confirmed against the live API: **a zero-result query returns zero aggregations.** So
the empty sidebar is the normal, guaranteed outcome of any search that matches nothing,
not an edge case.

## Behaviour (testable)
A `.facets-empty` note now replaces the empty list. Three messages, because the causes
are genuinely different and only one is actionable:

- [x] **Nothing matched, no filters active** (`empty.noResults`) — "No filters to show —
      nothing matched this search." Verified at `?q=zzzznothing`: 0 results, 0 facet
      groups, 0 chips, message shown.
- [x] **Filters removed everything** (`empty.filteredOut`) — "No filters left. Remove one
      above to bring results back." Points at the chips, which are the only way out.
      Verified at `?q=dress` + three filters: 0 results, 0 facet groups, **4 chips**
      (3 filters + "Clear all"), message shown.
- [x] **Results too uniform to filter** (`empty.notDiscriminant`, pluralised) — "Only one
      result, so there is nothing left to filter." / "All {{count}} results share the
      same characteristics…".
- [x] **Control:** a normal search is unaffected — `?q=dress` still renders 5 facet
      groups and no message.

## Honest gap
The `notDiscriminant` branch **could not be reproduced against the current catalog**. A
single-product result still yields 3–4 multi-option facets, because a product carries
several sizes and colours, so some facet always stays discriminant. The branch is
defensive: the keys exist and are wired, but it has not been seen rendered. If it ever
matters, it needs fixture data with a product that is single-valued on every attribute.

## Props
- `Facets` gains **`resultCount: number`**, deliberately **required, not optional**: it
  selects the message, and a default would make the sidebar assert something false about
  the result set. TypeScript therefore forces every call site to supply it.
- Both call sites updated — `SearchPage.tsx` and `CategoryPage.tsx`, each passing their
  existing `total`. Those are the only two (`grep -c '<Facets'` → 2).

## Known wart, not fixed here
When the API returns no aggregations, `ActiveFilterChips` can no longer resolve labels,
so chips degrade to raw field names and raw option ids — `fashion_color__value : 5`
instead of `Color: Black`. Chips are built from `activeFilters` and only *labelled* from
the aggregations, so the escape hatch still works, but it looks broken. Out of scope for
this change. A fix would cache the last non-empty aggregations in a ref and label from
that; field labels and option labels are stable across queries in a given catalog, so
staleness risk is low — but it is a separate behaviour change and deserves its own spec.

## SDK contract used
- None added. Relies on the observed API behaviour that a zero-result query returns an
  empty `aggregations` array — worth knowing, and now recorded here.

## Tracking (required)
- No change. The sidebar fires no events.

## UI constraints
- No new primitive: `.facets-empty` reuses the muted italic note idiom of
  `.autocomplete-empty`, in the light sidebar's palette (`--gray-500`) rather than the
  dark panel's white.
- No new token, no new hex.

## Incidental
`Facets.tsx` had a dead `const isMulti` (unused since before this change; present in
`HEAD`). CRA's eslint only re-lints changed files, so editing the file surfaced the
latent warning. Removed, so the build is warning-free again.

## MUST NOT change
- **The chips must keep rendering in the empty state.** They are built from
  `activeFilters`, not from the aggregations, which is the only reason a user who
  filtered down to zero can get back. Rendering the message *instead of* the chips would
  strand them.
- `resultCount` staying required — see Props.
- The non-discriminant filter itself. This change explains that rule's consequence; it
  does not soften it.
