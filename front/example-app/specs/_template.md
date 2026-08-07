# Feature: <name>

## Status: draft | approved | implemented
## Page/Component: src/pages/<X>.tsx

## Behaviour (testable)
- [ ] ...

## SDK contract used
- Which SearchManager options / requestType / selectedFields. See ../docs/sdk-reference.md.

## Tracking (required)
- Which TrackingEventType fires and when.

## UI constraints
- Uses only design-system tokens + existing components (../docs/design-system.md).

## MUST NOT change
- Existing behaviour/props/tracking that must stay intact during refactor.
- The most valuable section: it is what stops a later refactor undoing this one.

---

Write the spec **as part of the change**, not afterwards — it is how the next session knows why
the code looks the way it does. Tick `- [x]` only for behaviour actually verified, and say so
plainly when something could not be checked.

For a **bugfix** (`bugfix-<name>.md`), add a `## Problem` section above the checklist and record
the **root cause**, not just the fix — the wrong belief, not only the wrong line.
`bugfix-cms-selected-fields-projection.md` is the reference shape.