---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Server Component route shells, client views in src/views, shared mappers in src/sdk

## Context and Problem Statement

This decision is older than this ADR. Commit `43f5c64e` (2026-08-07) made it, in phase 3 of
the SSR plan. It is recorded in
[feature-rsc-shells-phase3.md](../../specs/feature-rsc-shells-phase3.md) and in
`front/example-app/AGENTS.md`.

The product, category and blog article pages must show real content, metadata and JSON-LD to
a crawler without JavaScript. The interactive parts of those pages still need React hooks.
Where does each kind of code live, and how do server and client code share data mappers?

## Decision Drivers

-   Crawlable routes must render content and metadata on the server.
-   A Server Component cannot import from a module that imports React hooks. This fails at
    request time, not at build time, so the build does not catch it.
-   Next treats a `src/pages` folder as the Pages Router.

## Considered Options

No alternative layout was recorded. The sources record only the chosen structure.

## Decision Outcome

Chosen option: route shells on the server, views on the client, mappers in React-free modules.

-   Routes live in `app/[locale]/**/page.tsx`. For `product/[sku]`, `blog/[id]` and
    `category/[code]` the page is a Server Component. It fetches the data, emits metadata and
    JSON-LD, and passes the data down as `initialData`.
-   The components the routes render live in `src/views/`. The folder is not called `pages`,
    because Next would claim `src/pages` as the Pages Router.
-   Data mappers used by both server shells and client hooks live in `src/sdk/`
    (`fields.ts`, `productFields.ts`, `cmsFields.ts`). A server shell never takes a mapper from
    `src/hooks/` or `src/components/`.

The mapper rule came from a bug hit twice in phase 3. `getProductFields` sat in a
`'use client'` module, and `getCmsFields` sat in `useCms.ts`, which imports hooks. Both were
moved to `src/sdk/` and re-exported from the old file, so existing importers did not change.

### Consequences

-   Good, because the three crawlable routes render content, metadata and JSON-LD with no
    JavaScript.
-   Good, because a mapper has one React-free home that both sides can import.
-   Bad, because a wrong import only shows up when the page is requested. Review must catch it.

### Confirmation

-   `ls front/example-app/src/pages` fails: the folder does not exist.
-   `grep -rn "from '.*\(hooks\|components\)/" front/example-app/app` lists only
    `src/components/JsonLd` in the three shells and `AppShell` in the client file
    `app/providers.tsx`. `JsonLd` uses no hooks. Any other match needs a look in review.
-   `curl -s <host>/example/com_en/product/VD10 | grep '<title>'` shows the product name with
    no JavaScript run.

## More Information

The error text is: "You're importing a module that depends on `useEffect` into a React Server
Component". See the section "The trap this phase hit twice" in
[feature-rsc-shells-phase3.md](../../specs/feature-rsc-shells-phase3.md).
