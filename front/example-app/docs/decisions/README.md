# Architecture Decision Records

Decisions about example-app, written in [MADR 4](https://adr.github.io/madr/) format.

ADRs are written for people first. They are read in code review, by a new team member, or by
anyone about to undo something that looks odd. Write them in plain language, and keep only
what a person needs to understand the decision. An LLM tool reads them too, but it is not
the audience.

## Where things live

All documentation sits under `docs/`, one folder per role. See
[2026-11-13-where-documentation-lives.md](2026-11-13-where-documentation-lives.md).

-   `docs/*.md` - how the app works now. Kept up to date.
-   `front/example-app/docs/decisions/` - why: lasting decisions and the options rejected. Never edited; a new ADR
    supersedes an old one.
-   `docs/specs/` - what one change did and how it was checked. Frozen once `implemented`.
-   `docs/bugs/` - what is still broken, until it moves to the issue tracker.

When a spec and an ADR disagree on the reasons, the ADR wins. When a spec and the current-state
docs or the code disagree on behaviour, the docs and the code win.

## When to write one

Ask these four questions about the decision:

1. Is it information that could not be said in a commit message or a code comment? If yes,
   it is an ADR.
2. Do we need to record the choice we did not make, and why? If yes, it can be an ADR.
3. Does the decision set the structure that later code will follow? If yes, it can be an ADR.
4. Could someone, or an LLM tool, work out why we did this from the code alone? If no, it can
   be an ADR.

Decisions are based on how the product was used or will be used: catalogs of very different
sizes, and different kinds of client. A change that breaks existing behaviour needs an ADR
saying why.

## Writing a new ADR

1. Pick the topic folder: one folder per topic, named after the part of the product the
   decision is about. Reuse an existing folder when one fits, and create one when the topic
   is new. Decisions about the ADR process itself stay at this level.
2. Copy `adr-template.md` into it as `YYYY-MM-DD-short-title.md`.
3. Fill in the sections. Delete the optional ones you do not need, along with their
   `<!-- This is an optional element -->` comments and the `{placeholder}` text. In the
   front matter, `ticket` is the Redmine ticket number, `#XXXXXX`, when the work has one.
   Take it from the branch name when it carries one (`feat-1408943-adr` gives `#1408943`).
   It is optional: drop the line when no ticket applies.
4. Add a line to the index below, under its topic.

`adr-template.md` is MADR 4.0.0's `template/adr-template.md`, copied from
<https://github.com/adr/madr/tree/4.0.0/template> (license: MIT or CC0-1.0) with one line
added: the optional `ticket` field. Change nothing else, so a later MADR version can be
compared with a plain diff.

## Naming

Files are named `YYYY-MM-DD-short-title.md`.

-   The date is the day the file is first committed. It never changes afterwards, so links to
    an ADR stay valid.
-   A date is used instead of MADR's default `NNNN-` number. Two branches can then add an ADR
    at the same time without both taking the same number.
-   When a decision is older than its ADR, the ADR's Context names the commit that made it.
-   A later status change, such as `superseded`, goes in the `date` and `status` front matter,
    not in the file name.
-   Moving an ADR to another topic folder breaks links to it. Pick the folder with care.

## Index

### ADR process

-   [2026-11-09 - Record architecture decisions as MADR files](2026-11-09-adopt-architecture-decision-records.md) - accepted
-   [2026-11-13 - Keep all documentation under docs/, one folder per role](2026-11-13-where-documentation-lives.md) - accepted

### Rendering

-   [2026-11-13 - Keep demo scaffolding off the server with a mounted gate](rendering/2026-11-13-gate-demo-scaffolding-on-mount.md) - accepted
-   [2026-11-13 - Keep demo scaffolding out of the server HTML with ssr: false](rendering/2026-11-13-keep-demo-scaffolding-out-of-server-html-with-ssr-false.md) - superseded by [Keep demo scaffolding off the server with a mounted gate](rendering/2026-11-13-gate-demo-scaffolding-on-mount.md)
-   [2026-11-13 - Keep shared UI mounted across navigation and refetches](rendering/2026-11-13-keep-shared-ui-mounted-across-navigation.md) - accepted
-   [2026-11-13 - Move to Next.js 16 App Router, keep React 19, one client boundary first](rendering/2026-11-13-next-16-app-router.md) - accepted
-   [2026-11-13 - Give navigation feedback from the client, not from loading.tsx](rendering/2026-11-13-no-loading-boundary-on-crawlable-routes.md) - accepted
-   [2026-11-13 - Answer a real 404 for a missing page, checked in page.tsx](rendering/2026-11-13-real-404-for-missing-pages.md) - accepted
-   [2026-11-13 - Seed client hooks with the server's data, fetched with the same request](rendering/2026-11-13-seed-client-hooks-from-server-fetch.md) - accepted
-   [2026-11-13 - Server Component route shells, client views in src/views, shared mappers in src/sdk](rendering/2026-11-13-server-component-route-shells.md) - accepted

### Routing

-   [2026-11-13 - Put the localized catalog code in the URL and resolve it on the server](routing/2026-11-13-localized-catalog-code-in-url.md) - accepted

### Internationalization

-   [2026-11-13 - Set the i18next language during render, on server and client](i18n/2026-11-13-set-language-during-render.md) - accepted
-   [2026-11-13 - Treat search terms as queries for each catalog and language, not as translated labels](i18n/2026-11-13-search-terms-are-localized-queries.md) - accepted

### Configuration

-   [2026-11-13 - Pick the API URL by environment: SSR_API_URL on the server, NEXT_PUBLIC_API_URL in the browser](configuration/2026-11-13-api-url-by-environment.md) - accepted
-   [2026-11-13 - Read media host and installed bundles from Gally at request time](configuration/2026-11-13-read-configuration-from-gally.md) - accepted

### Search

-   [2026-11-13 - Look up a product by its SKU with an exact filter, and keep a search query](search/2026-11-13-product-sku-lookup-by-exact-filter.md) - accepted

### Catalog

-   [2026-11-13 - Take catalog-dependent labels and lists from the API, not from front lists](catalog/2026-11-13-catalog-labels-and-lists-come-from-the-api.md) - accepted
-   [2026-11-13 - Build the product field selection per catalog](catalog/2026-11-13-product-field-selection-per-catalog.md) - accepted
-   [2026-11-13 - Read indexed `_source` data by three fixed rules](catalog/2026-11-13-rules-for-reading-indexed-source-data.md) - accepted

### Cart

-   [2026-11-13 - Keep the cart per catalog in localStorage, one line per sku and variant](cart/2026-11-13-cart-per-catalog-in-local-storage.md) - accepted

### Security

-   [2026-11-13 - Keep API credentials out of client code, and keep explain switched off](security/2026-11-13-no-api-credentials-in-client-code.md) - accepted

### Styling

-   [2026-11-13 - Treat docs/design-system.md as the contract for colours, sizes and components](styling/2026-11-13-design-system-is-the-token-contract.md) - accepted
