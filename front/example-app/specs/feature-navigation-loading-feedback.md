# Feature: navigation feedback for server-rendered routes

## Status: implemented
## Page/Component: `app/[locale]/{product,blog,category}/**/loading.tsx`, `src/components/skeletons.tsx`

## Problem

Phase 3 moved product / blog / category data fetching to the server, and navigation stopped feeling
responsive: clicking a product left the user on the **old page with no feedback at all** for the
duration of the fetch, then swapped the whole page at once.

**Root cause — the wrong belief:** that moving a fetch to the server is invisible to navigation. It
is not. In the App Router a route segment with no Suspense boundary **blocks the transition** until
its server fetch resolves. Before Phase 3 the fetch was client-side, so navigation was instant and
the view rendered its own skeleton while loading; afterwards there was nothing to render, because
the page itself had not arrived yet. Measured server responses at the time: **1.5–3.0 s**.

There were **zero `loading.tsx` files** in the app.

## Fix

`loading.tsx` per server-rendered route — the file's presence is what creates the Suspense boundary,
which is what lets Next transition immediately and stream the page in behind a fallback.

Skeletons live in `src/components/skeletons.tsx` and are shared by two callers that must not drift:
the route's `loading.tsx` (server fetch in flight) and the view's own `if (loading)` branch (client
refetch — sorting, filtering, paging). Same markup either way, so what the user sees never depends
on which path produced it.

No new CSS: only the existing `.skeleton`, `.skeleton-shimmer`, `.skeleton-card` classes.
`styles.css` was not touched.

## Second bug found while verifying: the mount refetch was not actually being skipped

Phase 3's `initialData` handoff used a one-shot `skipMountFetch` ref. That is wrong twice over:

1. **React StrictMode double-invokes effects in dev** (`reactStrictMode: true`). The first pass
   consumed the flag, the second pass refetched — putting a skeleton back over data the server had
   already delivered. This was a direct contributor to the un-smooth feeling.
2. A one-shot flag says nothing about *which* query the seed belongs to.

Replaced with `serverFetchedKey`: a ref holding a serialized key of the options the server-supplied
data corresponds to. The effect skips only while the current options still match that key, and
clears the ref as soon as they do not — so navigating away and back refetches rather than
redisplaying stale seeded results. Idempotent under repeated effect invocation.

## Behaviour (testable)
- [x] `loading.tsx` exists for product, blog post and category; the skeleton is **streamed first**
      in the HTML response, proving the Suspense boundary is in place
- [x] SEO payload unaffected by streaming — title, `<h1>` and all JSON-LD still present in the
      same response on all three routes
- [x] **TTFB improved**, because the shell no longer waits on the data fetch:
      product 2.34 s → 1.21 s, category 3.03 s → 1.56 s
- [x] After hydration there are **zero visible skeleton elements** in the DOM on all three routes,
      and content is fully rendered
- [x] No hydration mismatches; `npx tsc --noEmit` clean
- [ ] **The perceived click→feedback improvement is not machine-verified.** Headless rendering
      cannot exercise a client-side route transition. Click through in a browser to confirm.
- [ ] **The duplicate-request claim is not isolated.** A blog post page issues 12 client-side
      GraphQL POSTs; those were not attributed per component, so "the mount refetch no longer
      fires" is argued from the code, not measured. Check the Network tab.

## Follow-up: skeletons rewritten to hold the real layout (CLS)

The first version gave feedback but did not hold the page's *shape*, so the skeleton itself caused
the layout shift it was meant to prevent. Each skeleton now mirrors the structure and the measured
dimensions of the view it stands in for.

**The big one — the category page had no sidebar.** `.catalog-page` is
`grid-template-columns: 280px 1fr`, but `CategoryPageSkeleton` rendered a bare full-width
`products-grid`. The content grid therefore laid out full-width and then jumped to the right-hand
column the instant real content arrived. It now renders the `.catalog-page` grid with a
`FacetsSkeleton` occupying the 280px column, plus the `CategoryNav` bar (~4rem of height that was
simply missing) and the three-line `.page-title` (breadcrumb / h1 / count).

**Card count matched to the query.** Category pages request `pageSize: 20`; the skeleton drew 6, so
the page grew by ~14 cards on arrival. `ProductGridSkeleton` now defaults to 20.

**The blog article was three lines** standing in for a hero, title, meta row, summary and body.
Now approximates all of them.

**`FacetsSkeleton` is shared with `Facets.tsx`'s own loading branch**, the same
no-two-copies rule as the rest of this file. It takes an optional `title` because the client
component has `useTranslation` and a server `loading.tsx` does not, and an `open` prop so the mobile
drawer state carried over from the branch it replaced is not lost.

**`ProductPageSkeleton` deliberately does not reserve space for the recommendations slider** — that
slider renders only when its separate client-side query returns rows, so reserving space would
*introduce* a shift on every product with no recommendations.

Verified: the streamed fallback now contains `category-nav`, `catalog-page`, `facets-sidebar`,
`products-header`, `facet-group` and 20 skeleton cards; zero visible skeletons remain after
hydration on all three routes; no hydration mismatches; JSON-LD, titles and `<h1>`s unchanged;
`tsc --noEmit` clean.

**Not measured: an actual CLS number.** Headless `--dump-dom` cannot report layout-shift scores, so
the improvement is verified structurally (the fallback and the content now produce the same box
model) rather than numerically. Lighthouse or the Performance panel would give the real figure.

## MUST NOT change
- **Do not delete the `loading.tsx` files.** They look empty — three one-line re-exports — but their
  existence is the Suspense boundary. Removing one silently restores the frozen-navigation bug, and
  nothing in the type system or the build will complain.
- **Keep the route skeleton and the view's loading branch rendering the same component.** They were
  duplicated markup before; that is how the `products-grid` / `product-grid` class mismatch nearly
  shipped a broken-layout skeleton.
- **Do not revert `serverFetchedKey` to a one-shot boolean** — StrictMode defeats it.
- `searchKey()` / `cmsKey()` must cover **every** option the fetch effect keys off. Miss one and a
  changed query is mistaken for the server-fetched one, so the page silently shows the wrong results.
- **`CategoryPageSkeleton` must keep the `.catalog-page` wrapper and a sidebar in it.** Dropping
  either turns the fallback back into a one-column layout and reintroduces the worst shift on the
  site. Same for keeping `ProductGridSkeleton`'s count aligned with the view's `pageSize`.
- The dimension comments at the top of `skeletons.tsx` are copied from `styles.css`. **If a layout
  rule there changes — the 280px sidebar, the 180px card image, the 320px hero — the skeleton must
  change with it**, and nothing will fail if it does not; the only symptom is a page that jumps.
