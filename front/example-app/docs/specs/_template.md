# Feature: <name>

<!-- Write paths from the repo root (front/example-app/src/...). Markdown links stay relative to this file. -->

## Status: draft | approved | implemented

## Ticket: #XXXXXX (optional; from the branch name when it carries one)

## Page/Component: front/example-app/src/views/<X>.tsx (and/or front/example-app/app/[locale]/<route>/page.tsx)

## Behaviour (testable)

-   [ ] ...

## SDK contract used

-   Which SearchManager options / requestType / selectedFields. See ../sdk-reference.md.

## Tracking (required)

-   Which TrackingEventType fires and when.

## UI constraints

-   Uses only design-system tokens + existing components (../design-system.md).

## Decisions

-   Optional. The ADRs this change follows or creates, as links into `../decisions/`. Their
    reasons and rejected options live there, not here.

## MUST NOT change

-   Existing behaviour/props/tracking that must stay intact during refactor.
-   The most valuable section: it is what stops a later refactor undoing this one.

---

Write the spec **as part of the change**, not afterwards. It records what the change does and how
it was checked. When the change sets a lasting rule or rejects an option, write that in an ADR and
link it under `## Decisions`. Once the status is `implemented`, the spec is a record: how the app
works now lives in `../architecture.md`, `../design-system.md` and `../sdk-reference.md`. See
`../decisions/2026-11-13-where-documentation-lives.md`. Tick `- [x]` only for behaviour actually verified, and say so
plainly when something could not be checked.

For a **bugfix** (`bugfix-<name>.md`), add a `## Problem` section above the checklist and record
the **root cause**, not just the fix — the wrong belief, not only the wrong line.
`bugfix-cms-selected-fields-projection.md` (removed; see `git show 2745ce7c:front/example-app/specs/bugfix-cms-selected-fields-projection.md`) is the reference shape.
Cross-references between `.md` files are the part that rots — the facts hold up, the pointers do
not, and nothing warns. When renaming a directory, grep the `.md` files for the old name.
