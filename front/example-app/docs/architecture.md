# Architecture Map (regenerate-able — lower trust than sdk-reference.md)

Next.js 16 App Router. Routes are thin server components in `app/`; the UI they render lives in
`src/views/` — **not** `src/pages`, which Next would claim as the Pages Router. One `'use client'`
boundary, in `app/providers.tsx`.

For hard SDK constraints see `sdk-reference.md`; for tokens and component patterns see
`design-system.md`. **Regenerate this file after structural refactors.**

## Routes — `app/`

Every `[locale]` is a localized-catalog code (`com_fr`, `com_en`, `fr_fr`, `fr_en`, `en_fr`,
`en_en`), resolved server-side in `app/[locale]/layout.tsx`.

```
app/
├── layout.tsx                      # <html>/<body>, static metadata + viewport
├── page.tsx                        # `/` → redirect to the default localized catalog
├── providers.tsx                   # 'use client' — the ONE boundary. Provider tree + AppShell
└── [locale]/
    ├── layout.tsx                  # resolves catalog/tree server-side, feeds <Providers> as props
    ├── page.tsx                    # → Homepage          (generateMetadata, OG)
    ├── search/page.tsx             # → SearchPage (initialData) (NOINDEX)
    ├── cart/page.tsx               # → CartPage          (NOINDEX)
    ├── checkout/page.tsx           # → CheckoutPage      (NOINDEX)
    ├── closing/page.tsx            # → ClosingPage       (NOINDEX)
    ├── explain/page.tsx            # → VectorSearchPage  (NOINDEX) — note: route is /explain
    ├── cms/[slug]/page.tsx         # → CmsPage
    ├── category/
    │   ├── layout.tsx              # renders <CategoryNav> above every category route
    │   └── [code]/
    │       ├── layout.tsx          # guard: notFound() when the category trail doesn't resolve,
    │       │                       #   then warms the listing fetch so the page renders in one pass
    │       └── page.tsx            # → CategoryPage (initialData) + JsonLd
    ├── product/[sku]/
    │   ├── layout.tsx              # guard: notFound() on unknown SKU
    │   └── page.tsx                # → ProductPage (initialProduct) + JsonLd
    └── blog/
        ├── page.tsx                # → BlogPage
        └── [id]/
            ├── layout.tsx          # guard: notFound() on unknown article
            └── page.tsx            # → BlogPostPage (initialPost) + JsonLd
```

**There are deliberately NO `loading.tsx` files.** One is a Suspense boundary, and a boundary defers
the initial document too: React streams the real page into a `<div hidden>` at the end of the
response and moves it into place with a script, so with JavaScript off the product list is in the
HTML but never rendered. Navigation feedback comes from `src/contexts/NavigationContext.tsx` instead.
See `specs/bugfix-ssr-product-list-behind-suspense.md` before adding one back.

Pattern per route: `generateMetadata()` for SEO, `resolveLocale()` for the catalog, `tServer()` for
strings, then render the `src/views/` component. Pages that must not be indexed spread `NOINDEX`.

**Existence checks belong in `layout.tsx`.** They were once the only place a real 404 status was
reachable — the page streamed behind a `loading.tsx` boundary, so by the time it ran the `200` was
already flushed and `notFound()` could only paint 404 UI. Nothing streams now, so a page-body check
would work as well, but the guards stay: they are `cache()`d (the page reuses the result rather than
refetching) and they keep the 404 guarantee from depending on whether a boundary ever comes back.

## Source — `src/`

```
src/
├── sdk/
│   ├── index.ts          # Singletons: getClient(), getSearchManager(), getTracker(), MEDIA_BASE_URL.
│   │                     #   Routes Node through http://router/api — NOT gally.localhost
│   ├── server.ts         # React cache()-wrapped server fetches: fetchProductBySku,
│   │                     #   fetchCategoryProducts, fetchSearchProducts, fetchCmsPageById,
│   │                     #   resolveLocale, cachedCategoryTree
│   ├── catalogs.ts       # ICatalog/ILocalizedCatalog/ICategoryNode, LANGUAGES,
│   │                     #   fetchCatalogs() (REST), fetchCategoryTree() (GraphQL), findLocalizedCatalog()
│   ├── categoryTree.ts   # findTrail() — code → ancestor chain
│   ├── fields.ts         # PRODUCT_FIELDS / CMS_FIELDS / CMS_METADATA — the selectedFields lists.
│   │                     #   Empty selectedFields silently returns zero rows; see sdk-reference.md
│   ├── productFields.ts  # getProductFields(doc) → product view model
│   ├── cmsFields.ts      # CmsPage type, getCmsFields(doc), cmsPageUrl(), formatCmsDate()
│   ├── seo.ts            # SITE/SITE_ORIGIN/SITE_NAME, canonical(), languageOf(),
│   │                     #   toMetaDescription(), openGraphBase(), NOINDEX
│   └── serverI18n.ts     # tServer(), tServerFirst() — translation in server components,
│                         #   where react-i18next hooks are unavailable
├── contexts/
│   ├── CatalogContext.tsx   # Catalogs + tree, arriving as server props. NO useState for the
│   │                        #   selection — the URL is the state; switching catalog is a navigation
│   ├── LocaleContext.tsx    # useLocale(), withLocale(), useLocaleHref() for router.push,
│   │                        # useAppPathname()/withoutLocale() for route comparisons
│   ├── CartContext.tsx      # Cart state + add_to_cart tracking
│   ├── DemoContext.tsx      # Audience mode (direction/marketing), active scenario, introSeen
│   ├── NavigationContext.tsx # Client-side navigation feedback: useLinkStatus() reported out of
│   │                        #   every LocaleLink, plus useNavigate() for imperative pushes.
│   │                        #   Replaces what loading.tsx used to do — see the note above
│   ├── EventLogContext.tsx  # Buffer behind the live tracking panel
│   └── SearchBarContext.tsx # Imperative handle so anything can focus/fill the search input
├── hooks/
│   ├── useSearch.ts       # useSearch(options) reactive hook, useAutocomplete()
│   ├── useCms.ts          # useCmsSearch(), useCmsAutocomplete() + re-exports of cmsFields helpers
│   ├── useTracking.ts     # trackCategoryView/ProductView/Search/Display/AddToCart/Order
│   ├── useAddedFlash.ts   # ADDED_FLASH_MS + the transient "added to cart" state
│   ├── useMounted.ts      # Client-only render gate — the sanctioned replacement for
│   │                      #   dynamic(..., { ssr: false }); see specs/bugfix-dynamic-ssr-false-bailout.md
│   └── useStoryActions.ts # Scenario action engine: DOM polling, highlights, navigation, timers
├── components/
│   ├── AppShell.tsx        # Former App.tsx minus <Routes>: Header + main + Footer, and the
│   │                       #   mounted-gated demo scaffolding (EventLog, StoryCompanion, …)
│   ├── Header.tsx          # Two-row sticky header: nav/selectors/cart, then the search band
│   ├── SearchBar.tsx       # Input + keyboard nav (arrows/Enter/Escape), driven via SearchBarContext
│   ├── SearchOverlay.tsx   # Full-screen 3-col autocomplete popup (portaled). Also exports the
│   │                       #   matching helpers: getSuggestionMatches, getAutocompleteAttributes,
│   │                       #   attributeFilterUrl, highlightTerms, getCategoryMatches
│   ├── CategoryNav.tsx     # Category tree with hover submenus
│   ├── Facets.tsx          # Sidebar facets (checkbox/slider/boolean/swatch/category/search/
│   │                       #   show-more) + active-filter chips
│   ├── VariantSelector.tsx # PDP option axes from `configurable_attributes` — colour as facet
│   │                       #   swatches, everything else as chips. Also exports getVariantAxes
│   ├── swatchColors.ts     # Colour-label → hex approximation, shared with Facets.tsx. The one
│   │                       #   place raw hex is allowed outside brand assets (it's product data)
│   ├── ProductCard.tsx     # Image, price, discount, stock, add-to-cart
│   ├── ProductSlider.tsx   # Horizontal carousel
│   ├── BlogCard.tsx        # Article teaser for the blog listing
│   ├── LocaleLink.tsx      # Import this AS `Link` instead of next/link — a raw next/link drops
│   │                       #   the visitor back to the default catalog. Also carries the
│   │                       #   pending-navigation reporter, which only works inside a <Link>
│   ├── JsonLd.tsx          # <script type="application/ld+json"> for structured data
│   ├── skeletons.tsx       # ProductGridSkeleton, FacetsSkeleton(+Body), ProductPageSkeleton,
│   │                       #   BlogPostSkeleton, CategoryPageSkeleton, SearchPageSkeleton —
│   │                       #   consumed by RouteSkeleton and by the views' own loading branches
│   ├── RouteSkeleton.tsx   # Picks the skeleton for a pending navigation from its target href;
│   │                       #   also redraws CategoryNav, which the swap would otherwise remove
│   ├── ScrollToTop.tsx     # Resets scroll on navigation
│   ├── Footer.tsx
│   └── — demo scaffolding, client-only, code-split out of the server payload —
│       ├── IntroScreen.tsx      # Pre-storefront intro (currently unreachable; introSeen starts true)
│       ├── EventLog.tsx         # Floating real-time tracking panel
│       ├── TrackingInsights.tsx # Tracking read-out for the demo audience
│       ├── SearchExplain.tsx    # Relevance explanation panel
│       └── StoryCompanion.tsx   # Guided-scenario driver, on top of useStoryActions
├── views/                 # One per route. All 'use client'.
│   ├── Homepage.tsx        # Hero + stats band + category nav + product sliders
│   ├── CategoryPage.tsx    # Browse: facets, sort, pagination. Takes `initialData`
│   │                       #   ({products, total, pageCount, aggregations}) from the server
│   ├── SearchPage.tsx      # Full-text search: facets, sort, pagination
│   ├── ProductPage.tsx     # Detail: image, price, description, variants, stock, recommendations
│   ├── CartPage.tsx        # Cart items + recommendations
│   ├── CheckoutPage.tsx    # Multi-step tunnel (shipping → payment → confirmation) + ORDER tracking
│   ├── BlogPage.tsx        # CMS article listing. Pushes `pathname` — the one place a raw
│   │                       #   segment-bearing push is correct, so do NOT wrap it in withLocale
│   ├── BlogPostPage.tsx    # Single article (accepts server-fetched initialPost)
│   ├── CmsPage.tsx         # Static content pages
│   ├── VectorSearchPage.tsx# Keyword vs vector search comparison (route: /explain)
│   └── ClosingPage.tsx     # Demo wrap-up screen
├── i18n/
│   ├── index.ts           # i18next init
│   └── I18nBridge.tsx     # Syncs i18next's language with the [locale] segment
├── locales/{de,en,fr}/    # blog, cart, category, cms, common, demo, facets, product,
│                          #   scenarios, search — 10 namespaces per language
├── scenarios/
│   ├── types.ts           # Scenario / ScenarioStep, incl. the action descriptors
│   └── demo-dress.ts      # The scripted guided demo
├── assets/
└── styles.css             # Single source of visual truth — ~80KB / 3.6k lines. High-risk:
                           #   changing it triggers the plan-first rule in AGENTS.md
```

`src/components/AGENTS.md` and `src/views/AGENTS.md` carry directory-local rules — read them before
editing in either directory.

## Feature → file

| Feature | Start at |
|---|---|
| Autocomplete popup, suggestions, keyboard nav | `components/SearchOverlay.tsx`, `components/SearchBar.tsx` |
| Search results, sort, pagination | `views/SearchPage.tsx`, `hooks/useSearch.ts` |
| Facets, filter chips, show-more | `components/Facets.tsx` |
| Category browse and nav | `views/CategoryPage.tsx`, `components/CategoryNav.tsx`, `app/[locale]/category/` |
| Product detail | `views/ProductPage.tsx`, `sdk/productFields.ts` |
| Configurable option selection (colour/size) | `components/VariantSelector.tsx`, `sdk/fields.ts` (`PRODUCT_DETAIL_FIELDS`) |
| Cart / checkout | `contexts/CartContext.tsx`, `views/CartPage.tsx`, `views/CheckoutPage.tsx` |
| Blog / CMS | `views/BlogPage.tsx`, `views/BlogPostPage.tsx`, `sdk/cmsFields.ts`, `hooks/useCms.ts` |
| SEO, metadata, OG, JSON-LD | `sdk/seo.ts`, `components/JsonLd.tsx`, the route's `generateMetadata` |
| Catalog / language switching | `contexts/CatalogContext.tsx`, `contexts/LocaleContext.tsx`, `components/LocaleLink.tsx` |
| Translations | `src/locales/<lang>/<ns>.json`; server side via `sdk/serverI18n.ts` |
| Tracking / analytics | `hooks/useTracking.ts`, `contexts/EventLogContext.tsx` |
| Loading states | `components/skeletons.tsx` + `components/RouteSkeleton.tsx` + `contexts/NavigationContext.tsx` |
| Guided demo, intro, audience modes | `contexts/DemoContext.tsx`, `src/scenarios/`, `components/StoryCompanion.tsx` |
| Anything visual | `src/styles.css` + `docs/design-system.md` |

Faster than this table for anything already built: `ls specs/` — the filenames are feature names, and
each spec names the files it touched.
