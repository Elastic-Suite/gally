# Feature: rebuild the guided demo (story, intro, audience modes)

## Status: paused - not started

## Page/Component: src/contexts/DemoContext.tsx, src/hooks/useStoryActions.ts, src/scenarios/, src/components/{IntroScreen,StoryCompanion,AppShell}.tsx, src/views/ClosingPage.tsx, src/locales/\*/{demo,scenarios}.json, src/styles.css

## Why this file exists

The guided demo was paused during the Next.js migration. The decision is in
`specs/plan-ssr-seo.md:325-356`: carry the code across unchanged, do not repair it, rebuild it
later. Since then about ten feature commits (catalogs, header, cart, checkout,
recommendations) have changed the app around it, and none of them touched the scenario.

This file is the single source for that rebuild. `storytelling.md` keeps the original story
intent, but its routes, queries, cart contents and file table describe an older app.

State checked on 2026-10-05, at commit `cb97225b`.

## Current state

### It cannot be started

- `StoryCompanion` is mounted (`src/components/AppShell.tsx:74`), but renders nothing unless
  `storyActive` is true (`src/components/StoryCompanion.tsx:22`).
- The only caller of `startStory()` is `IntroScreen` (`src/components/IntroScreen.tsx:11`).
- The intro never shows. `introSeen` starts at `true` (`src/contexts/DemoContext.tsx:39`) and
  nothing calls `setIntroSeen(false)`. The gate is `AppShell.tsx:47-50`.
- There is no other entry point: no URL parameter, no header control, no resume pill.

### Side effect on the live app (not fixed, by decision)

`audience` starts at `'direction'` (`DemoContext.tsx:40`), and only `IntroScreen` can change it.
`.mode-direction .expert-only` hides elements (`src/styles.css:3243`), so in the normal app:

- the live EventLog panel never shows (`AppShell.tsx:69`);
- the `/explain` footer link never shows (`src/components/SectionLinks.tsx:48`). The page is
  only reachable by typing its URL.

The rebuild must decide what audience mode does, or this stays hidden.

### The five steps against current markup

Scenario: `src/scenarios/demo-dress.ts`. Engine: `src/hooks/useStoryActions.ts`. Every
navigation goes through `pushLocale` (`useStoryActions.ts:39-41`), so the `[locale]` prefix is
handled.

| Act | Action                                              | Route                                                         | Targets                                                                                 | Status                                                                                                                                                |
| --- | --------------------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `type_and_search` "tank dress" (`demo-dress.ts:17`) | `/` then `/search?q=`                                         | `.search-bar-wrapper` (`src/components/SearchBar.tsx:195`)                              | Target exists. Not checked since the header search redesign: typing may open the search overlay over the page (guess).                                |
| 2   | `highlight_sequence` (`demo-dress.ts:25`)           | `/category/__first__`, resolved at `useStoryActions.ts:61-66` | `.facets-sidebar` (`Facets.tsx:61`), `.facet-group` (`Facets.tsx:242`)                  | Works. The first-category logic duplicates `defaultListingPath` (`src/sdk/categoryTree.ts:21`).                                                       |
| 3   | `highlight_sequence` (`demo-dress.ts:33`)           | `/explain`                                                    | `.explain-results-page`, `.explain-rank-card` (`src/views/ExplainPage.tsx:128,145,147`) | Targets exist. The page hardcodes the API URL and admin credentials (`ExplainPage.tsx:7-9`) and has French-only strings (`:117,124`).                 |
| 4   | `add_to_cart_flow` (`demo-dress.ts:41`)             | search, first `.product-card`, product page                   | `.product-detail-actions .btn-coral` (`useStoryActions.ts:198`)                         | **Broken.** The button is now `btn btn-primary btn-lg` (`src/views/ProductPage.tsx:211-213`). The step retries, then falls back to `/cart` after 6 s. |
| 5   | `highlight_sequence` (`demo-dress.ts:48`)           | `/closing`                                                    | `.tracking-timeline`, `.timeline-item` (`src/views/ClosingPage.tsx:39-40`)              | Works.                                                                                                                                                |

### Hardcoded to one catalog

"tank dress" appears in `demo-dress.ts:15,17,39,41`, `ExplainPage.tsx:76`,
`ClosingPage.tsx:45`, and the act 1 bubble in `src/locales/*/scenarios.json`. Those products
exist only in the `default` fixtures (`com_en` / `com_fr`). The fashion, toolbox and papershop
catalogs do not have them, so the story would show poor or empty results there (guess, not
run). `ClosingPage.tsx:58` also hardcodes `count: 12`.

### Dead code

- `spotlight` (`src/scenarios/types.ts:23`) is set on every step but never read. On act 4 it
  names `.products-grid`, while the engine targets `.product-card`.
- `minimizeStory` (`DemoContext.tsx:68`) is never called, so the resume pill
  (`StoryCompanion.tsx:25-31`, CSS `styles.css:3490-3509`) never renders.
- `.story-cta` (`styles.css:3480`) and `.product-card.story-added` (`styles.css`, near 3960)
  match no element.
- `scenarios.demoDress.name` (`src/locales/en/scenarios.json:3`) is never read.
- The "Talk to sales" buttons on the closing page have no `onClick` and still use `btn-coral`
  (`ClosingPage.tsx:196,208`).

### Other notes for whoever rebuilds it

- The story panel offsets (`top: 70px` / `80px`, `styles.css:3377,3492`) predate the two-row
  header (`--header-height` 8.5rem, `styles.css:485`). The panel probably overlaps the header
  (guess).
- The toast builds HTML from a translation with `innerHTML` (`useStoryActions.ts:72`). The
  scenario bubbles in `scenarios.json` also carry markup.
- The product link regex `/\/product\/(.+)/` (`useStoryActions.ts:184`) would also capture a
  query string after the SKU.
- Locale parity is complete: `demo.json` and `scenarios.json` have the same keys in en, fr
  and de, and every `intro.*`, `story.*`, `toast.*` and `closing.*` key is used.

## Decisions to take before rebuilding

1. **Entry point.** Intro screen, URL parameter, header control, or several. Persisting
   `introSeen` and `audience` (localStorage or cookie) must not cause a hydration mismatch -
   see `specs/plan-ssr-seo.md:317-323`.
2. **Audience mode.** Keep the direction/marketing split or drop it. Today it only hides the
   EventLog and the `/explain` link.
3. **Catalog awareness.** Take the story queries and the closing timeline text from the
   active catalog instead of "tank dress".
4. **Act 3 target.** `/explain` (admin auth, French strings) or `/vector-search`, which is now
   a real keyword-vs-vector comparison (`src/views/VectorSearchPage.tsx`) and closer to what
   the story wants to show.
5. **Act 4 content.** The cart no longer has a bundle or a fixed "frequently bought together"
   list. It has a free-shipping bar (`CartPage.tsx:16`), an animated total and real
   cross-sells (`specs/feature-real-recommendations.md`). Write the act around that.
6. **Stable targets.** Use `data-story-target="..."` attributes instead of CSS classes, as
   proposed in `plan-ssr-seo.md`. That removes the class of breakage behind act 4. Design for
   streaming (target not there yet) and hydration (button there but not interactive yet).
7. **Panel behaviour.** Minimize and resume, position under the two-row header, and how it
   behaves when the search overlay is open.
8. **Closing page.** Keep or drop the hardcoded figures and pricing, and wire or remove the
   "Talk to sales" buttons.
9. **Cleanup.** Remove or reuse every item under "Dead code" above.

## Related specs

- `specs/plan-ssr-seo.md:325-356` - the pause decision and the stale selector
- `specs/bugfix-dynamic-ssr-false-bailout.md:94-96` - intro unreachable
- `specs/feature-nextjs-migration-phase1.md:128` - steps not repaired during migration
- `specs/feature-locale-segment-phase2.md:27` - story navigation under `[locale]` not checked
- `specs/feature-search-header-redesign.md` - search overlay that act 1 now types into
- `specs/feature-vector-search-comparison.md:185-187` - `/vector-search` and the story
- `specs/feature-real-recommendations.md` - current cart content for act 4
- `specs/bugfix-german-locale-untranslated.md:42-50,75` - markup inside scenario strings
- `specs/feature-add-to-cart-indigo.md` - the add-to-cart button restyle
- `specs/feature-quick-add-overlay.md:232` - records the same broken act 4 selector

## Acceptance criteria (for the rebuild)

- [ ] The story can be started from at least one entry point, with no hydration warning.
- [ ] All five acts run to the end on every catalog, in en, fr and de.
- [ ] Every engine target is a `data-story-target` attribute, not a CSS class.
- [ ] EventLog and the `/explain` link are visible in the normal app, whatever audience mode
      becomes.
- [ ] No dead code from the list above remains.
- [ ] `storytelling.md` is replaced or brought up to date.

## Tracking (required)

- The story fires no tracking itself. Acts 1 and 4 must trigger the normal `SEARCH`, `VIEW`
  and `ADD_TO_CART` events through the storefront components, as a visitor's clicks would.
