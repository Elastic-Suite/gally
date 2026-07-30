# Architecture Map (regenerate-able — lower trust than sdk-reference.md)

```
src/
├── sdk/
│   ├── index.ts          # Singletons: getSearchManager(), getTracker(), getClient(), MEDIA_BASE_URL
│   └── catalogs.ts       # fetchCatalogs() (REST), fetchCategoryTree() (GraphQL), types
├── contexts/
│   ├── CatalogContext.tsx  # Real catalogs + category tree, provides selectors
│   ├── CartContext.tsx     # Cart state + add_to_cart tracking
│   └── EventLogContext.tsx # Live event log panel for debugging tracking
├── hooks/
│   ├── useSearch.ts        # useSearch(options) reactive hook, useAutocomplete(), viewMoreOptions(field)
│   └── useTracking.ts      # trackCategoryView/ProductView/Search/Display/AddToCart/Order
├── components/
│   ├── Header.tsx          # Nav, catalog/locale selectors, search bar + autocomplete
│   ├── CategoryNav.tsx     # Real category tree with hover submenus
│   ├── ProductCard.tsx     # Image, price, discount, stock, add-to-cart
│   ├── Facets.tsx          # Sidebar facets (checkbox/slider/boolean/swatch/category/search/show-more) + active-filter chips
│   ├── ProductSlider.tsx   # Horizontal carousel
│   ├── EventLog.tsx        # Floating real-time tracking panel
│   └── Footer.tsx
├── pages/
│   ├── Homepage.tsx        # Hero + stats band + category nav + product sliders
│   ├── CategoryPage.tsx    # Browse: facets, sort, pagination
│   ├── SearchPage.tsx      # Full-text search: facets, sort, pagination
│   ├── ProductPage.tsx     # Detail: image, price, description, variants, stock, recommendations
│   ├── CartPage.tsx        # Cart items + recommendations
│   ├── CheckoutPage.tsx    # Multi-step tunnel (shipping → payment → confirmation) + ORDER tracking
│   ├── CmsPage.tsx         # Static content pages
│   ├── ClosingPage.tsx     # (present on branch)
│   └── VectorSearchPage.tsx# Keyword vs vector search comparison
├── styles.css              # Full stylesheet (indigo/coral, responsive) ~58KB
├── App.tsx                 # Routes
└── index.tsx               # BrowserRouter basename="/example", providers
```

> Regenerate this file after structural refactors. For hard SDK constraints, see `sdk-reference.md`.
