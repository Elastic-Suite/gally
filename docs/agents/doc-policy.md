# Gally — What belongs in the agent docs

Read this before adding a line to any `AGENTS.md`, any `docs/*` file or any skill.

Two jobs, two homes. The git history shows the split already operating: `front/example-app/docs/*`
is edited in nearly every bugfix commit, `AGENTS.md` in almost none.

- **`AGENTS.md` and skills = routing.** Where a concern lives, which container a command runs in,
  which repo owns a file. Rewritten when the structure moves. The root `AGENTS.md` only routes;
  each folder's `AGENTS.md` holds the map of that folder and its short traps, so a fact sits
  next to the code it is about and loads when an agent works there.
- **`docs/*` = hard-won facts.** One entry per thing that cost someone a bug.
  `front/example-app/docs/sdk-reference.md` has grown far more than it has shrunk: it accumulates
  and rarely retracts.

**The admission test.** Before adding a line to either, all three must hold:

1. **Does it correct a wrong belief?** If a competent reader would have got it right anyway, it
   does not go in. This is `specs/_template.md`'s rule ("the wrong belief, not only the wrong
   line") applied to every file, not just bugfixes.
2. **Is it checkable?** It must name a path, symbol, command or field, so it can be verified
   later. "Use tokens" cannot be; "tokens from `docs/design-system.md`" can.
3. **Does it prevent a *silent* failure?** Almost every recorded bugfix
   (`front/example-app/specs/bugfix-*.md`) failed silently. A build
   error reports itself and needs no documentation; an empty product list does not.

**Routing decays, facts do not.** Of ~145 checkable claims across these files, the only stale one
found was a cross-reference — `src/components/AGENTS.md` pointing at `../pages` after the
directory had been renamed to `../views`. Nothing warned at the time, so after renaming or moving
a directory, grep the `.md` files for the old path.

## Skill files that are deliberately not linked

Everything under a skill's `references/` and `scripts/` must be named from its `SKILL.md`, or the
agent will never find it. Two kinds of file are exempt:

- **`<skill>/evaluations/*.json`** — test fixtures for the skill, not instructions for the agent.
  Each holds a query and the behaviour a correct answer shows. Linking them from `SKILL.md` would
  spend context on every invocation to no benefit. Three per skill is the target.
- **`<skill>/scripts/baseline.json`** and similar recorded state — data a script reads, not prose
  an agent reads.

## Numbers in a skill

A measured count in prose rots silently: nothing warns when it stops being true, and a reader has
no way to tell a current figure from a two-month-old one. So state the durable fact and leave the
number to something that can recompute it.

- "eslint does not run clean here; treat any new problem as yours" survives. "eslint reports ~645
  problems" does not.
- Where a number is genuinely load-bearing, make it derivable: a script that recomputes it, not
  a figure written into prose.
- The exception is a count that labels a closed list printed on the same screen. There the count
  and the list cannot disagree.
- A snapshot worth keeping goes in a `<details>` block with its date in the summary, the way
  the `gally-sample-data` skill's `PLAN-generation-tooling.md` §2 does.
