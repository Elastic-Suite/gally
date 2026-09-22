# Feature: vector demo queries per catalogue

## Status: implemented
## Page/Component
`src/sdk/vectorSearch.ts`, `src/views/VectorSearchPage.tsx`.

## Why

The semantic search page suggests queries under the box. Until now that was one flat array,
written and measured against Venia (`com_en`): `jewellery`, `wedding guest outfit`,
`something to wear to the beach`, `gift for my wife`, `cardigan`.

Three more sample shops have since been added — a DIY shop, an apparel shop and a stationery,
book and furniture shop. The array is a module constant with no catalogue awareness, so **every
shop offered Venia's queries**. On the hardware shop the page invited the visitor to try
"wedding guest outfit", which returns nothing and makes the feature look broken at the exact
moment it is meant to impress.

The queries are also the one part of this page that cannot be derived: they have to be picked
per catalogue and measured, because their whole value is that keyword search returns zero for
them *in that catalogue*.

So the constant becomes a map keyed by localized catalog, and the page reads its own.

## Behaviour (testable)

- [x] Each English shop offers suggestions written for its own catalogue.
- [x] A shop with no entry offers none, and the suggestion row does not render at all rather than
      rendering an empty "Try:" label.
- [x] The box is seeded with the current shop's first suggestion, and **reseeded when the shop
      changes**. Previously a catalogue switch carried the old query across, which after this
      change would mean searching a hardware shop for "jewellery".
- [x] A shop with no suggestions starts with an empty box and runs no query. Both fetch effects
      already guard on `!query.trim()`, so this needs no new guard.
- [x] `npx tsc --noEmit` clean inside the `example` container.

## The queries, and why each one

Every non-control query below returns **0** from keyword search in its own catalogue, measured
against the running instance on 2026-09-14. The vector scores quoted are the top hit.

| Catalogue | Query | Keyword | What vector search returns |
|---|---|---|---|
| `com_en` | the five original Venia queries, unchanged | 0 / 0 / 0 / 0 / 7 | see the comment above them |
| `toolbox_en` | `protect my eyes while drilling` | 0 | safety goggles, face visor, safety glasses (0.43) |
| | `something to cut metal pipes` | 0 | copper tube cutter, plumber's kit (0.46) |
| | `fix a shelf to a brick wall` | 0 | hollow wall anchors, tool board (0.40) |
| | `drill` — **control** | 46 | the same drills keyword search finds (0.50) |
| `fashion_en` | `something to wear to the beach` | 0 | beach poncho, swim shorts (0.47) |
| | `wedding guest outfit` | 0 | evening gown, pleated satin midi dress (0.51) |
| | `gift for my wife` | 0 | slingback shoe, gold pendant (0.44) |
| | `dress` — **control** | 43 | the same dresses keyword search finds (0.50) |
| `papershop_en` | `furnish a home office` | 0 | desk, desk chair, desk lamp (0.41) |
| | `a present for a child` | 0 | three young-readers editions (0.45) |
| | `fountain pen` — **control** | 15 | the same fountain pens keyword search finds (0.70) |

**Every list ends with a control**, matching the rule the original list already documented: a
literal product noun that keyword search answers perfectly well. Without it the page is a row of
rigged queries and an audience is right to distrust the whole demo. The claim this page makes is
not that semantic search wins everywhere, it is that it answers what keyword search cannot answer
at all.

**English keys only.** The model is `all-MiniLM-L6-v2`, monolingual English, and a French or
German query returns confident nonsense. A shop's French and German localized catalogs therefore
get no entry: the page already warns there, and offering suggestions that cannot work would
contradict the warning sitting directly beneath them.

## SDK contract used

No query shape changed. `fetchVectorSearchProducts` and the keyword panel are untouched, so the
two panels still differ in ranking and in nothing else.

## Tracking (required)

Unchanged. `trackSearch` still fires per committed query, from the keyword panel, keyed on
`catalogCode|query`. Reseeding on a catalogue switch produces a new key, so the new shop's first
query is tracked as its own search — which is correct, it is one.

## UI constraints

No new tokens, no new primitives, no styling change. `.vector-suggestions` is now conditional
rather than always rendered.

## MUST NOT change

- **Every catalogue's list must keep a control as its last entry.** It is the entry that makes the
  other three honest. This was already a `MUST NOT` in spirit in the original comment ("Do not drop
  it to make the demo tidier"); it now applies per catalogue.
- **Do not add entries for French or German localized catalogs.** They would be suggestions the
  model cannot answer, sitting above a warning that says so.
- **Do not fall back to Venia's list for an unknown catalogue.** Returning `[]` is the point: a
  wrong suggestion is worse than none, and silently showing clothes in a hardware shop is the bug
  this spec fixes.
- **A new query needs measuring before it is added**, in its own catalogue: keyword count and the
  vector top hit. The value of these queries is a measured fact, not an opinion.
- The seeding effect must stay keyed on `catalogCode` alone. Adding `query` to its dependencies
  makes it fight the user's typing.
