---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Treat search terms as queries for each catalog and language, not as translated labels

## Context and Problem Statement

This decision is older than this ADR. It was made in two commits:

-   Commit `f9ef415b` (2026-08-07): the hero button's search term is localized. See
    `bugfix-hero-cta-empty-query.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-hero-cta-empty-query.md`).
-   Commit `43f5c64e` (2026-08-07): German search terms stay German queries. See
    `bugfix-german-locale-untranslated.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-german-locale-untranslated.md`).

The hero button read "Shop dresses" but linked to `/search?q=`, with an empty query. The search
page treats an empty query as "browse everything", so the button lost its intent with no error.

Some strings in the translation files are not shown to the visitor. They are sent to the search
engine. A translator who treats them as labels, or turns them into prose, breaks the link they
feed. The hero CTA shows the shape of that failure.

How should the app store a search term that a link or a demo sends to the engine?

## Considered Options

-   A localized query string per catalog and language
-   One literal English query, `q=dress`, for every language

## Decision Outcome

Chosen option: "A localized query string per catalog and language". A literal `dress` did work,
because it returned 17 products on `com_fr` too. But a French button reading "Découvrir les robes"
that searches `dress` is wrong on inspection.

-   The hero CTA's term lives in `category.json` under `homepage.hero.shops.<catalogCode>.query`,
    in each language. `Homepage.tsx` puts it into `/search?q=` through `encodeURIComponent`.
-   The term is a search query in the catalog's language, such as `robe` or `Kleid`. It is not a
    translation of the button label.
-   The label and the query move together. If the label stops being about dresses, the query
    changes in every language.
-   The vector search examples follow the same rule. `VECTOR_DEMO_QUERIES` in
    `src/sdk/vectorSearch.ts` is keyed by localized catalog code.

### Consequences

-   Good, because each catalog searches words its own index holds.
-   Bad, because a translator must know which keys are queries. Nothing in the JSON marks them.
-   Neutral, because the guided tour still searches `tank dress` in every language
    (`src/scenarios/demo-dress.ts`). It is outside this rule today.

### Confirmation

-   `grep -n '"query"' src/locales/*/category.json`: each language holds a term in its own
    language, not a copy of the English one.
-   On a French catalog, the hero button lands on `/search?q=` with the French term and shows
    results.

## More Information

The hero CTA moved to one label and query per catalog in `docs/specs/feature-hero-cta-per-catalog.md`.
