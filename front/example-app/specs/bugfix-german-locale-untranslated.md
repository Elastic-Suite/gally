# Bugfix: the German locale was English

## Status: implemented
## Page/Component: src/locales/de/*.json (all 10 namespaces)

## Problem
`src/locales/de/` was a copy of `src/locales/en/`. Eight of the ten namespace files were
byte-identical to their English originals; only two strings had ever been translated
(`common.meta.*` and `category.category.meta.description`). Every German visitor would have read
English UI text — "Add to cart", "Your cart is empty", the whole guided story.

**Root cause is not a bad translation, it's an unreachable one.** `LANGUAGES` in `src/sdk/catalogs.ts`
maps `de_DE → 'de'`, but the API's fixtures expose no `de_DE` localized catalog — the six that exist
are `com_fr`, `com_en`, `fr_fr`, `fr_en`, `en_fr`, `en_en`, i.e. only `fr_FR` and `en_US`. Since
`activeLanguage` is derived from the selected localized catalog's locale, **no URL in the app can
select German today.** The `de/` bundle was scaffolded, wired into `src/i18n/index.ts`, bundled — and
then never rendered, so the placeholder English was invisible to every manual check. The wrong belief
was that a locale being wired up and imported means it is exercised.

## Behaviour (testable)
- [x] All 10 namespaces translated into German: `blog`, `cart`, `category`, `cms`, `common`, `demo`,
      `facets`, `product`, `scenarios`, `search`.
- [x] Formal register (`Sie`) throughout, matching the two strings that had already been translated
      ("Entdecken Sie unsere …") and the French bundle's `vous` form.
- [x] Key structure is identical to `en/` — verified mechanically, not by eye: no missing key, no
      extra key, every `{{placeholder}}` set preserved per key, every array the same length
      (`overlay.suggestions`, the `cms` content arrays, `pricing.*Features`).
- [x] Nine strings are intentionally identical to English because German uses the same word:
      `Blog`, `Marketing`, `Business`, `Enterprise`, `Material:`, and the `Name A-Z` / `Name Z-A` /
      `Name A→Z` sort labels. The checker flags these; they are correct.
- [x] Content strings were localized, not just translated:
      - `search.overlay.suggestions` — German search terms (`Kleid`, `Trägerkleid`, `Sommerkleid`…),
        because these are *queries* the ACP sends to `/search?q=`, not labels. Same call the French
        bundle makes (`robe`, `robe débardeur`).
      - `category.homepage.shopDressesQuery` — `"Kleid"`, for the same reason (`Homepage.tsx` puts it
        straight into the hero CTA's query string).
      - `cart.checkout.placeholders.expiry` — `MM/JJ`, since `YY` is `Jahr` in German.
      - Currency figures in `demo.closing` reformatted to German convention (`80.000 €`, not
        `€80,000`).
- [x] `scenarios.json`'s embedded markup survived: every `<strong>`, `<code>` and
      `<div class="story-tracking-hint">` is preserved, along with the `\n      ` indentation inside
      each bubble.

## SDK contract used
- None. Translation content only; no query, no field list, no request shape touched.

## Tracking (required)
- Unchanged. `demo.trackingMeaning.*` and `scenarios.demoDress.steps.*` describe tracking in prose;
  the events they describe fire from unchanged code.

## UI constraints
- German is the longest of the three languages, and several of these strings sit in tight boxes —
  the ACP's `.autocomplete-add-to-cart` ("In den Warenkorb") is explicitly `white-space: nowrap` and
  must stay on one line, and the facet chips wrap. **This could not be checked visually** (see below),
  so it is the first thing to look at when a German catalog does exist.

## Verified
- `node` structural check across all three languages: no missing/extra keys, placeholder sets match
  per key, array lengths match. Output: `STRUCTURE OK`.
- All 30 files parse as JSON (the check reads them with `JSON.parse`).
- `npx tsc --noEmit` clean in the `example` container; `✓ Compiled`, `/example/com_fr` still 200.
- **Not verified in a browser, and not verifiable today**: with no `de_DE` localized catalog there is
  no URL that renders German. Reaching it needs a German localized catalog created in the API and
  indexed — deliberately not done here, since that changes fixture data rather than the app.

## MUST NOT change
- `src/locales/de/search.json`'s `overlay.suggestions` and `category.json`'s `shopDressesQuery` must
  stay *German search terms*, not translated labels. They are sent to the search engine; turning them
  back into English or into prose breaks the hero CTA and the ACP suggestion links (see
  `specs/bugfix-hero-cta-empty-query.md` for the shape of that failure).
- Key parity with `en/`. A missing key renders as the raw key path (golden rule 5) — re-run the
  structural check after any edit rather than trusting a diff.
- The `\n      `-indented HTML inside `scenarios.demoDress.steps.*.bubble` — it is injected as markup,
  and reflowing it changes the rendered story layout.
