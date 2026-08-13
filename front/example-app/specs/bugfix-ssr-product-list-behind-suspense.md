# Bugfix: the server-rendered product list was invisible without JavaScript

## Status: implemented
## Page/Component: `app/[locale]/{category/[code],product/[sku],blog/[id],search}/**`, `src/contexts/NavigationContext.tsx`, `src/components/{RouteSkeleton,LocaleLink,AppShell,skeletons}.tsx`, `src/views/SearchPage.tsx`, `src/hooks/useSearch.ts`, `src/sdk/server.ts`, `app/providers.tsx`, `src/contexts/CatalogContext.tsx`

## Problem

Two reports, one cause.

**First:** on a category page the product-list skeleton was visible on the *initial* render — a
cold page load, not a navigation — even though Phase 3 fetches that list on the server. Measured
warm on `/com_fr/category/cat_11`: `ttfb=0.470s`, `total=0.612s`, one response carrying 504
`skeleton` substring hits from byte 6k and 120 `product-card` hits from byte 105k, with React's
`$RC` swap script at 117k.

**Second, and the one that matters:** with JavaScript disabled the product list did not render at
all. `<main>` ended at byte 9268 while the product grid sat at byte 22256 — **inside
`<div hidden id="S:0">`**, a container React moves into place with an inline script. No script
execution, no products. A crawler that does not run JS saw a page with a title, a breadcrumb, an
`<h1>`, JSON-LD describing 20 products — and no products.

**Root cause — the wrong belief:** that `loading.tsx` is navigation feedback. It is a Suspense
boundary, and a Suspense boundary changes how the *document* is produced: React flushes the shell
with the fallback in place, streams the real subtree to the end of the response, and swaps the two
with `$RC`/`$RS`. That is exactly what
`specs/feature-navigation-loading-feedback.md` verified as proof the boundary existed — "the
skeleton is **streamed first** in the HTML response". It was proof. It was also a description of
the bug: the visible page was a placeholder, and the real content was script-gated.

`/search` failed differently and worse: it had no server fetch at all, so its initial HTML held 100
skeleton hits and **zero** product cards. Phase 3 gave RSC shells to product, blog and category; the
search results page — the other product list in the app — was never included.

## Fix

**1. The four `loading.tsx` files are deleted.** With no boundary above the page, React cannot defer
that subtree: the server waits for the fetch and emits the finished page inline, in `<main>`, where
a crawler and a JS-less browser both see it. This is the one part of the fix that cannot be
approximated — a gated or empty fallback still produces the hidden-div swap, which was tried first
and rejected.

**2. Navigation feedback moved to the client, in `src/contexts/NavigationContext.tsx`.** Deleting
the boundaries removes what made a click responsive, and that regression was the whole point of
`feature-navigation-loading-feedback.md`, so it is replaced rather than dropped:

- `LinkPendingReporter` calls Next's `useLinkStatus()` and reports into the context. It renders no
  DOM but **must** sit inside a `<Link>`, which is the only place that hook can see a navigation —
  `LocaleLink` puts one in every link in the app.
- `useNavigate()` covers imperative navigation, which no link can report on. The `startTransition`
  around `router.push` is what makes the wait exist as state at all. Used by `SearchBar` (a header
  search waits on `/search`'s server fetch) and by `CatalogContext` (a catalog switch re-resolves
  catalogs, tree *and* page data — the slowest navigation in the app).
- `AppShell` swaps `<main>`'s children for `RouteSkeleton` while a navigation is pending, and marks
  the element `data-navigating` so this is testable from outside.
- `RouteSkeleton` picks the skeleton from the destination href, because there is no per-route file
  to hold it any more. It draws `CategoryNav` above `CategoryPageSkeleton` for category targets:
  that nav lives in `app/[locale]/category/layout.tsx`, inside the children being swapped, so
  without it the shared nav bar would blink out on every category click — the regression
  `feature-persist-shared-ui-across-navigation.md` fixed.
- `SHOW_AFTER_MS = 150` gates it. Fast navigations must show nothing at all; a placeholder that
  appears for two frames reads as a glitch.

### The placeholder must be cleared by the ROUTE, not by the link

The first version cleared the pending state from the reporter's effect cleanup, which looked
obviously right and was obviously wrong: **most links live inside the page area the placeholder
replaces**, so the clicked link unmounts the instant the placeholder appears. The cleanup then
cancelled the navigation state one frame later and AppShell put the *outgoing* page back on screen
until the real navigation committed. Reported as "the category content flashes to the same content,
with a list loading placeholder in between, then Next indicates it is rendering, then the real new
content appears" — the placeholder was being removed far too early, and what came back was the page
being left.

Measured, with the cleanup restored on purpose to confirm the diagnosis:

```
page:Bas (0ms) → PLACEHOLDER (225ms) → page:Bas (308ms) → page:Robes (590ms)
```

A link only knows two things, so it now reports only those: a navigation started, and a navigation
it started settled *while it was still mounted* (an aborted click, typically onto the URL already
open). Deciding a navigation **finished** belongs to the provider, which compares the current
`usePathname()` against the pathname the click started from. That comparison is derived during
render rather than in an effect, so the placeholder and the ready page never both get a frame.

A 10 s `GIVE_UP_MS` backstop covers the one case neither signal reaches: a navigation that never
commits and whose link has already unmounted. Without it the page area could stay a placeholder for
ever.

**3. The category guard warms the listing fetch.** `category/[code]/layout.tsx` awaits
`fetchCategoryProducts` and discards it, so the page component finds a `cache()` hit. Not required
for correctness now that the boundary is gone, but it keeps the guard and the page on one request
and documents that the two must pass identical arguments.

**4. `/search` gets the server fetch it never had** — `fetchSearchProducts` in `src/sdk/server.ts`,
mirroring `SearchPage`'s first-render `useSearch` options exactly (`_score`/`desc`, page 1,
pageSize 20, no filters). `SearchPage` passes it to the hook only while the view still matches
(`isServerFetchedView`, same rule and wording as `CategoryPage`), and the route skips the fetch when
the URL carries `f_<field>` filters, because the view seeds those into state on its first render and
a server result without them would contradict the checked facets.

**5. `useSearch` adopts a seed that arrives later.** Searching again from the header re-navigates
`/search` to itself: the Server Component reruns with fresh `initialData`, but `SearchPage` never
unmounts, so the `useState` initializer cannot pick it up. The effect previously cleared
`serverFetchedKey` and refetched from the browser — a second identical request, behind a skeleton.

## Behaviour (testable)

Verified in a real Chromium via the `e2e` container's Playwright (`javaScriptEnabled: false` for the
crawler case, a `MutationObserver` on `[data-navigating]` for the navigation case).

- [x] **JavaScript disabled**: `/com_fr/category/cat_11` renders **20 visible** product cards,
      **0 hidden**, 0 visible skeletons, `h1="Bas"`. `/com_fr/search?q=robe` renders 17 visible
      cards (previously 0 — no server fetch existed). `/com_en/category/cat_8` renders 20.
      `/com_fr/product/VD10` and `/com_fr/blog/13` render their `h1` and body
- [x] **Zero `skeleton` bytes in the initial HTML** of all four routes, versus 504 (category) and
      100 (search) before
- [x] No `<div hidden>` and no `$RC` in any of the four responses; the grid is inside `<main>`
- [x] Client-side navigation still gives feedback, measured click → skeleton → content:
      category → category **253 ms** visible, category → product **124 ms**, header search submit
      **1591 ms**, catalog switch shown until the page changed
- [x] **The outgoing page never comes back after the placeholder.** Every transition goes
      `old page → PLACEHOLDER → new page`, in that order and once each, on all four navigation
      types. The check is a `MutationObserver` recording each distinct state of `<main>`; it was
      validated by restoring the cleanup that caused the bug and confirming it reports
      `YES — BUG`, so it fails when it should
- [x] The category nav bar stays on screen for the whole of a category → category transition
      (110/110 sampled frames contained `nav.category-nav`)
- [x] 404s unaffected: `/category/cat_9999`, `/product/NOPE`, `/blog/99999`, `/nope_locale`
- [x] `npx tsc --noEmit` clean; no new dev-server or browser-console errors
- [ ] **Not measured: CLS.** Swapping content for a skeleton and back is two layout changes;
      the skeletons are built to hold the page's shape, but no number was taken
- [ ] **Not covered: browser back/forward.** Suspense used to cover it; `useLinkStatus` cannot see
      a popstate navigation, so back/forward has no feedback. Normally served from the router cache
      and therefore instant — if that stops being true, this is where to look

## Still client-rendered, so still invisible without JavaScript
Not in this change's scope, but worth knowing before claiming the app is crawlable:
- the **homepage** product sliders (42 skeleton hits server-side, 0 product cards) — `Homepage.tsx`
  fetches them in the browser;
- the **blog listing** `/blog` (48 skeleton hits, no articles);
- `/search?q=…&f_<field>=…`, the autocomplete's attribute hand-off, for the reason in Fix 4.

Each needs the same treatment the other four routes got: a server fetch handed down as
`initialData`.

## SDK contract used
`fetchSearchProducts` — `metadata: 'product'`, `selectedFields: PRODUCT_FIELDS` (never empty, see
`../docs/sdk-reference.md`), `sortField: '_score'`, `sortDirection: 'desc'`, `currentPage: 1`,
`pageSize: 20`, `filters: []`.

## Tracking (required)
Unchanged, and deliberately so: `SearchPage`'s `trackSearch` / `trackDisplay` / `trackCmsDisplay`
and `CategoryPage`'s `trackCategoryView` / `trackDisplay` key off `products` and `loading`, not off
where the data came from, so a server-seeded first page still emits SEARCH and DISPLAY. The pending
skeleton **replaces** the outgoing page rather than covering it, so the page being left does not keep
firing tracking for a route the user is no longer on.

## UI constraints
No new CSS, no `styles.css` change, no new token, no new visual primitive. `SearchPageSkeleton`
composes the existing `FacetsSkeleton` and `ProductGridSkeleton` inside `.page-title` /
`.result-type-switch-row` / `.catalog-page`. `SearchPage`'s inline 6-card loading grid was replaced
by the shared `ProductGridSkeleton` — it was a copy of that markup and had already drifted to 6 cards
against a `pageSize` of 20.

## Found while verifying — NOT fixed here

**`/search` with no query shows "0 results" under an h1 reading "All products".** Pre-existing and
unrelated to rendering: with no category and an empty query, `useSearch` sends `searchQuery: '*'`,
because the SDK derives `requestType` from the query being truthy
(`getRequestType()`: `searchQuery ? 'product_search' : 'product_catalog'`) and `product_catalog`
400s without a `currentCategoryId`. Measured against GraphQL directly: `search: "*"` →
`totalCount: 0`, `search: ""` → `totalCount: 85`. This is the trap `../docs/sdk-reference.md`
documents — the wildcard is meant only as a transient fallback when no category tree is available.
The fix is a `product_catalog` browse of the root category, in the hook and in
`fetchSearchProducts` together, and it changes what "all products" means and in what order.

**A pre-existing `setState`-in-render warning** fires on a catalog switch: `I18nBridge` calls
`i18n.changeLanguage()` during render (deliberately — see the comment there), which notifies
`useTranslation` subscribers mid-render. Confirmed pre-existing by re-running the same switch
against the unmodified `router.push` version of `CatalogContext`.

**Category → category from page 2** still fires a client refetch: `setPage(1)` lands a render after
the navigation, so the first render pairs the new code with the old page number, the seed is
correctly withheld, and the reset then triggers a request.

## MUST NOT change
- **Do not add a `loading.tsx` back to any of these routes.** It is the single change that makes the
  product list script-gated again: the page moves into `<div hidden>` at the end of the response and
  a JS-less client renders the fallback for ever. Nothing in the build, the types or `tsc` will
  complain, and with JS on it looks fine. If a route needs a boundary, it must be one that no
  crawlable content sits behind.
- **A gated or empty fallback is not a substitute.** Rendering the skeleton only on the client (tried
  first, as `RouteFallback`) removes the *skeleton* from the initial HTML but keeps the hidden-div
  swap, so the product list is still invisible without JavaScript. Verified: the spacer was in
  `<main>` and the grid was still at byte 22256.
- **`LinkPendingReporter` must stay inside `<Link>`.** `useLinkStatus()` reads a context Link
  provides; anywhere else it reports `pending: false` for ever, silently, and every navigation loses
  its feedback with nothing failing.
- **`LinkPendingReporter` must NOT clear on unmount.** The clicked link is inside the area the
  placeholder replaces, so an unmount cleanup cancels the navigation state one frame after showing
  it and flashes the outgoing page back. Clearing is the provider's job, from the route.
- **`useNavigate`'s `startTransition` is load-bearing.** `router.push` returns immediately; without
  the transition there is no pending state to report and the header search goes back to looking
  frozen.
- **`RouteSkeleton` must keep drawing `CategoryNav` for category targets.** AppShell swaps out the
  whole of `<main>`, which contains `app/[locale]/category/layout.tsx` and therefore the nav bar.
- **Do not lower `SHOW_AFTER_MS` to "show something sooner".** Below ~150 ms the skeleton appears
  for a frame or two on navigations that were never slow, which is a glitch rather than feedback.
- **The category guard's `fetchCategoryProducts` call must keep page.tsx's exact arguments** — a
  different `pageSize` is a different `cache()` key, so the page refetches instead of reusing it.
- **`fetchSearchProducts` must keep mirroring `SearchPage`'s first-render `useSearch` options.** Any
  drift and the seed is discarded, the page refetches in the browser, and the skeleton is back.
- **Keep passing `initialData` only while the view matches it** (`isServerFetchedView` in both
  `CategoryPage` and `SearchPage`); `useSearch` now trusts the caller on this.
- **Do not prefetch `/search` when the URL carries `f_<field>` params.**
- **Existence checks stay in each route's `layout.tsx`.** They are no longer the *only* way to get a
  real 404 — nothing streams now, so `notFound()` in a page body would also work — but they are
  cheap (`cache()`d), they are what the 404 verification in `feature-metadata-all-routes.md` rests
  on, and they keep the guarantee independent of whether a boundary is ever reintroduced.
