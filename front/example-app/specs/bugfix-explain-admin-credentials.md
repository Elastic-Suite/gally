# Bugfix: admin credentials shipped in the storefront bundle

## Status: implemented

## Page/Component: src/views/ExplainPage.tsx, src/components/SearchExplain.tsx, src/sdk/explain.ts

## Problem

The explain query is admin-only: it needs a JWT from `/authentication_token`. Both explain
components logged in with hardcoded admin credentials (`admin@example.com` / its password),
each with its own copy of `getToken()`. Both are client components, so the credentials were in
the JavaScript every visitor downloads. Root cause: a token that only the server should hold was
fetched from the browser.

## Behaviour (testable)

- [x] No credentials in `src/` or `app/`. The token comes from `getExplainToken()` in
      `src/sdk/explain.ts`, which rejects for now.
- [x] `EXPLAIN_ENABLED = false` in `src/sdk/explain.ts` switches the feature off:
  - [x] the "Search Intelligence" nav link is hidden (`SectionLinks.tsx`)
  - [x] the Explain panel is not mounted (`AppShell.tsx`)
  - [x] `/explain` still renders, skips the fetch and shows `demo:explain.disabled` (en, fr, de)
- [x] Typecheck and eslint pass. `/example/com_en/explain` returns 200 with the notice.
- [ ] Guided tour act 3 (`src/scenarios/demo-dress.ts`) still targets `/explain`. Its highlight
      finds no rank cards, retries 20 times and moves on (`useStoryActions.ts`). Not run in a
      browser.

## SDK contract used

- None. The explain query is a raw GraphQL call, unchanged.

## Tracking (required)

- No change.

## UI constraints

- The notice reuses the existing `.empty-state` block.

## MUST NOT change

- Never put API credentials in client code again. To turn explain back on, get the token on the
  server (for example a route handler reading credentials from the env) and return only the
  token, then set `EXPLAIN_ENABLED` to true.
- Keep `ExplainPage.tsx` and `SearchExplain.tsx`: the feature is switched off, not deleted.
