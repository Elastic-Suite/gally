# Gally back office - the `pwa` application

This folder belongs to the monorepo (`Elastic-Suite/gally`). It is the Next.js **pages router**
app that serves the back office, and it is intentionally almost empty: every page is a thin
wrapper re-exporting a page component from `@elastic-suite/gally-admin-components`.

**To change back-office behaviour or UI, you almost always edit `../gally-admin`, not this
folder.** That is its own git repo, with its own `AGENTS.md`: packages, checks, ADRs.

## Pages and URLs

`pages/` maps 1:1 to back-office URLs:

-   `admin/dashboard`
-   `admin/analyze/{results,search_usage}`
-   `admin/merchandize/{categories,boost/*,recommender/*}`
-   `admin/search/{facets,vector,thesaurus/*,configuration/attributes}`
-   `admin/settings{,/user/*,/[...slug]}`
-   `admin/importexport{,/[...slug]}`
-   `login`, `forgot-password`, `reset-password`, `swagger/docs`

Each one re-exports the matching component from
`../gally-admin/packages/components/src/pages/admin/`.

## Assets

`public/locales` and `public/images` come from `../gally-admin/packages/components/public/`. The
`prepare` script symlinks them in, so edit them in gally-admin.

The app runs in the `pwa` container and is served at `/` by the router (see `../../docker/AGENTS.md`).
