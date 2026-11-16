---
status: accepted
date: 2026-11-13
decision-makers: example-app team
---

# Keep all documentation under docs/, one folder per role

## Context and Problem Statement

Until this ADR, the example app kept its documents in three places. `docs/` held how the app
works (`architecture.md`, `design-system.md`, `sdk-reference.md`). `specs/` held one file per
change, 103 of them. ADRs had just been added in `front/example-app/docs/decisions/`.

The specs did two jobs. They described a change, and they also explained why the code looks the
way it does. The second job made them read like the current state, but they are written once per
change and later changes override them. Writing the ADRs found passages that no longer matched the
code. One example: `feature-rsc-shells-phase3.md` still described `skipMountFetch`, which had been
replaced by `serverFetchedKey`. Another: `feature-persist-shared-ui-across-navigation.md` put
`CategoryNav` in a layout, but commit `ea293de4` later moved it into `Header`.

Where does each kind of document live, and which one is the reference when two disagree?

## Decision Drivers

-   A reader, person or LLM tool, must know where to look for how the app works now.
-   The reasons behind a decision must live in one place only.
-   The record of each change must stay, because it is how a later reader understands that change.
-   Open bugs need a home until they move to the issue tracker.

## Considered Options

-   One `docs/` root, one folder per role
-   One living spec per feature area, kept up to date
-   Keep `specs/` at the app root, next to `docs/`

## Decision Outcome

Chosen option: "One `docs/` root, one folder per role", because it gives each question one place
to answer it, and keeps every change record.

| Folder                              | Answers                                         | Kept up to date?                                         |
| ----------------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| `docs/*.md`                         | How does the app work now?                      | Yes.                                                     |
| `front/example-app/docs/decisions/` | Why this structure, and what was rejected?      | No. A new ADR supersedes an old one.                     |
| `docs/specs/`                       | What did one change do, and how was it checked? | While `draft`. Frozen once `implemented`.                |
| `docs/bugs/`                        | What is still broken?                           | Yes. A file is deleted in the change that fixes its bug. |

When two documents disagree, the current-state docs and the code win over a spec, and an ADR wins
over a spec on the reasons. A spec links the ADRs it follows or creates, under `## Decisions`,
instead of repeating their reasons.

`docs/bugs/` is temporary. It holds the bugs found while the bugfix specs were folded into ADRs,
until they move to the issue tracker.

### Consequences

-   Good, because a reader knows where to look: `docs/` for now, `front/example-app/docs/decisions/` for why.
-   Good, because the reasons are no longer copied into specs, so they cannot drift there.
-   Good, because every change keeps its spec, as before.
-   Bad, because the move touched every link to `specs/`, in this repo and in the agent skills.
-   Bad, because a frozen spec can still mislead a reader who forgets it is a record.

### Confirmation

-   `ls front/example-app` shows no `specs/` or `bugs/` folder.
-   `docs/specs/_template.md` has a `## Decisions` section.
-   In code review, a spec that explains a lasting decision with rejected options comes with an ADR.

## Pros and Cons of the Options

### One living spec per feature area, kept up to date

-   Good, because each feature would have one document that is always current.
-   Bad, because it means rewriting 103 per-change files into feature files.
-   Bad, because it loses the record of what each change did and how it was checked.

### Keep `specs/` at the app root, next to `docs/`

-   Good, because nothing moves.
-   Bad, because documents stay in two roots, and the specs keep looking like the current state.
