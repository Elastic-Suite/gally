# Feature: hero CTA per catalogue

## Status: implemented
## Page/Component
`src/views/Homepage.tsx`, `src/locales/{en,fr,de}/category.json`.

## Why

The homepage hero ends in one button, and until now that button was hardcoded to dresses:
`homepage.shopDresses` / `homepage.shopDressesQuery`, translated into the three languages as
`dress` / `robe` / `Kleid`. That was written when the only sample shop sold clothes.

Three sample shops ship now — `fashion` (Fiora Fashion), `toolbox` (Toolbox Bricolage) and
`papershop` (Le livre & le lièvre) — and the hero kept sending all of them to dresses. On the
hardware shop and the stationery shop the banner's only action returned **zero products**, which
is the first thing a visitor clicks and the worst possible first impression of a search demo.

The label and the query cannot be split apart: the catalogue's language follows the locale
segment, so a French visitor must be sent to `robe` and not `dress`. They therefore stay one pair,
in the locale files, keyed by catalogue.

## The queries, and why each one

Every query below was measured with keyword search in its own localized catalogue against the
running instance on 2026-09-22. The count is the total hits of `product_search`.

| Catalogue | Language | Label | Query | Hits |
|---|---|---|---|---|
| `com`, `fr`, `uk` | en | Shop dresses | `dress` | 18 † |
| | fr | Découvrir les robes | `robe` | 17 † |
| | de | Kleider entdecken | `Kleid` | not measurable † |
| `fashion` | en | Shop dresses | `dress` | 43 |
| | fr | Découvrir les robes | `robe` | 44 |
| | de | Kleider entdecken | `Kleid` | 22 |
| `toolbox` | en | Shop drills | `drill` | 46 |
| | fr | Découvrir les perceuses | `perceuse` | 17 |
| | de | Akku-Bohrschrauber entdecken | `Akku-Bohrschrauber` | 6 |
| `papershop` | en | Shop fountain pens | `fountain pen` | 15 |
| | fr | Découvrir les stylos plume | `stylo plume` | 15 |
| | de | Füllhalter entdecken | `Füllhalter` | 8 |

**† The three legacy catalogues keep the dress pair, unchanged, and their numbers are carried over
rather than re-measured.** `com`, `fr` and `uk` are the original sample set — `com_fr`, `com_en`,
`fr_fr`, `fr_en`, `en_fr`, `en_en`, the `uk` catalogue being the one whose localized codes start
`en_`. All three hold the same apparel data, so dresses are the right range for all three and this
is exactly the behaviour that existed before this change. Their fixtures are not loaded in the
instance running today, so the counts above come from `specs/bugfix-hero-cta-empty-query.md`, which
measured them when they were. German was never measurable on them: the legacy set has no `de_DE`
localized catalog, so `Kleid` is there for key parity across the three locale files (golden rule 5)
and nothing renders it.

These entries stay until the legacy catalogues are actually retired. They are not dead weight to
tidy away — the new sample shops are being tested alongside them, not replacing them yet.

**The two German words are not the obvious ones, and that is measured, not stylistic.**
`Bohrmaschine` returns 2 hits and both are accessories (a drill-press vice, a masonry bit set),
not drills. `Füller` returns 9 hits and they are novels — the token matches book titles, not pens.
The German sample data names the products `Akku-Bohrschrauber` and `Füllhalter`, so those are the
words that land on the product the button promises.

## Behaviour (testable)

- [x] Each shop's hero button names a product range that shop actually sells, in the visitor's
      language, and the search it opens returns products.
- [x] Switching catalogue changes the button, because the catalogue comes from the URL segment
      through `CatalogContext` and the component re-renders with it.
- [ ] A catalogue with no entry falls back to a neutral "browse all products" button pointing at
      the root category, not to another shop's query. See `MUST NOT change`.
- [ ] A catalogue with no entry **and** no category tree renders no button at all, rather than a
      link to `/category/undefined`.
- [x] `npx tsc --noEmit` clean inside the `example` container.

**The two unticked boxes are the fallback path, and they could not be checked.** All three sample
shops have an entry, so there is no URL that reaches the fallback without adding a fourth catalogue
to the fixtures — which changes sample data rather than the app. They rest on reading the code
only: `i18n.exists` returns false, `heroHref` takes the `rootCategory` branch, and `heroHref` is
`null` when there is no root category so the button is not rendered. Check them the day a fourth
sample shop lands.

## Verified

Against the running instance on 2026-09-22, all nine localized catalogues:

- The rendered homepage carries the right label and the right `href`, with the locale segment
  intact and the query percent-encoded — `/example/papershop_de/search?q=F%C3%BCllhalter`,
  `Füllhalter entdecken`, and the eight others.
- The search pages those buttons open render products rather than an empty result.
- Key parity across `en`/`fr`/`de` `category.json`: no missing key, no extra key.
- `npx tsc --noEmit` clean, and `✓ Compiled` with no error lines in the `example` container log.

## SDK contract used

None changed. The button is a `LocaleLink` to `/search?q=…`, which is the same route the header
search box uses; `app/[locale]/search/page.tsx` does the fetching. The fallback is a link to
`/category/<root id>`, the same href `CategoryNav` already builds.

## Tracking (required)

Unchanged, and deliberately so. The hero button navigates; the search page it lands on fires
`trackSearch` itself, exactly as it does for a query typed into the header. Adding a second event
here would double-count the search.

## UI constraints

No new tokens, no new primitives, no styling change. The button keeps `btn btn-coral btn-lg`.

## MUST NOT change

- **Do not fall back to another shop's query.** Sending a hardware shop to `dress` is the bug this
  spec fixes. An unknown catalogue gets the neutral browse button, which is right for every shop
  because it asks the catalogue what it contains instead of assuming.
- **The label and the query stay one pair per language.** Splitting the query into a shared
  constant re-creates the original bug in a new shape: an English query under a French label.
- **A new query needs measuring in its own catalogue before it is added**, in all three languages.
  A word that reads correctly can still return nothing, or the wrong products — `Füller` returns
  novels. The value of these queries is a measured fact, not a translation.
- **A new sample shop needs an entry in all three locale files or none.** A partial set silently
  falls through i18next's `fallbackLng: 'en'` and puts an English query under a German label.
- **Do not delete the `com`, `fr` and `uk` entries because the running instance does not serve
  them.** The legacy catalogues are still in use and are not being retired yet; a missing entry
  would drop their hero button to the neutral browse link, which is a regression against behaviour
  that worked. The same applies to `com_en` in `VECTOR_DEMO_QUERIES`
  (`src/sdk/vectorSearch.ts`).
- Keep the button inside `.hero`. `docs/design-system.md` owns that block, and the hero is the one
  place on the homepage with a coral CTA.
