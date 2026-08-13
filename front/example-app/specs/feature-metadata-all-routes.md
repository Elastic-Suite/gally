# Feature: metadata on every route, and product-page metadata fixes

## Status: implemented
## Page/Component: every `app/[locale]/**/page.tsx`, `src/sdk/seo.ts`, `src/sdk/serverI18n.ts`

## Problem

Phase 3 added `generateMetadata()` to exactly three routes — product, blog post, category. The
other **eight had none at all** and fell through to the root layout's single static title, so the
homepage, the search results (the product list), the blog index, the CMS pages, cart, checkout,
explain and closing all shipped `<title>Gally Features — ElasticSuite Demo</title>` with no
description, no canonical and no Open Graph.

That was scoped, not accidental — `plan-ssr-seo.md` put the remaining surface in Phase 4 — but it
left the most obvious "does this site have SEO" check failing on the product list.

## What was added

| Route | Title source | Indexable |
|---|---|---|
| `/[locale]` | `category.homepage.heroTitle` | yes, + description + canonical |
| `/[locale]/blog` | `blog.title` | yes, + description + canonical |
| `/[locale]/cms/[slug]` | `cms.<key>.title` | yes, + description from the first paragraph |
| `/[locale]/search` | `common.meta.search` | **noindex** |
| `/[locale]/cart` `/checkout` `/explain` `/closing` | `common.meta.*` | **noindex** |

`noindex` pages get a `<title>` but **no canonical**: a page that should not be indexed has no
business nominating itself as the canonical version of anything. Search is excluded because its
query-string surface is unbounded and would dilute the real category pages; cart and checkout are
per-session state; explain and closing are demo scaffolding.

Root layout now sets `title.template` (`"%s · Gally"`), `metadataBase`, and a default title, so
every page reads as part of a site instead of a bare string.

## Two real bugs found on the product page while auditing it

1. **`Product` JSON-LD carried raw HTML in `description`.** `toMetaDescription()` was applied to the
   `<meta>` tag but not to the structured data, so the schema.org description shipped
   `<p>…</p><ul><li>…` markup. schema.org `description` is a plain-text field and validators flag
   embedded markup. Now stripped (at a longer limit than the meta tag, since JSON-LD has no
   snippet-length constraint).
2. **`og:site_name` was silently missing from every page that set a title.** Next merges
   `openGraph` **shallowly** — a page-level `openGraph` object *replaces* the parent layout's rather
   than extending it — so declaring `siteName` once in the root layout did nothing for the routes
   that mattered. `openGraphBase()` now supplies `siteName` and `og:locale`, and is spread into
   every page's `openGraph`.

Also fixed: the `SITE` origin constant had been copy-pasted into three route files. A canonical URL
that disagrees between routes is worse than none, so it now lives once in `src/sdk/seo.ts` and reads
`NEXT_PUBLIC_SITE_ORIGIN` with the local stack as the default.

## i18n
Five new user-visible strings (the noindex page titles) were added to `common.meta.*` in **all three
locales** per `AGENTS.md` rule 5 — including German, which is currently an untranslated stub
elsewhere in `common.json` and unreachable in this dataset (no catalog uses `de_DE`).

`generateMetadata()` cannot use `src/i18n`: that module calls `initReactI18next`, which makes it
unusable from a Server Component, and it is a mutable singleton whose current language is whatever
the last render set. `src/sdk/serverI18n.ts` statically imports the locale JSON for the namespaces
metadata reads and does a dotted-path lookup with the same `fallbackLng: 'en'` behaviour.

## Behaviour (testable) — verified by curl, no JavaScript
- [x] All 11 routes return 200 and carry a real `<title>`, suffixed `· Gally`
- [x] Indexable routes carry description + canonical; the five noindex routes carry
      `<meta name="robots" content="noindex, follow">` and no canonical
- [x] French works throughout: `/com_fr` → *"La recherche intelligente pour l'e-commerce"*,
      `/com_fr/cart` → *"Panier"*, `/com_fr/cms/about` → *"À propos d'ElasticSuite"*
- [x] `og:site_name` present exactly once per page; `og:locale` correct per catalog
      (`en_US` / `fr_FR`)
- [x] `Product` JSON-LD description contains no HTML tags
- [x] `/cms/about` now has a description drawn from its first paragraph
- [x] No hydration mismatches; `npx tsc --noEmit` clean

## Still missing — genuinely Phase 4, not overlooked
- **`hreflang`.** No route emits `alternates.languages`, so the six locale variants of each page are
  not linked to each other. This is the single biggest remaining SEO gap and the whole reason the
  locale went into the URL in Phase 2.
- `app/sitemap.ts` and `app/robots.ts`.
- `<html lang="en">` is still hardcoded in the root layout and wrong for every `*_fr` URL.

## MUST NOT change
- **Do not rely on inheriting `openGraph` from the root layout** — Next replaces it wholesale.
  Spread `openGraphBase()` into every page that sets any `openGraph` field.
- **Keep `noindex` routes canonical-free**, and keep `search` in that set.
- **Do not reintroduce a local `SITE` constant** in a route file.
- `generateMetadata()` must not import from `src/i18n` — use `src/sdk/serverI18n.ts`.
- `CMS_PAGE_KEYS` is duplicated in `src/views/CmsPage.tsx` and the route's `page.tsx`; the route
  `notFound()`s on an unmapped slug, which is what stops every unknown `/cms/*` URL from rendering
  the About page as duplicate content. Keep the two lists in step.

---

## Follow-up: the product listing described only itself

The category page — the product listing — emitted `BreadcrumbList` and nothing else. A crawler could
see that the category existed and where it sat in the hierarchy, but learned **nothing about the
products it lists**, which is the one thing a listing page is for.

Added `CollectionPage` → `ItemList`, built from the products the server already fetched for
`initialData`, so it costs no extra request. Each entry is a `Product` with name, sku, image,
canonical product URL and an `Offer` (price, catalog currency, availability). It carries the **first
page only**, matching the canonical URL and what is actually server-rendered — advertising results
that are not on the page would be a mismatch.

Three further fixes to the same route:
- **The description was hardcoded English** (`Browse ${title} in the Gally demo storefront.`), so
  French users got an English description. Now `category.category.meta.description` in all three
  locales, interpolated with the real product count — `tServer` gained `{{var}}` support.
  Verified: `/com_fr/category/cat_12` → *"Découvrez notre sélection Pantalons & Shorts : 12 produits
  disponibles."*
- **The breadcrumb skipped ancestors.** `findTrail()` now returns the whole chain, so a nested
  category reads `Home > Bottoms > Pants & Shorts` instead of `Home > Pants & Shorts`. "Home" is
  translated (`common.meta.home`).
- `og:image` now uses the first product's image.

## The soft-404 regression that `loading.tsx` introduced — and the fix

Found while checking that a junk category id 404s. **It did not: `/category/cat_9999`,
`/product/NOPE` and `/blog/99999` all returned 200** with the 404 page rendered inside them.

Root cause: `loading.tsx` creates a Suspense boundary, so the route **streams**. The 200 header is
flushed before the page component runs, and `notFound()` can then only render the 404 UI — it cannot
change a status that is already sent. Moving the check into `generateMetadata()` did **not** help
either: Next 16 streams metadata too. Sending a crawler user-agent did not change it.

Fix: a `layout.tsx` per dynamic route doing the existence check. Layouts render **outside** the
Suspense boundary `loading.tsx` creates, so they still block the response and a real 404 status is
possible. All the fetches are `cache()`d — `cachedCategoryTree` was added for the same reason — so
the guard reuses the page's own request rather than issuing another.

Measured cost: warm TTFB 1.0–1.5 s, in line with before the guards; the skeleton still streams ahead
of content on the category route. Verified 404s: `/product/NOPE`, `/blog/99999`,
`/category/cat_9999`, `/cms/nonsense`, `/nope_locale`.

## MUST NOT change (additions)
- **Never rely on `notFound()` in a page or in `generateMetadata` for a route that has a
  `loading.tsx`.** It renders the right UI under the wrong status, and nothing warns you. The check
  belongs in that route's `layout.tsx`. Deleting one of those guards silently reintroduces soft-404s
  on an unbounded set of URLs. (The `loading.tsx` files were later deleted for an unrelated reason —
  `bugfix-ssr-product-list-behind-suspense.md` — so nothing streams today and the page-body checks
  would also work. The layout guards stay, and the 404s verified above are still verified against
  them; the rule stands for the moment any boundary is reintroduced.)
- `findTrail()` in `src/sdk/categoryTree.ts` is shared by the category guard and the category route
  so that "does this category exist" is answered identically in both. Do not fork it.
- `ItemList` must keep describing **only the first page** — the same rows the canonical URL renders.
