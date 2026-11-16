---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Keep API credentials out of client code, and keep explain switched off

## Context and Problem Statement

This decision is older than this ADR. It was made in commit `daeab237` (2026-10-19). See
`bugfix-explain-admin-credentials.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-explain-admin-credentials.md`).

The explain query is admin-only. It needs a JWT from `/authentication_token`. Both explain
components logged in with hardcoded admin credentials, each with its own copy of `getToken()`.
Both are client components, so the credentials were in the JavaScript every visitor downloads.

The token can only be held safely on the server, and the app has no server route for it yet.

What should happen to the explain feature until it can get a token the safe way?

## Considered Options

-   Switch explain off behind a flag and keep its files
-   Delete the explain feature

## Decision Outcome

Chosen option: "Switch explain off behind a flag and keep its files", because the feature works
once a token is available. Only the way it got the token was wrong.

-   No API credentials in client code, ever. That covers `src/` and `app/`.
-   `EXPLAIN_ENABLED = false` in `src/sdk/explain.ts` switches the feature off. The "Search
    Intelligence" nav link is hidden (`SectionLinks.tsx`) and the Explain panel is not mounted
    (`AppShell.tsx`).
-   `/explain` still renders. It skips the fetch and shows `demo:explain.disabled`.
-   `getExplainToken()` in `src/sdk/explain.ts` is the only way to get the token. It rejects for now.
-   `ExplainPage.tsx` and `SearchExplain.tsx` stay in the code base.

To turn explain back on, get the token on the server, for example a route handler that reads
the credentials from the env and returns only the token. Then make `getExplainToken()` call it
and set `EXPLAIN_ENABLED` to true.

### Consequences

-   Good, because no visitor can read an admin login from the bundle.
-   Good, because turning explain back on is one server route and one flag, not a rebuild.
-   Bad, because the explain code is kept but not run, so it can break unnoticed.
-   Bad, because act 3 of the guided tour (`src/scenarios/demo-dress.ts`) still targets
    `/explain`. Its highlight finds no rank cards, retries and moves on. This was not checked in a
    browser.

### Confirmation

-   `grep -rn "admin@example" src app` finds nothing.
-   `grep -n "EXPLAIN_ENABLED =" src/sdk/explain.ts` shows `false`, unless a server-side token
    route exists.
-   `/example/<localized catalog>/explain` returns 200 and shows the disabled notice.
