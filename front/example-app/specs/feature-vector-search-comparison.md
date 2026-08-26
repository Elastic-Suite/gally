# Feature: vector-search comparison screen

## Status: implemented (2026-08-17)
## Page/Component: `src/views/VectorSearchPage.tsx`, route `app/[locale]/vector-search/page.tsx`, fetcher `src/sdk/vectorSearch.ts`

Restores the keyword-vs-vector comparison that `missing-features.md` §2 recorded as
**"Original vector-vs-fulltext comparison — fully missing"**. The old CRA app had it at
`src/pages/VectorSearch/VectorSearch.tsx`; the Next migration dropped it and the name
`VectorSearchPage.tsx` was left on the *explain* view, which is a different feature.

## Naming, fixed as part of this change

`src/views/VectorSearchPage.tsx` used to be the relevance-**explain** visualiser mounted at
`/explain`. It is now `src/views/ExplainPage.tsx`, matching its route, and
`VectorSearchPage.tsx` is this comparison, matching *its* route. `app/[locale]/explain/page.tsx`
imports the renamed file; nothing else referenced it. Two features had one name between them and
`docs/architecture.md` described the explain page as "keyword vs vector search comparison" — a
sentence that was true of neither file.

## What the environment actually provides

Verified live against this stack, not assumed:

- `GallyVectorSearchBundle` is enabled (`api/config/bundles.php`).
- `huggingface/sentence-transformers/all-MiniLM-L6-v2` is `DEPLOYED` in OpenSearch ml-commons,
  384 dims, hnsw/nmslib/l2.
- Every product carries an `embedding` (85/85 in `com_*`, 183/183 in `fr_*`) via the
  `gally-llm-pipeline-product` ingest pipeline; `index.knn` is `true`.
- Only the product **name** is vectorised — `vector_configurations.yaml` marks `name`
  vectorisable with prompt `"The product name is %s"`. Descriptions are not embedded.
- The GraphQL query is **public**: no token, unlike `explain`.
- `is_used_on_no_result`, `is_used_for_exact_match` and `is_used_for_spellcheck` all default to
  `false`, which is why `products(requestType: product_search)` genuinely returns 0 for these
  queries rather than silently falling back to vectors. The comparison depends on that.

## Behaviour (testable)

- [x] `/[locale]/vector-search` renders two equal panels, keyword left, vector right, under a
      **centred, full-bleed** header block (breadcrumb, title, intro, search form, suggestion chips,
      warning). Everything above the panels applies to both, so centring stops it reading as the
      left panel's. No child of `.vector-head` carries a `max-width`: measured, all of them span the
      same 1336px as `.vector-compare` below, so the header reads as the heading OF the comparison
      rather than a narrower column floating over it.
- [x] A result is **one line**: rank · 34px thumbnail · product name · score. No cards, no prices,
      no badges, no add-to-cart. `PAGE_SIZE = 25` a side, **paginated**.
- [x] Both panels render the same `<ResultRow>` from the same `COMPARE_ROW_FIELDS`.
- [x] Each panel labels its own score column — "BM25 score" vs "Similarity" — and formats it on its
      own scale (`formatScore`: ≥10 → no decimals, else 2). The two are never compared across the gutter.
- [x] Rows link to the PDP; the name truncates on one line so rows stay uniform height and the two
      lists scan against each other.
- [x] `jewellery` → keyword **0 results** (no pager at all), vector 4 pages over 85 rows, led by
      Augusta Necklace 0.54 / Gold Sol Earrings 0.53 / Gold Cirque Earrings 0.53.
- [x] The control query `cardigan` → keyword **7 results** (BM25 64, 64, 64, 64, 64, 56, 56), vector
      returns the same seven cardigans first (0.56 → 0.53), then degrades through sweaters
      (Corina Lace-Back 0.43, Echo 0.42, Juno 0.42) into unrelated garments, tailing off at ~0.38.
      This is the most instructive query on the page: it shows both that the engines agree on a
      literal product noun, and exactly where vector relevance stops being useful.
- [x] Suggestion chips set the query; the active chip is highlighted.
- [x] The vector badge describes the whole **ranked set**, not the current page — paging moves a
      window over one ranking, it does not run a new one. "All 85 products, ranked by similarity"
      while the corpus is within the kNN ceiling; "Top 100 of {corpus}" once a catalogue outgrows
      it. Never a result count either way.
- [x] Each pager sits **above** its list, between the panel header and the column legend —
      measured DOM order `vector-panel-head → pagination → vector-list-legend → vector-list`.
      A page is 25 rows, so a pager at the foot is a screenful away in whichever column you are
      not reading. `.vector-panel .pagination` flips the shared idiom's `margin-top: 2rem` to a
      bottom margin; the override is scoped so SearchPage's own pagers are untouched.
- [x] **Both lists paginate independently, and only when needed.** Measured:
      - `jewellery`: keyword 0 results → **no pager**; vector 4 pages (85 rows).
      - `a`: keyword 58 results → 3 pages; page 3 shows ranks **51–58** (8-row remainder),
        BM25 descending 1.42 → 0.94. Vector 4 pages.
      - `cardigan`: keyword 7 results → **no pager**.
      - Paging the keyword panel to page 3 leaves the vector panel on page 1 — two effects, not
        one `Promise.all`, so one panel never refetches because the other moved.
      - A new query resets **both** pages to 1 (verified from kw 3 / vec 3 → 1 / 1).
      - Ranks are offset by page and continue across pages; scores stay monotonically descending.
- [x] Tail scores 0.38–0.39 on the vector list's last page (visibly noise, the honest
      illustration of why a production setup applies a minimum score).
- [x] The closing note is a **full-width callout** (`.vector-footnote`, 1336px — same as the panels),
      titled "Reading this comparison", indigo tint + left accent rule, 0.95rem body. It was a grey
      0.8rem line under a hairline rule, which at this page length nobody would read.
- [x] Because that callout sits ~4587px down, its core claim is ALSO carried by the vector panel's
      subtitle, visible without scrolling: "It ranks the whole catalogue — it never filters, and
      never comes back empty."
- [x] **No header search band on this route.** `Header.tsx` omits `.header-search-band` when
      `pathname === '/vector-search'`, reclaiming ~150px (panels now start at 371px, not ~520px).
      Verified still PRESENT on `/`, `/search`, `/blog`, `/explain`, `/cart`.
- [x] **Nav item** "✨ Semantic search" in `.header-nav`, visible on every route, `active` on this
      one. Plain link beside `/explain`, not a third tab in `.header-nav-switch`.
- [x] It is the **same height as the Products/Articles switch** — measured 44.1px for both, with
      matching top and bottom, so they sit on one line with no visual step.
- [x] It is also the **same colour, weight and track**: idle it computes
      `rgba(255,255,255,0.85)` / weight 600 / `rgba(255,255,255,0.12)`, matching `.header-nav-tab`
      on the switch's well; selected it computes `rgb(40,53,147)` on solid white with
      `--shadow-sm`, byte-identical to the switch's sliding thumb.
- [x] The non-English warning shows on `com_fr` and is absent on `com_en`.
- [x] `npx tsc --noEmit` clean in the `example` container; no `⨯` lines in `make logs s=example`.
- [x] Route returns HTTP 200 with `<title>Semantic search · Gally</title>` and `NOINDEX`.

## SDK contract used

**Keyword panel** — the SDK, exactly as `SearchPage` calls it: `metadata: 'product'`,
`sortField: '_score'`, `sortDirection: 'desc'`, `isAutocomplete: false`, `filters: []`. The
**ranking inputs must stay identical** or the left panel stops being the search this storefront
actually ships, and the comparison stops meaning anything.

`selectedFields` is the one intentional divergence from `SearchPage`: `COMPARE_ROW_FIELDS`
(`sku name image url_key score`) instead of `PRODUCT_FIELDS`. That is a **projection** change — it
alters what each hit carries, never which hits come back or in what order — and it is what makes 100
rows a side affordable. This page does not seed `initialData` from `src/sdk/server.ts`, so the
usual "server and hook must request the same shape" rule does not apply here.

**Vector panel** — *not* the SDK. `SearchManager` only knows `products` / `documents`; the premium
bundle's `vectorSearchProducts` is unreachable through it. `src/sdk/vectorSearch.ts` posts raw
GraphQL to `/api/graphql`, the same pattern as `fetchCategoryTree()` in `src/sdk/catalogs.ts`.

`vectorSearchProducts` was chosen over the older `vectorSearchDocuments(entityType: "product")`
because its collection is a `VectorProduct`, which carries the **same fields as `Product`** —
measured: the whole of `PRODUCT_FIELDS` resolves on it, and so does `COMPARE_ROW_FIELDS`. That is
what removes the mapping layer the old app needed
(`transformVectorSearchDocumentsIntoProducts`) and what lets both panels share one row component
and one field list.

`requestType: product_search` is required by the schema even though it changes nothing for the
vector provider.

### The trap, if anyone widens the selection

`PRODUCT_FIELDS` does **not** contain `price { price }` or `stock { status }` — the SDK appends both
to every query it builds, so the list was written assuming that favour. A hand-built query does not
get it. This page no longer shows prices so it no longer asks, but an earlier revision rendered
cards and every one showed **€0.00** beside a struck-through original price, which reads as bad
catalogue data rather than a missing selection. Anyone reintroducing price here must spell both out
in `fetchVectorSearchProducts`; GraphQL merges duplicate selections, so asking twice is safe.

## Tracking (required)

`TrackingEventType.SEARCH` fires once per (catalog, query) with the **keyword** panel's real total,
plus `DISPLAY` for its rows when non-empty — same shape as `SearchPage`, guarded by a `trackedRef`.

The vector panel is deliberately **not** tracked as a second SEARCH. It is one query the visitor
made, not two, and double-counting would inflate the zero-result report this page exists to point
at. A zero-result query here *should* land in search analytics as zero-result: that is the same
signal a merchandiser would use to find the gap being demonstrated.

## UI constraints

Tokens and existing components only. New CSS at the end of `src/styles.css` under
`/* ─── Semantic search comparison ─── */`, built from `--indigo-*`, `--coral-500`, `--gray-*`,
`--radius-*`, `--shadow-sm`, `--warning`. No new hex, no new px font sizes (the 34px thumbnail box
is a layout dimension, like the existing `.rank-score-bar` width).

`.vector-row` is a new primitive, and it is one this app genuinely lacked: every existing list idiom
is a **card** (`.product-card`, blog cards reuse it) and none of them is a dense scannable row. It
does not modify or wrap `ProductCard`, so nothing else is affected.

**No score bar.** An earlier revision had one and it actively misled: scores within a panel sit
within a few percent of each other (0.42–0.54 for cosine; BM25 ties outright at 64 across whole
blocks), so every bar drew at near-full width — a decoration that looked like data. It also took the
widest column and squeezed the product name, which is the thing being compared between the lists.

The panels are deliberately **symmetric** — same width, same row, same score treatment. The only
per-panel differences are 3px of border-top colour and the score column's label. The original
implementation put a product grid next to a three-column SKU table, and the table lost on looks
before anyone read a score.

Stacks to one column below 900px, keyword first (the "before" of the story).

## Header changes (touch other routes — read before editing `Header.tsx`)

**The search band is route-scoped, not CSS-hidden.** `/vector-search` supplies its own full-width
search box, so the header's bar was a second input doing something different (it navigates to
`/search` and abandons the comparison) and cost ~90px on the app's longest page. Conditional render
means SearchBar and its overlay are not mounted at all. Two things that would otherwise break, both
checked:

- `--header-height` / `--header-nav-height` are **measured** by Header's ResizeObserver, not
  constants, so they re-publish the shorter height with nothing to keep in sync.
- `SearchBarProvider` is in `app/providers.tsx`, so `useSearchBarRef()` still resolves — only
  `ref.current` is null. Its one consumer outside SearchBar is `useStoryActions`'
  `type_and_search`, which already guards with `if (!handle) return` and navigates to its own
  `startRoute` first, so the guided story is unaffected.

**The plain links are styled to be indistinguishable from switch segments.** They previously
differed on three axes at once — colour `rgba(255,255,255,0.8)` against the tabs' `0.85`, weight 500
against 600, and no background at all against the switch's `rgba(255,255,255,0.12)` well — which
read as the Semantic search item being greyed out or disabled beside Products/Articles. All three
now match, and `.active` copies the switch's thumb (solid `--white`, `--indigo-800` text,
`--shadow-sm`) because that is already what "selected" looks like in this bar. **If the switch's
palette changes, mirror it here** — nothing enforces the pairing.

**Height parity is derived, not eyeballed.** `.header-nav > a` uses `padding: 0.7rem 0.9rem`
because the switch's outer box is its own `0.25rem` track padding plus its tabs' `0.45rem`, and
0.25 + 0.45 = 0.7; a plain link has no track, so it carries both. They also became `inline-flex`
with `align-items: center`, which gives them `.header-nav-tab`'s content-box height — otherwise the
0.95rem emoji (line-height 1) makes the inline line box taller than the 0.85rem label and the link
outgrows the switch. `gap: 0.4rem` spaces icon from label, so the markup must NOT also contain
whitespace between them or the gap doubles. This applies to `/explain` too; all three nav elements
measure 44.1px.

**The nav item is NOT `expert-only`.** That class is `display: none` under the default `direction`
audience mode (`.mode-direction .expert-only`), which is why the link was invisible when this
feature first shipped. `/explain` beside it stays expert-only; this one does not, because the
comparison is what the demo is for. It is also deliberately outside `.header-nav-switch` — that is
a two-way Products/Articles control with a sliding thumb sized `1fr 1fr`, and this is not a third
storefront section.

## MUST NOT change

- **The vector panel must never report a result count.** `paginationInfo.totalCount` is the size of
  the embedded corpus, identical for a brilliant query and a nonsense one — kNN ranks, it does not
  filter. Rendering "85 results" beside the keyword panel's honest "0" is the single lie that would
  discredit the whole screen. The string is `vector.count` = "Top {{count}} of {{corpus}} products,
  by similarity"; the footnote explains the asymmetry. Keep both.
- **Keep `cardigan` in `VECTOR_DEMO_QUERIES`.** It is the control, not a fifth example: keyword
  returns 7 and both panels agree. Without it the page is four rigged queries and an audience is
  right to distrust it. It makes the claim the true one — semantic search does not beat keyword
  search everywhere, it covers what keyword search cannot answer at all.
- **Keep the non-English warning.** all-MiniLM-L6-v2 is monolingual English and the product names
  are English in *every* catalogue including `com_fr`, so a French query ranks confidently and
  meaninglessly (`bijoux` puts a skirt first at 0.41). Removing the warning turns a known
  limitation into an apparent bug in the product.
- **Keep the keyword panel on the SDK path with `product_search` and `_score` desc.** Tuning its
  ranking to look better or worse than it really is falsifies the comparison. `selectedFields` is
  free to change; everything that feeds the ranking is not.
- **Keep both panels on ONE field list and ONE row component.** The moment the two sides render
  differently, the page compares presentation instead of relevance.
- **Keep the vector pager clamped to `VECTOR_MAX_RESULTS`.** It mirrors
  `gally_vector_search.search_config.k_value` (default 100, in
  `gally-premium/VectorSearch/src/Resources/config/gally_vector_search.yaml`) and the clamp is not
  cosmetic: `paginationInfo.lastPage` is computed from `totalCount` and **ignores k**, so on a
  1200-product catalogue the API advertises 48 pages at 25 a page while only the first 100 rows
  exist. Without the clamp the pager offers pages that come back empty. If `k_value` is raised
  server-side, raise the constant to match.
- **Keep query and both page numbers in ONE state object.** Held as three `useState`s they drift:
  the fetch effects see a new query with an old page for one render and briefly show page 4 of a
  result set that now has one page.
- **Keep the two fetch effects separate.** Merging them back into a `Promise.all` makes paging one
  panel refetch and flash the other.
- **Keep the per-panel score labels.** BM25 ~64 next to cosine ~0.56 with no labels invites the one
  reading the page must not produce: that the right-hand engine scores worse.
- **Keep the ranks-not-filters claim in BOTH places** — the vector panel subtitle and the closing
  callout. The callout is the full argument but is thousands of pixels down the page; the subtitle
  is what a visitor who never scrolls actually reads. Deleting either as "duplication" removes the
  only guard against the page's central misreading.
- **Keep `.vector-footnote` styled as a callout, not as small print.** It is the interpretive key to
  the page, not a caveat to bury.
- **Keep the header search-band suppression scoped to this one pathname.** Widening it, or
  switching it to a CSS `display:none`, breaks the reclaimed space or re-mounts a second search
  input the page does not want.
- Keep the SEARCH/DISPLAY tracking on the keyword panel, and keep it off the vector panel.
- `src/views/ExplainPage.tsx` must keep its name aligned with `/explain`. Do not re-introduce
  `VectorSearchPage` as a name for the explain view.

## Not done, deliberately

- **No SDK support.** The right long-term home for this is `SearchManager.vectorSearch()` in
  `front/gally-admin/packages/sdk` — a separate git repo needing its own branch, tests and a
  rebuilt SDK. The local fetcher ships the feature without that; the query shape here is the
  spec for that method when someone writes it.
- **No zero-result fallback on `/search`.** Gally can do this server-side
  (`RunVectorSearchIfNoResult`, currently `is_used_on_no_result: false`) and it would be the
  realistic storefront behaviour — but turning it on removes the "0 results" this page's left
  panel needs. If both are wanted, the config is per-localized-catalog and the demo could run on a
  catalogue with it off.
- **No max-height / independent scrolling on the panels.** With 85 vector rows against 0–7 keyword
  rows the left column was mostly empty on a ~4900px page. Pagination has largely dissolved this —
  25 rows a side keeps the page short and brought the closing callout back within reach — so
  capping panel height was not needed. Worth revisiting only if the panels diverge badly again.
