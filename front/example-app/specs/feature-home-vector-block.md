# Feature: homepage vector search block - example requests as cards

## Status: implemented

## Page/Component: src/views/Homepage.tsx, src/views/VectorSearchPage.tsx

The last block of the homepage was a centred title, a line about "browsing categories, testing
facets and seeing vector search in action", and a button. It said nothing about what vector search
is for. It now explains the use: describe what you want in your own words, not the right keyword.
It shows this shop's measured example requests as cards, and each card opens the comparison page
with that request already run.

Design picked from the mockup study `mockups/home-vector-block`, variant C.

## Behaviour (testable)

- [x] The block shows an eyebrow ("Recherche vectorielle" with the sparkles icon), a title and a
      body about describing a need in your own words, in fr, en and de.
- [x] Below the text, one card per example request: this localized catalog's
      `getVectorDemoQueries()` list **without its last entry** (the control), at most 3. Each card
      shows the request in quotes and a "see the results" line.
- [x] A localized catalog with no list (or only a control) shows no cards: text and button only.
- [x] A card links to `/vector-search?q=<request>`. The page opens with that request in the box,
      and both panels show its results.
- [ ] The button links to `/vector-search` with no query, which starts on the first suggestion as
      before.
- [ ] `/vector-search?q=...` with any text, not only a listed one, runs that text.
- [x] At 390px the cards stack in one column and nothing overflows sideways.

Verified 2026-10-06 with `mockups/home-vector-implemented` (screenshots of com_fr, fashion_fr,
toolbox_de, papershop_en, fr_fr, a card click on fashion_fr, com_fr at 390px). Not verified: the
button was not clicked (its href has no query, read in the code only); `?q=` with a text outside
the lists was not tried; the search tracking event for a `?q=` seed was not inspected.

## SDK contract used

- No new request. `getVectorDemoQueries()` is read on the homepage; the vector page keeps its
  existing keyword and vector calls.

## Tracking (required)

- No change. The vector page tracks the seeded `?q=` search exactly as it tracks its default
  seed. The homepage block fires nothing: it is links.

## UI constraints

- Tokens only. The cards reuse the `.product-card` look (white, `--radius-md`, `--shadow-sm`, hover
  lift) as `docs/design-system.md` asks for any card. The button is `.btn-dark`, like the sample
  shops' hero.
- The block has its own surface, `--indigo-50` fading to white, lighter than the hero and panel
  surface so it reads as the page's closing note rather than a fourth panel. Its edge is the panels' edge: `--gray-300` border and
  `--shadow-md`, so it sits in the same set of blocks.
- The trailing arrow on the card link is text in the translation, as for other trailing arrows.

## MUST NOT change

- **The cards show the measured list, never sentences written for the homepage.** The French and
  German lists were measured against the index, and long intent sentences mostly return poor
  results (`src/sdk/vectorSearch.ts`). A card whose request fails on click discredits the claim
  the block makes. A new request is added to `VECTOR_DEMO_QUERIES` and measured there first
  (`feature-vector-demo-queries-per-catalog.md`).
- **The control stays off the cards.** It is a request keyword search handles well, which is
  the point on the comparison page and the wrong example under "not the right keyword".
- **No fallback to another catalog's list.** Same rule as the vector page: none is better than a
  wrong one.
- **`?q=` only sets the starting query.** The reseed on catalog change stays keyed on
  `catalogCode` alone, so switching shop still replaces the query with the new shop's first
  suggestion.
