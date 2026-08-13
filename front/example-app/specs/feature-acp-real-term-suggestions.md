# Feature: ACP popular search terms come from the engine

## Status: implemented
## Page/Component: src/components/SearchBar.tsx, src/components/SearchOverlay.tsx, src/hooks/useSearch.ts, src/hooks/useCms.ts, src/locales/{en,fr,de}/search.json

## Context
The overlay's first column ("🔍 Popular search terms", `specs/feature-acp-visual-redesign.md`) used to be
a **demo fake**: `getSuggestionMatches()` substring-filtered a hardcoded 10-term array held in
`search:overlay.suggestions` in each locale file. It looked plausible in English on the seeded catalog
and nowhere else — the terms were invented by the front, so they never reflected what anyone had
actually searched, never followed the catalog, and had to be re-invented per language.

Gally already returns the real thing: every search response carries `termSuggestions`, the engine's own
popular terms for the query, per entity type. The SDK exposes it as `Response.getTermSuggestions()`.
This change wires the column to it and deletes the fake.

## Behaviour (testable)

### The column renders engine terms
- [x] `useAutocomplete()` (products) and `useCmsAutocomplete()` (blog) each keep their own
      `termSuggestions` state, set from `response.getTermSuggestions()` on every settled request.
- [x] Each entry is `{ term, resultCount, popularity }` (`ITermSuggestion` in the SDK — verified against
      the live API, both entity types). Only `term` is rendered; `resultCount`/`popularity` are carried
      but unused, so a later "N results" hint needs no plumbing.
- [x] `getSuggestionMatches()` and the `overlay.suggestions` arrays in all three locale files are gone.
      `overlay.suggestionsTitle` / `overlay.noSuggestions` stay — the column keeps its title and its
      empty note, which now means "the engine has no popular term for this query".

### Products and blog terms merge into one deduped list
- [x] `getTermSuggestions(productTerms, cmsPageTerms)` in `SearchOverlay.tsx` concatenates the two
      lists, maps to `.term`, drops falsy values and dedupes through a `Set`. Products lead: they match
      the search bar's primary intent.
- [x] Dedupe is not cosmetic — a term like "dress" comes back from *both* entity types on the seeded
      catalog, and would otherwise render twice in a row.
- [x] **Bugfix — the trailing blank row.** The first cut of the merge spread the product list but not the
      cms one (`[...products.map(t => t.term), cms.map(t => t.term)]`), so the whole cms array landed as
      a *single element*. React renders an array child by concatenating it, which produced one row reading
      `dress fabric typeshow to style a dressdress care guide`; and when the blog returned no terms, `[]`
      is truthy so `.filter(t => t)` kept it and the row rendered **empty**. Both symptoms were the one
      missing spread. Verified: `dress` now yields 13 distinct rows (10 product + 3 blog), no orphan.

### Keyboard navigation follows the rendered terms
- [x] **Bugfix.** `SearchBar`'s `flatItems` (the flattened cross-column arrow-key sequence) still called
      `getSuggestionMatches(query)` while the column rendered engine terms. The two lists no longer had
      any term in common, so every `suggestion-*` key in the sequence pointed at a row that did not
      exist: the first N arrow presses highlighted nothing at all, and the real terms were unreachable
      by keyboard.
- [x] Fixed by making the merged list the single source: `SearchBar` computes it once
      (`useMemo` over both hooks' `termSuggestions`), builds `flatItems` from it, and passes it down as
      the overlay's `termSuggestions` prop. The overlay no longer derives anything — same list, same
      order, same `suggestion-${term}` keys, by construction rather than by coincidence.
- [x] Verified in a real browser (Playwright, `com_en`, query `dress`): ArrowDown 1/2/3 highlight
      `suggestion-dress`, `suggestion-hot weather dress`, `suggestion-summer dress` in order, and Enter
      navigates to `/example/com_en/search?q=summer%20dress` — locale segment intact.

### Suggestions never outlive their query
- [x] `useAutocomplete().search()` resets `termSuggestions` on its short-query early return (`< 2` chars),
      which previously only reset `results`/`aggregations` — deleting back to one letter left the
      previous query's terms on screen.
- [x] `useCmsAutocomplete()` does the same, and its `clear()` now clears `termSuggestions` as well as
      `pages`; `SearchBar.clearAll()` calls both hooks' `clear()`, so picking a result no longer leaves
      blog terms behind in the merged column.

## SDK contract used
- Unchanged requests. `termSuggestions { entityType terms }` is part of the query the SDK builds for
  *every* search (`Request.ts`), so this feature costs no extra round trip and needs no new
  `selectedFields`: products via `product_autocomplete` (`isAutocomplete: true`), blog via the
  `documents` endpoint for `cms_page`.
- `Response.getTermSuggestions()` returns `endpointData.termSuggestions.terms ?? []`. Note it reads
  `.terms` without a guard on `termSuggestions` itself, so an endpoint that ever omits the field would
  throw inside the SDK — both entity types return it today.

## Tracking (required)
- No change. Selecting a term still routes through `closeAndGo()` → `/search?q=…`, so the search page
  fires its own `SEARCH` event exactly as before.

## UI constraints
- No CSS in this change — the rows reuse `.autocomplete-item.autocomplete-suggestion` untouched.
- Known trade-off: the engine returns up to 10 product + 3 blog terms, so the left column is now
  taller than it was with the hardcoded `.slice(0, 3)` and pushes the autocomplete attribute sections
  (COLOR, MATERIAL…) below the fold of `.search-overlay-col`, which scrolls. Left as-is deliberately:
  the cap belongs to the backend (`gally.autocomplete_settings`), not to a `slice()` in the front.

## MUST NOT change
- The merged list must stay computed in **one** place and flow down as a prop. Deriving it a second
  time inside `SearchOverlay` is exactly what broke arrow navigation.
- Keep the spread on *both* lists in `getTermSuggestions`, and keep `.filter(Boolean)` on `.term` —
  not on the entry, since an array/object is always truthy.
- Products before blog terms, and the `Set` dedupe.
- `getCategoryMatches` stays a client-side substring match over the category tree — it is not an
  engine-provided list and this change says nothing about it.
