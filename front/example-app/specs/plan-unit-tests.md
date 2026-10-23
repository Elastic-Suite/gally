# Plan: unit and component tests for the example app

## Status: draft - rough estimate, nothing scaffolded

## Summary

About **20 days** of one developer for broad coverage, about **22 days** with a margin for risk.
A first useful slice (setup, the SDK helpers, `useSearch` and `Facets`) is about **6 days**, and it
covers the code where most past bugs were found.

Runner: **Vitest**, chosen by the developer (this plan first recommended Jest through `next/jest`).
The setup is recorded in `chore-vitest-setup.md`, along with the workflow: one aspect at a time,
summary validated before any test is written.

## Where things stand

-   `jest` is a devDependency. `package.json` runs `jest --passWithNoTests`. There is no Jest config and
    no test file, so CI passes on zero tests.
-   The front coverage report step was disabled in CI because the report was empty (commit 85699ecb).
-   No Testing Library, no jsdom environment, no mocks for the SDK or `next/navigation`.
-   Size of the code under test:

| Folder           | Files | Lines | Kind of code                                                                  |
| ---------------- | ----- | ----- | ----------------------------------------------------------------------------- |
| `src/sdk`        | 17    | 1631  | Mostly pure helpers (about 70 exports) plus the SDK and server fetch wrappers |
| `src/hooks`      | 8     | 1259  | Data fetching, tracking, UI state                                             |
| `src/contexts`   | 9     | 839   | Cart, catalog, navigation, locale                                             |
| `src/components` | 33    | 4417  | UI, some with logic inside (facets, autocomplete)                             |
| `src/views`      | 12    | 3132  | Client page bodies                                                            |
| `app/`           | 19    | 1107  | Async server components: route shells, metadata                               |

## What is out of scope for Jest

-   **`app/**/page.tsx` and layouts.\*\* These are async server components. Jest and Testing Library
    cannot render them, and the Next docs recommend end-to-end tests for them. Playwright against the
    Docker stack would be a separate estimate.
-   Visual regressions (CSS, tokens). The `gally-mockup` capture script covers that by hand today.
-   Calls to a real Gally API. Every test mocks the SDK at the module boundary.

## Phases and rough ranges (days, one developer)

Best / likely / worst. E is the PERT mean, (best + 4 x likely + worst) / 6.

| #   | Phase                                 | Best | Likely | Worst | E        |
| --- | ------------------------------------- | ---- | ------ | ----- | -------- |
| 0   | Setup                                 | 1    | 1.5    | 2.5   | 1.6      |
| 1   | `src/sdk` pure helpers                | 2    | 3      | 5     | 3.2      |
| 2   | Hooks and contexts                    | 3    | 4.5    | 7     | 4.7      |
| 3   | Components (targeted)                 | 4    | 6      | 9     | 6.2      |
| 4   | Views (integration with a mocked SDK) | 3    | 4      | 6     | 4.2      |
| 5   | Docs and the definition of done       | 0.5  | 0.5    | 1     | 0.6      |
|     | **Total**                             |      |        |       | **20.3** |

Committed total, ΣE + √(Σσ²): about **21.6 days**.

### 0 - Setup

-   `jest.config.ts` via `next/jest`, `jsdom` environment, `@testing-library/react`,
    `@testing-library/jest-dom`, `@testing-library/user-event`.
-   A render helper that wraps the real providers: i18n loaded with the real locale files, catalog,
    config, cart. A test must see translated text, not keys - that is how the chip label bug showed up.
-   Mocks: `next/navigation` (router, params, pathname with the locale segment), the
    `@elastic-suite/gally-sdk` managers, and fixture responses copied from a real API response.
-   Run it in the `example` container. Turn the CI coverage step back on once there is something to
    report.

### 1 - `src/sdk` pure helpers

The cheapest tests with the most value. Field projection (`fields.ts`, `productFields.ts`,
`cmsFields.ts`), SEO (`seo.ts`), catalog and locale resolution (`catalogs.ts`, `catalogSwitch.ts`),
`categoryTree.ts`, `vectorSearch.ts`, `axisLabels.ts`, and `components/swatchColors.ts`.
Priority: the traps in `docs/sdk-reference.md` - an empty `selectedFields`, `cms_page` projection
with raw `_source` names, `getBaseUri()` returning `SSR_API_URL` on the server only.

### 2 - Hooks and contexts

`useSearch` first: filters, sort, pagination, `product_search` with an empty query for browsing.
Then `CartContext`, `NavigationContext`, `CatalogContext` (the URL is the state, there is no
`useState` - a test should fail if one is added back), `useTracking` (the right event fires, once).
11 of the 17 files fetch or use effects, so each one needs the SDK mock and async assertions.

### 3 - Components, targeted

Not all 33 files. One regression test per `specs/bugfix-*.md` that touches a component, plus the
behaviour listed in the facet and autocomplete specs:

-   `Facets`: hide-single-value, active chips and their labels, "Clear all", load more, slider sync.
-   `SearchOverlay`: keyboard navigation, highlighted product, add to cart.
-   `ProductCard`, `CategoryNav`, `LocaleLink` (keeps the locale segment).

Some logic sits inside components (for example the chip label lookup in `Facets.tsx`). Moving it into
plain functions is part of the cost here and makes phase 1 style tests possible.

### 4 - Views

One integration test per main view (`SearchPage`, `CategoryPage`, `ProductPage`, `BlogPage`) with
fixture responses: initial data from the server is shown, a filter change triggers a new search,
the empty and zero-result states are correct.

### 5 - Docs

Add "tests updated" to the definition of done in `AGENTS.md`. Add a "Tests" line to
`specs/_template.md` so each spec names the test that checks it.

## If Claude Code writes the tests

The table above is a developer writing every test by hand. Here, Claude writes the tests from
`specs/` and the code, and a developer reviews them and makes the decisions.

**Input:** 104 specs, 691 behaviour lines (`- [ ]` / `- [x]`), 124 of them in the 29 bugfix specs.
Roughly 55-65% can be checked by Jest. The rest is CSS, layout or server-rendered output. That leaves
about **380-450 tests**.

| Phase                               | Claude sessions | Wall clock (Claude) | Developer review |
| ----------------------------------- | --------------- | ------------------- | ---------------- |
| 0 Setup, with the U1 spike first    | 1               | 1-2 h               | 0.5 d            |
| 1 `src/sdk` helpers                 | 1               | 2-3 h               | 0.5 d            |
| 2 Hooks and contexts                | 2               | 3-5 h               | 1 d              |
| 3 Components and bugfix regressions | 3-4             | 5-8 h               | 1.5 d            |
| 4 Views                             | 2               | 3-5 h               | 1 d              |
| 5 Docs                              | with phase 0    | -                   | -                |
| **Total**                           | **9-10**        | **15-25 h**         | **about 4.5 d**  |

-   **The developer time is mostly reading tests**, not writing them. The question for each test is
    whether it checks the behaviour or only repeats what the code does today.
-   **Expect spec and code to disagree.** A test written from a ticked spec line that fails means the
    spec is wrong, the code is wrong, or the line was never true. The chip-label spec was one of these
    (`bugfix-facet-chip-labels-lost.md`). Guess: 5-10% of lines, so **20-40 decisions** for the
    developer, about 1-2 extra days. Claude records each one in a list. It does not choose by itself
    between editing the spec and editing the code.
-   **One phase per session.** Each test run goes to a subagent, so long Jest output stays out of
    the session. Long sessions cost more in context than they save.
-   **Effort:** `high` for setup and phase 3, where the mocks and the async behaviour are complex.
    `medium` is enough for phases 1 and 4.

Total, developer side: about **5.5-6.5 days** of review and decisions, against about 20 days by hand.

## Hypotheses

-   H1 - The SDK can be mocked at the module boundary without starting a Gally instance. If it cannot,
    phase 0 needs an HTTP mock layer (msw), about +1 to 2 days.
-   H2 - Client views render under jsdom with `next/navigation` mocked, with no Next runtime. If they
    need more, phase 4 moves to Playwright.
-   H3 - There is no coverage percentage to reach. The target is the behaviour written in `specs/`.
    A fixed threshold (for example 80% lines) would add roughly phase 3 again.
-   H4 - The work is done by someone who already knows the app and its specs.

## Unknowns

-   U1 - Whether `@elastic-suite/gally-sdk` and `ionicons` load under Jest without extra
    `transformIgnorePatterns` work. ESM-only packages are the usual cost of a Jest setup. A half-day
    spike at the start of phase 0 settles it, and it is the one result that could make Vitest the
    better choice.
-   U2 - Memory in the container. `tsc` already needs an 8 GB heap there. Jest with jsdom may need
    `--maxWorkers` limits in CI.
