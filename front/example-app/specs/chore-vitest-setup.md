# Chore: Vitest test environment

## Status: implemented

## Page/Component: vitest.config.mts, src/test/setup.ts, package.json scripts

## Behaviour (testable)

-   [x] `yarn test` runs `vitest run` over `src/**/*.test.{ts,tsx}` in a jsdom environment.
-   [x] `yarn test:ci` runs the same suite with coverage and writes `coverage/cobertura-coverage.xml`,
        the file the CI coverage step read before it was turned off (commit 85699ecb).
-   [ ] `yarn test:watch` runs Vitest in watch mode.
-   [x] `yarn test:capture-fixtures` recaptures the real API documents in `src/test/fixtures/api/`
        (see `test-plan-data-layer.md`). Its test file is skipped in `yarn test` and `yarn test:ci`.
-   [x] Coverage counts `src/` and `app/` (added 2026-10-23: the route files were tested but not
        counted). `app/providers.tsx` is rendered for real by `src/test/providers.test.tsx`;
        `app/layout.tsx`, the static HTML shell and metadata, is not tested.
-   [x] Every test file gets the `@testing-library/jest-dom` matchers and DOM cleanup from
        `src/test/setup.ts`. A test that renders translated text imports `src/i18n` itself (the real
        instance and locale JSON); the shared setup does not, because it runs once per file.
-   [x] Files that render nothing (source scans, helpers, route functions) start with
        `// @vitest-environment node`, so they skip the jsdom start-up.
-   [x] The smoke test `src/components/Breadcrumb.test.tsx` passes. It renders a translated client
        component through `LocaleLink` and `next/link`, which proves the TSX transform, jsdom, React 19,
        Testing Library, the locale files and the Next client imports all work together.

## How tests get written

One aspect of the app at a time. For each aspect: read its specs, write a summary of what will be
tested, get it validated, then write and run the tests. Tests follow the specs but also pin what the
code does today. When a spec line and the code disagree, list it for a decision - do not choose
between editing the spec and editing the code. A test that later fails against a requested change is
a reason to ask whether the change is right, not something to update without asking.

Plan and rough estimate: `plan-unit-tests.md`.

## Decisions

-   **Vitest, not Jest** - chosen by the developer. `jest` was removed from devDependencies.
-   **jsdom, not happy-dom** - closer to a real browser for the accessibility queries Testing Library
    relies on. The SDK package uses happy-dom; the two do not share a config.
-   **Versions are held back for Node 20**, the version the front containers run. Newer releases set
    `engines.node` above 20 and `yarn add` refuses them:
    -   jsdom stays on 26.x - newer jsdom pulls in `data-urls@8`, which needs Node 22.14.
    -   `@testing-library/jest-dom` stays on 6.9.x - 6.10 needs Node 22.
    -   `@vitejs/plugin-react` stays on 5.x - 6.x needs Vite 8, and Vitest 3.2 supports Vite up to 7.
-   **Testing Library 16 in this workspace.** The copy hoisted at `front/node_modules` (13.x) belongs to
    pwa and targets React 18. This app is React 19.
-   **No globals.** Tests import `describe`/`it`/`expect` from `vitest`, so no global types are needed
    and `tsc --noEmit` checks test files like any other file.

## MUST NOT change

-   `app/**` is not unit-tested here. Those files are async server components; jsdom cannot render
    them. They belong to `front/e2e`.
-   Tests never call a real Gally API. The SDK is mocked at the module boundary.
-   The coverage file stays `coverage/cobertura-coverage.xml`, so the CI step can be restored by a
    revert.
