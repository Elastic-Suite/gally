# Test plan: translations

## Status: implemented - 39 tests in `src/test/i18n-*.test.ts`, plus one assertion in `routes.test.tsx`, all passing

Third aspect of the test suite. A missing or broken translation does not throw: the client shows the
raw key (`facets.chip.default`), and the server helper `tServer` quietly uses its English default
(`src/sdk/serverI18n.ts:56-63`), so page titles and descriptions can fall back without anyone
seeing it. `bugfix-german-locale-untranslated.md` already checked most of this by hand, once.

About 25-30 tests in 3 files, Node environment, reading the locale JSON and the source. Each test
covers every key, so the count stays small while the coverage is wide.

## Where things stand (measured 2026-10-22)

-   3 languages (`en`, `fr`, `de`), 11 namespaces, 350 keys in English.
-   French and German have exactly the English key set: no missing key, no extra key.
-   The code calls `t()` with a literal key 297 times; all 297 exist. 21 calls build the key at
    runtime (`` t(`checkout.steps.${s}`) ``, `t(badge.key)`, scenario keys).
-   25 French and 15 German values are identical to English. Most are the same word in both
    languages (`Blog`, `Marketing`, `Business`) or only placeholders (`{{label}}: {{value}}`).

So every test below passes on today's code; they exist to keep it that way.

## Decisions

1. **Strings identical to English** - decided: (a), an allowlist of today's identical strings in the
   test. A new identical string fails until it is translated or added to the list on purpose. Values
   made only of placeholders and punctuation are ignored automatically.
2. **Sort labels (part D)** - decided: (a). `localizeSortOptions()` is now exported from
   `src/hooks/useSortOptions.ts` with the code unchanged, and tested directly. The mapping that swaps
   four API labels for the app's own translations sat inside the hook. The options were:
    - (a) Move that mapping into a small exported function, unchanged, and test the function in
      Node. A code change, but no behaviour change.
    - (b) Leave the code alone and test the hook by rendering it in jsdom, with a fake search
      manager and catalog context. Heavier, and closer to the component aspects.
    - Recommended: (a).

## A - The three languages stay in sync

-   Every namespace file exists in every language.
-   Same keys per namespace in `en`, `fr` and `de`.
-   Same `{{placeholder}}` set per key - a translated string that drops `{{count}}` shows nothing
    where the number should be.
-   Same array length per key (`search.overlay.suggestions`, the `cms` content arrays).
-   Every plural has both forms (`_one` and `_other`) in every language.
-   No empty value.
-   Identical-to-English strings limited to the allowlist (decision 1).

## B - The wiring loads every namespace

-   The client instance (`src/i18n/index.ts`) has every namespace for every language.
-   Every language in `LANGUAGES` (`src/sdk/catalogs.ts`) has a locale folder and is registered.
-   The server helper (`src/sdk/serverI18n.ts`) loads every namespace a `tServer` call uses.

## C - Every key the code asks for exists

-   Every literal `t('key')` resolves, in the namespace of its file's `useTranslation(...)` or its own
    `ns:` prefix.
-   Every literal `tServer(lang, 'ns', 'key')` / `tServerFirst(...)` key exists in all three
    languages, since the server falls back silently.
-   Keys built at runtime, from the lists they are built from:
    -   the product badges (`getProductBadges`: sale, new, material);
    -   the checkout steps;
    -   the scenario keys from `src/scenarios`;
    -   the CMS pages: the list in `app/[locale]/cms/[slug]/page.tsx` equals the one in
        `src/views/CmsPage.tsx` (MUST NOT in `feature-metadata-all-routes.md`), and each page has a
        title in all three languages.

## D - Translations that come from the API

The API returns some labels already translated for the requested localized catalog. Checked live on
2026-10-22: VA02's colours are `Gold, Rain, Peach` in `com_en` and `Doré, Pluie, Pêche` in `com_fr`,
its material `Organic Cotton` / `Coton bio`. Product names are not translated in the sample data.

-   **Each request names the visitor's catalog.** Already covered for products, listings, search,
    articles, public configuration and axis labels (`test-plan-data-layer.md`, parts E and F). Added
    here: the category tree asks for the resolved `localizedCatalogId`.
-   **French labels survive the mapping.** VA02 captured from `com_fr` as well (the capture script
    gains it): `getProductFields` and `getVariantAxes` keep `Doré`, `Pluie`, `Coton bio`, never an
    English or raw value.
-   **Option values do not change with the language.** The same colour has the same `value` in
    `com_en` and `com_fr` (`5` is Gold and Doré), so a selection or a cart line keyed by value means the
    same thing in both.
-   **Axis names in French.** The French axis labels captured from the API are used by `axisLabel`.
-   **The four sort codes the API leaves in English** (`_score`, `category__position`, `price__price`,
    `stock__status`, `useSortOptions.ts:17-22`) get the app's translation in all three languages;
    every other sort label is the API's, untouched (decision 2).
-   **Page metadata follows the catalog's language.** The same route's `generateMetadata` gives the
    French title for `com_fr` and the English one for `com_en`.

## Outcome

-   French fixtures added to the capture script: VA02 and the axis labels from `com_fr`
    (`product-*-configurable-fr.json`, `axis-labels-fr.json`).
-   Six deliberate breaks, each made a test fail: a German key renamed, a French value left in
    English, a French `{{count}}` dropped, a checkout step with no translation, a typo in a `t()`
    key, and a sort code removed from the list the app translates.

## Out of scope here

-   Facet and autocomplete labels (`agg.label`, with the raw field code as fallback). They are read
    inside the facet and autocomplete components; they belong to the search aspect.
-   Whether a translation is good. The tests check structure, not wording.
-   Rendering: that a component actually shows the translated text. That belongs to the component
    aspects.
