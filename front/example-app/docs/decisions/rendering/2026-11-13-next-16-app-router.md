---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Move to Next.js 16 App Router, keep React 19, one client boundary first

## Context and Problem Statement

This decision is older than this ADR. Commit `43f5c64e` (2026-08-07) made it, as phase 1 of
a four-phase plan. It is recorded in
[plan-ssr-seo.md](../../specs/plan-ssr-seo.md) and
[feature-nextjs-migration-phase1.md](../../specs/feature-nextjs-migration-phase1.md).

The example app was a Create React App single-page app. A crawler saw a near-empty page. The
later phases need React Server Components to render product, category and blog pages on the
server.

The sibling `front/pwa` app already uses Next.js 13 with the Pages Router. Which Next.js
version and router should the example app use, and how much should the first step change?

## Decision Drivers

-   Later phases need React Server Components.
-   The app already runs React 19. A React upgrade would add risk.
-   The `pwa` app must be able to stay on its own versions.
-   The first step must be easy to review: same behaviour before and after.

## Considered Options

-   Next.js 16 App Router
-   Next.js 13 Pages Router, like `pwa`

## Decision Outcome

Chosen option: "Next.js 16 App Router", because the Pages Router has no React Server
Components, and they are the point of the later phases.

-   Next 16 accepts React 19, so React was not upgraded.
-   `example-app` nests its own `react` and `typescript`. The workspace hoists React 18 for the
    other apps. So `pwa` can stay on Next 13.
-   Translations stay on `react-i18next`. `next-i18next` was rejected because it works with the
    Pages Router only. Server-side strings come from the locale segment instead.
-   Phase 1 has exactly one `'use client'` boundary, at `app/providers.tsx`, just below the root
    layout. Every component still renders on the client. Pushing the boundary down was left to
    phase 3, so phase 1 would behave the same as before and stay reviewable.

### Consequences

-   Good, because the risk of the framework swap sits in one change with no behaviour change.
-   Good, because the later phases can use Server Components without changing framework again.
-   Bad, because phase 1 alone delivers no SEO. A crawler still sees a near-empty page.
-   Bad, because the monorepo now runs two Next.js majors and two React majors side by side.
-   Neutral, because `params` and `searchParams` are async from Next 15. Every dynamic route
    must `await` them.

### Confirmation

-   `grep '"next"' front/example-app/package.json` shows `^16.3.0`.
-   `grep -rln next-i18next front/example-app/src front/example-app/app` finds nothing.
-   `head -1 front/example-app/app/providers.tsx` shows `'use client'`.

## More Information

The plan names a fallback if Next 16 proved unstable: Next 15.3.9, with the same architecture
and the same React 19. The app is still on Next 16.

Phase 3 moved the product, category and blog article routes to Server Components. Pushing the
boundary further down inside `Header`, `Facets` and `SearchBar` was left out on purpose. See
[feature-rsc-shells-phase3.md](../../specs/feature-rsc-shells-phase3.md).
