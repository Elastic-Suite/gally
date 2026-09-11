# Chore: agent docs follow progressive disclosure

## Status: implemented
## Page/Component: none — documentation only. No `.tsx`, `.ts` or `.css` file was touched.

## Problem

The app's agent instructions had the same routing table in three always-loaded files
(`CLAUDE.md`, `.agent.md`, `AGENTS.md`), the host-build warning in three, and the design-token
rule in four. `.agent.md` itself explained that this duplication had already caused a stale-file
bug, and then reproduced the table anyway. Two pointers were wrong: `AGENTS.md` named
`specs/feature-nextjs-migration-phase2.md` and `-phase3.md`, neither of which exists, and
`src/views/AGENTS.md` was still headed `# Pages` after the rename to `views`. `README.md` was
still the Create React App boilerplate.

The wrong belief, not the wrong line: that a copy of a rule in a second always-loaded file is
free insurance. It is not — the copies drift, and the stale one wins depending on which file a
tool reads first.

## Behaviour (testable)
- [x] `AGENTS.md` is the entry point and holds the only routing table for this app.
- [x] `CLAUDE.md` (11 lines) and `.agent.md` (13 lines) name `AGENTS.md` in their first lines and
      contain no routing table and no rules. `CLAUDE.md` keeps only Claude-specific content: the
      two directory-scoped skills in `.claude/skills/`.
- [x] Each rule has one home: host build in `AGENTS.md` "Definition of done"; tokens in
      `docs/design-system.md`, enforced at the point of use by `src/{components,views}/AGENTS.md`;
      spec-per-change in golden rule 7.
- [x] `src/sdk/AGENTS.md` no longer restates ten SDK gotchas that `docs/sdk-reference.md` owns.
      It keeps the two that fail silently, with no error to follow.
- [x] `specs/feature-locale-segment-phase2.md` and `specs/feature-rsc-shells-phase3.md` are named
      in full. The `-phaseN.md` shorthand is what produced the wrong filename.
- [x] `src/views/AGENTS.md` is headed `# Views`.
- [x] `README.md` describes the Next.js 16 app and says the host build does not work.
- [x] `DEMO.md` and `README.md` are reachable from `AGENTS.md`; both were orphans.
- [x] `tools/check-agent-docs.py` at the repo root reports no broken pointers.

## SDK contract used
None. No query, no `selectedFields`, no `requestType` changed.

## Tracking (required)
Unchanged. No tracking call was added, removed or moved.

## UI constraints
Not applicable — no rendered output changed.

## MUST NOT change
- **`docs/sdk-reference.md` stays authoritative** and wins over `AGENTS.md` and over any skill.
  The precedence statement in `AGENTS.md` is a rule, not routing; do not drop it when trimming.
- **Do not copy the routing table back into `CLAUDE.md` or `.agent.md`.** That is the exact
  regression this change undoes, and it has already happened once.
- The two SDK traps kept in `src/sdk/AGENTS.md` (`selectedFields` must be non-empty;
  `product_search` when there is no category) are restated on purpose because they fail with no
  error. Do not "de-duplicate" them away.
- The token, host-build and spec-per-change rules each keep exactly one always-loaded home. Adding
  a second is what caused the drift.
- `gally-storefront/SKILL.md` keeps its own copy of the spec-per-change rule: a skill is loaded on
  its own and cannot assume `AGENTS.md` was read.

## Verification

Documentation only, so no build or test run applies. What was checked:

```bash
../../tools/check-agent-docs.py          # all pointers resolve
wc -l CLAUDE.md .agent.md AGENTS.md src/*/AGENTS.md   # 121 lines total, was 141
grep -c '^| ' CLAUDE.md .agent.md        # 0 routing rows in both
```

Part of a repo-wide pass; the monorepo side is recorded in the root `AGENTS.md` §9 and
`docs/agents/doc-policy.md`.

---

## Follow-up: the two example-app skills against the Agent Skills best practices

Audited `.claude/skills/gally-storefront/` and `.claude/skills/nextjs-react-docs/` against
https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices. Both already met
the metadata and structure rules: names are lowercase-and-hyphens, descriptions state what and
when in third person and sit well under the 1,024-character limit, and both SKILL.md files are far
under the 500-line guidance.

### Behaviour (testable)
- [x] **No time-sensitive content.** `nextjs-react-docs` no longer pins patch versions
      (`16.3.0`, `19.2.4`, `19.2.17`) or quotes token estimates. It keeps the **major** versions,
      because "this app is Next 16, not the Next 13 in `front/node_modules`" is the entire point of
      the skill, and it now prints the installed version with `node -p` rather than asking you to
      trust a table.
- [x] The "Verified URL patterns" table said the slugs "returned 200" with no date. It now states
      the construction rule, admits docs get reorganised, and gives the one-line `curl -sIL` that
      confirms before you build an answer on a 404.
- [x] `gally-storefront` no longer quotes a stylesheet size.
- [x] **The `specs/` ritual has a copy-able checklist**, ordered so the spec is written before the
      code. The recurring failure was writing it afterwards or not at all.
- [x] Three evaluations per skill in `.claude/skills/<name>/evaluations/*.json`, drawn from
      recorded bugs rather than invented: `bugfix-cms-selected-fields-projection.md`,
      `bugfix-search-wildcard-empty-results.md` and `bugfix-german-locale-untranslated.md` for the
      storefront skill.

## MUST NOT change (additions)
- **The major versions stay in `nextjs-react-docs`.** They are the discriminator between the two
  `node_modules` trees, and reading the wrong one gives React 18 semantics with no error at all.
  Strip the patch numbers if they reappear; do not strip the majors.
- **Do not add measured counts back to either skill.** State the durable fact and let something
  recompute the number - the reasoning is in `../../docs/agents/doc-policy.md`.
- **`evaluations/*.json` are deliberately not linked from `SKILL.md`.** They are test fixtures, not
  instructions, and linking them would spend context on every invocation. Same file records the
  exemption so a reachability audit does not flag them.
- The step order in the `specs/` checklist is the point of it. Step 2 (spec) before step 3 (code).
