# Feature: Vector search page wording for a demo audience

## Status: implemented
## Page/Component: src/views/VectorSearchPage.tsx, src/sdk/vectorSearch.ts, src/locales/{en,fr,de}/vectorSearch.json, src/locales/{en,fr,de}/common.json, app/[locale]/vector-search/page.tsx, src/styles.css

## Problem
The page is shown in demos, but parts of it read like a developer tool:
- A warning on every non-English catalog said the model only understands English and told the visitor to
  switch catalog.
- The empty state told the visitor to check that a premium bundle was installed and to run
  `make sf c=gally:vector-search:upload-model`. Nobody watching a demo can act on that.
- Each panel had a technical subtitle (BM25, OpenSearch kNN, embeddings).
- French and German catalogs had no suggested queries.
- The page said "semantic search". The app's name for the feature is "vector search".

## Behaviour (testable)
- [x] No language warning on any catalog. `isModelLanguage()` and `.vector-language-note` are deleted.
- [x] The two panel headers show only their title and result count. The `keyword.subtitle` and
      `vector.subtitle` keys and the `.vector-panel-head p` rule are deleted.
- [x] The empty vector panel says, in plain words, that vector search returned no results for this query and
      suggests trying again or picking another suggestion. It names no command, bundle or model.
- [x] "Semantic search" is "Vector search" / "Recherche vectorielle" / "Vektorsuche" everywhere the app names
      the feature: breadcrumb, page title, intro, panel title, empty state, header nav and `<title>`.
      Blog articles that explain vector search in terms of meaning are content and stay as they are.
- [x] Every localized catalog of `com`, `toolbox`, `fashion` and `papershop` has its own suggestions in
      `VECTOR_DEMO_QUERIES`.

## How the French and German queries were picked
Candidates were run against the live index (`vectorSearchProducts`, and the keyword search for
comparison). A query was kept when its top vector hits were relevant, and preferred when keyword search
returned 0 results for it. Findings:
- Short phrases and synonyms work: `Füllfederhalter` gets no keyword match but returns every "Füllhalter".
  `Akkuschrauber` and `siège de bureau` behave the same way.
- Long intent sentences mostly fail, especially in toolbox ("protéger mes yeux en perçant").
- `com`'s product names are English in every locale, so `com_fr` gets only the few French queries that
  still land (`pantalon large` finds the palazzo and wide-leg pants).
The model is English-first, so the lists are best effort. Retest them when the model or the data changes.

## MUST NOT change
- The ranks-not-filters explanation stays in the closing callout (`.vector-footnote`), now its only place.
- The per-panel score labels, the result counts and both search requests are unchanged.
