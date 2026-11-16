# Homepage sliders and blog list are rendered only in the browser

## Status: open (improvement)

## Observed

The server HTML of the homepage and of `/blog` holds no product or blog card, only skeletons (52
and 48 skeleton matches). A crawler without JavaScript sees none of that content.

## Context

The ADR [Give navigation feedback from the client, not from loading.tsx](../decisions/rendering/2026-11-13-no-loading-boundary-on-crawlable-routes.md)
covers the product, category and blog post pages, not these two lists.

## Source

`bugfix-ssr-product-list-behind-suspense.md`, lines 145-147 (removed; see
`git show 2745ce7c:front/example-app/specs/bugfix-ssr-product-list-behind-suspense.md`).
