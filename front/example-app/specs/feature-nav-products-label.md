# Feature: Top-nav "Categories" item renamed to "Products"

## Status: implemented
## Page/Component: src/components/Header.tsx, src/locales/{en,fr,de}/common.json

The second item in the header nav — the one that jumps into the catalog at the first
root category — now reads "Products". Only the label changes: the link target, the
active-state rule and the category tree behind it are untouched.

## Behaviour (testable)
- [x] The nav item renders "Products" (en), "Produits" (fr), "Products" (de).
- [x] It still links to `/category/{firstCategory.id}` (or `/` before `CatalogContext`
      resolves the tree) and still shows `active` on any `/category*` path.
- [x] The i18n key was renamed `nav.categories` → `nav.products` in all three bundles,
      and `Header.tsx` updated to match. No `nav.categories` reference remains
      (grep-verified) — a leftover would have rendered the raw key string, since
      i18next falls back to the key, not to the old value.

## i18n
- All three locales updated in the same commit; `common.json` is a static import in
  `i18n/index.ts`, so a missing key is a runtime label bug, not a build error.
- **German is a placeholder locale**: `de/*` is currently a verbatim copy of `en/*`
  (285/285 keys identical), so `de` gets "Products", not "Produkte". Translating this
  one key would make it the only German string in the bundle. When `de` is genuinely
  translated, `nav.products` → "Produkte" goes with it.
- Left alone deliberately — these refer to real categories, not the nav item:
  `category.json:breadcrumb` ("Home / Categories / {{name}}"), `search.json`'s ACP
  category strings, and the `demo.json`/`scenarios.json` tracking copy.

## SDK contract used
- None. Presentation-only change; no `SearchManager` call touched.

## Tracking (required)
- No change. Category views still fire `TrackingEventType.VIEW` with `metadataCode:
  'category'` from `CategoryPage.tsx` — the nav label is not part of any payload.

## UI constraints
- No markup, class or token change — same `<Link>` in the same `.header-nav`.

## MUST NOT change
- The link target and active-path rule (`/category*`), so deep links and the
  subcategory navbar keep working.
- The sibling nav items. In particular `nav.cms` keeps its key while rendering "Blog"
  (see `feature-blog-cms.md`) — that mismatch is pre-existing and out of scope here.
