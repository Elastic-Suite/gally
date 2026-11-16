---
status: 'superseded by [Keep demo scaffolding off the server with a mounted gate](2026-11-13-gate-demo-scaffolding-on-mount.md)'
date: 2026-11-13
decision-makers: example-app team
---

# Keep demo scaffolding out of the server HTML with ssr: false

## Context and Problem Statement

This decision is older than this ADR. It was made in the SSR migration plan,
[plan-ssr-seo.md](../../specs/plan-ssr-seo.md), and repeated in
[feature-rsc-shells-phase3.md](../../specs/feature-rsc-shells-phase3.md). Both were committed
in `43f5c64e` (2026-08-07). That same commit already contains the replacement, so this version
was never committed on its own.

The storefront moved to server rendering for SEO. The demo also has scaffolding around the
shop: `IntroScreen`, `StoryCompanion`, `EventLog`, `TrackingInsights` and `SearchExplain`. The
plan calls them "zero SEO value and pure client behaviour". The demo is the product, so they had
to keep working, but a crawler should not read them.

The guided story actions in `useStoryActions.ts` already had stale selectors. The plan decided
to carry them across unchanged, not to repair them, and to rebuild the guided demo later.

How do we keep the scaffolding working for users and out of the crawlable HTML?

## Considered Options

-   Load the five components with `next/dynamic` and `ssr: false`

No alternative was recorded.

## Decision Outcome

Chosen option: "Load the five components with `next/dynamic` and `ssr: false`", because the plan
says this one mechanism keeps the scaffolding identical for users and absent from the HTML a
crawler reads. `/explain` and `/closing` are client-rendered and `noindex`.

### Consequences

-   Good, because the scaffolding stays out of the server HTML.
-   Good, because no time goes into the guided story during the migration.
-   Bad, because `ssr: false` works by throwing during the server render. This was found later
    and is why the decision was replaced.

### Confirmation

Superseded. The part that still holds, scaffolding absent from the server HTML, is checked as
described in the replacing ADR.

## More Information

Replaced by
[2026-11-13-gate-demo-scaffolding-on-mount.md](2026-11-13-gate-demo-scaffolding-on-mount.md).
