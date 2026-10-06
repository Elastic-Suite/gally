# Chore: lint, format and typecheck scripts for the Next app

## Status: implemented (browser checks below still open)

## Page/Component: package.json, eslint.config.mjs, the whole of src/ and app/

## Why

CI runs `yarn typescript:ci`, `eslint:ci`, `prettier:ci` and `test:ci` from `front/`, and each
ends with `yarn --cwd example-app <script>`. The Next migration dropped those scripts from this
app, so the front CI jobs stopped with "command not found". See the dated notes in
`feature-nextjs-migration-phase1.md`.

## What is in place

- `typescript` / `typescript:ci`: `next typegen && tsc --noEmit`. `next typegen` writes the
  gitignored `next-env.d.ts`, so `tsc` works before any build. It uses the app's TypeScript 5.9,
  not the workspace's 4.8.3.
- `prettier` / `prettier:ci`: the shared `front/.prettierrc` style, no semicolons. The app
  declares `prettier` 2.7.1 in its own devDependencies so its bin does not fall through to the
  root link, which points to Storybook's nested 2.3.0. That version cannot parse
  `import { x, type Y }`. One reformat commit applied the style to about 200 files, including the
  Markdown in `specs/` and `docs/`.
- `eslint` / `eslint:ci`: ESLint 9 with flat config `eslint.config.mjs`
  (`next/core-web-vitals` + `next/typescript`), owned by this app only. pwa stays on ESLint
  8.23.1. ESLint 10 is blocked: `eslint-plugin-react`, `eslint-plugin-jsx-a11y` and
  `eslint-plugin-import`, all pulled in by `eslint-config-next`, accept ESLint up to 9.
- `test:ci`: `echo "no tests"`.

Rules turned off, each with its reason in `eslint.config.mjs`: `react/no-unescaped-entities`,
`@next/next/no-img-element` (Gally media at CSS sizes; `BrandLockup` does use `next/image`),
`@next/next/no-page-custom-font` (written for `pages/`; the font link is in the root layout),
`@typescript-eslint/no-require-imports` for root `*.js` config files (CommonJS).

## How the code was brought to zero findings

- `any` removed everywhere. Product rows are `SearchDocument` (`src/sdk/fields.ts`), the SDK's
  own row type given a name; it stays a record because the keys are the selected fields.
- "Latest value" refs are written in a `useLayoutEffect`, never during render
  (`useTracking`, `useStoryActions`, `NavigationContext`).
- State that resets when a value changes is adjusted **during render** against a `prev*` state,
  not in an effect: `CategoryPage` (code), `SearchBar` (query, pathname), `VectorSearchPage`
  (catalogCode), `Facets` slider (bounds key string; a string because `NaN !== NaN`),
  `ProductImage` (src), `NavigationContext` (`committed`).
- Effects that sync with something outside React keep their `setState`, with
  `// eslint-disable-next-line react-hooks/set-state-in-effect -- <reason>`: `useMounted`,
  `CartContext` (localStorage after hydration), and the loading flags in `ExplainPage`,
  `VectorSearchPage`, `useRecommendations` and `NavigationContext`.

## Behaviour (testable)

- [x] `typescript:ci`, `eslint:ci` (0 errors, 0 warnings) and `prettier:ci` exit 0 in the pwa
      container.
- [x] Home, category, search, vector search, product, explain and cart return 200 from the dev
      server, with no errors in its log.
- [ ] Category with a filter set and on page 2, switch category: back to page 1, filters cleared,
      no flash of the old results.
- [ ] Header search: highlight a row with the arrow key, type another letter: highlight clears.
- [ ] Leave `/search`: the header field and dropdown clear. On `/search` the term stays.
- [ ] Vector search: a direct load shows the catalog's first demo query, with no hydration
      warning in the console. A catalog switch reseeds it; typing is never overwritten.
- [ ] Price slider: narrow the range with another filter, then clear the price filter: the handles
      stay inside the track.
- [ ] Product with a missing image shows the placeholder; moving to one with a valid image shows
      the picture.
- [ ] Slow navigation still shows the skeleton after about 150 ms, gone as soon as the page commits.
- [ ] Guided demo actions (type and search, navigate, add to cart) still navigate under the locale.

Not checked: `next build`. In the local container it stops on symlinks into `~/web/gally-local`,
which the container cannot follow. CI does not have them.

## MUST NOT change

- Do not drop `prettier` from this app's devDependencies: the root bin link is the wrong version.
- Do not move the app back to ESLint 8 or the shared `front/.eslintrc.js`; `eslint-config-next`
  16 needs ESLint 9.
- Do not turn the render-time resets back into effects. The rule flags them, and the effect
  version paints one frame with stale state.
- A new `eslint-disable` needs a `-- reason`, like the existing ones.
