# Gally Storefront Demo — Storytelling Scenario (Dress Edition)

## Overview

A React SPA demo showcasing Gally's search/merchandising capabilities through a **5-act narrative journey**. The product domain is **fashion/dresses** (robes, accessoires). The app connects to a live Gally API for real search results, with simulated cart AOV boosters and a demo storytelling layer on top.

## Personas

-   **Camille** — The customer. Looking for the perfect summer dress.
-   **Le marchand** — The e-commerce merchant. Wants to control merchandising and understand ROI.

## Audience Modes

-   **Direction** (default): clean view, hides event tracker + vector search nav link. Focus on customer journey & ROI.
-   **Marketing**: everything visible (event tracker, vector preview shortcut).

Toggled on the intro screen. Applied via CSS class `mode-direction` / `mode-marketing` on `body`.

---

## The 5-Act Journey

### Acte 1 — L'arrivée (Camille)

-   **What**: Camille types a fuzzy query **"robe légère été"**. Autocomplete understands intent and surfaces relevant results.
-   **Feature showcased**: Smart search (autocomplete + vector search)
-   **Stat**: −40% no results
-   **Route**: `/search?q=robe%20légère%20été`
-   **Spotlight**: `.search-bar-wrapper`
-   **Note**: The search query must return actual products from the Gally catalog. If "robe légère été" returns empty, adjust to a query that matches existing products (e.g., "dress", "robe", or whatever terms are indexed).

### Acte 2 — L'exploration (Camille)

-   **What**: Camille browses a category. Facets are spotlighted — color swatches, price slider, search-in-options, "see more" toggle.
-   **Feature showcased**: Faceted navigation
-   **Stat**: Less bounce
-   **Route**: `/category/__first__` (resolved to first available category at runtime)
-   **Spotlight**: `.facets-sidebar`

### Acte 3 — Le doute (Le marchand)

-   **What**: The merchant wonders how to control product ranking without developers. The vector/boost comparison page shows side-by-side keyword vs vector results.
-   **Feature showcased**: Merchandising control (vector search preview)
-   **Stat**: Piloted ranking
-   **Route**: `/vector-search`
-   **Spotlight**: `.vector-compare`
-   **Known issue**: Both panels currently run the same search query (no separate vector endpoint yet). If the query returns empty, the comparison is meaningless — use a query that returns results.

### Acte 4 — La décision (Camille)

-   **What**: Camille adds a dress to cart. Cart AOV boosters activate.
-   **Feature showcased**: Cart optimization
-   **Stat**: +15% AOV
-   **Route**: `/cart`
-   **Spotlight**: `.cart-summary`
-   **Cart AOV levers**:
    -   **Pack accessoires −20%**: Pochette assortie (€29.90), Ceinture tissu (€19.90), Foulard léger (€24.90) → bundle price with 20% off
    -   **Free shipping bar**: €180 threshold with progress indicator
    -   **Frequently bought together**: Sandales tressées (€49.90), Chapeau de paille (€34.90), Boucles d'oreilles dorées (€22.90) — checkboxes with live total
    -   **Animated total**: flash/scale animation on total when cart changes

### Acte 5 — Le bilan (Le marchand)

-   **What**: Business impact summary. Sequenced reveal: timeline → cost → pricing.
-   **Feature showcased**: Business case / ROI
-   **Stat**: +30% conversion
-   **Route**: `/closing`

---

## Closing Page — Sequenced Reveal

Each stage revealed by clicking a button:

1. **Délai** (always visible)

    - Market: 6 à 12 mois
    - Gally: Quelques jours

2. **Coût** (button: "Et côté budget ?")

    - Market: 80 000 — 100 000 € year 1
    - Gally: À partir de ~12 000 € (flat, not indexed on catalog/queries)

3. **Pricing** (button: "Voir nos plans")
    - **Business** 999 €/mois (featured, "Populaire" badge)
    - **Enterprise** Sur devis
    - Both → "Parler à un commercial"

**Disclaimer**: "Ordres de grandeur observés sur des projets de search e-commerce comparables — hors coûts internes. À affiner selon le contexte du prospect."

**Closing stats**: −40% no results · +30% conversion · +15% AOV

---

## Story Companion UX

-   **Position**: Fixed right side panel (340px wide, top 70px)
-   **Flow**: Read bubble → click CTA → panel minimizes + navigates to feature page → "📖 Reprendre le récit" pill appears to reopen
-   **Navigation**: ‹ Précédent / Suivant › buttons + clickable progress segments (5 bars)
-   **Close**: ✕ button to dismiss companion entirely

---

## Files Involved

| File                                | Role                                                      |
| ----------------------------------- | --------------------------------------------------------- |
| `src/contexts/DemoContext.tsx`      | Story state, audience mode, intro state, STORY_STEPS data |
| `src/components/IntroScreen.tsx`    | Intro overlay with personas + audience toggle             |
| `src/components/StoryCompanion.tsx` | Right side panel companion                                |
| `src/views/ClosingPage.tsx`         | Sequenced bilan (delay → cost → pricing)                  |
| `src/views/CartPage.tsx`            | Cart with bundle, FBT, shipping bar, animated total       |
| `app/providers.tsx`                 | Intro gate, audience class, companion (was `src/App.tsx`) |
| `app/[locale]/closing/page.tsx`     | The closing route itself                                  |

---

## Known Issues & Adjustments Needed

-   **Vector search returns empty**: The VectorSearchPage default query is "robe légère été". If the Gally catalog doesn't contain products matching this query, both panels show empty. Fix: change the default query in `VectorSearchPage.tsx` and the Act 1 search query in `DemoContext.tsx` to match actual indexed product terms.
-   **Category **first****: Act 2 navigates to the first category from the API. If categories are empty or the first one has no products, the demo falls flat.
-   **Cart must have items**: Act 4 navigates to cart, but the user needs to have added a product first for the AOV levers to be visible. Consider pre-populating the cart when Act 4 CTA is clicked.
