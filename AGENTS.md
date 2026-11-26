# Gally — Repository Map for Agents

Navigation guide for the Gally monorepo. Read this before grepping: it tells you **which repo and
which directory** owns a concern, so you can go straight to the right files.

Gally is an API-first e-commerce searchandising engine (Symfony + API Platform + OpenSearch)
with a Next.js back-office, a shared React component library, a JS/TS SDK, and a demo storefront.

This file answers *where is the code*. Skills answer *what do I do*: each loads when the work
matches its description. They are maintained in the `skills/` folder of their own repo,
**`Elastic-Suite/gally-ai-tools`**, a private repo; change a skill there, not in a local copy.

| Skill | Use it for |
|---|---|
| **`gally-dev`** | build, test, lint, verify, commit — which container, which checks, which of the five repos |
| **`gally-sample-data`** | the demo dataset — fixture formats, invariants, how to author or generate it |
| **`gally-storefront`** | anything under `front/example-app` — tokens, SDK contract, specs ritual |
| **`gally-mockup`** | see a storefront or back-office design before coding it (variants over the live app, screenshots, standalone pages), then implement the chosen one |
| **`gally-api`** | reading and writing data in a running instance over REST/GraphQL |

---

## 1. Repositories and their `AGENTS.md`

The repository root is the **distribution repo** (`Elastic-Suite/gally`): Docker, the Makefile,
the Symfony shell and the front workspace root. The feature code lives in four **separately
cloned git repos** nested inside it. They are *not* submodules, and the parent gitignores them.

Each part is documented next to its code: an agent working in a folder picks up that folder's
`AGENTS.md`. Read it before you start there. This file only routes.

| Path | Repo | License |
|---|---|---|
| `.` (incl. `docker/`, `api/`, `front/pwa/`, `front/example-app/`, `front/e2e/`) | `Elastic-Suite/gally` | MIT |
| `api/packages/gally-standard/` | `Elastic-Suite/gally-standard` | OSL-3.0 |
| `api/packages/gally-premium/` | `Elastic-Suite/gally-premium` (private) | Proprietary |
| `api/packages/gally-sample-data/` | `Elastic-Suite/gally-sample-data` | OSL-3.0 |
| `front/gally-admin/` | `Elastic-Suite/gally-admin` | mixed |

`front/` is a yarn-workspaces root (`front/package.json`).

**Consequences you must respect:**

- `gally-premium` and the skills repo `Elastic-Suite/gally-ai-tools` are **private**. Keep their
  code and content out of the public repos: nothing in gally, gally-standard, gally-sample-data or
  gally-admin may require premium, quote its code, or link into either private repo beyond naming
  it. Premium-only fixtures stay in sample data's `premium/` folders, which load only when premium
  is installed.

- Each nested repo has its **own branch, remote and history**. `git status` at the root does not
  show changes made in them; check the owning repo before committing
  (`git -C api/packages/gally-standard status`). They sit on different feature branches routinely.
- `api/vendor/gally/*` and `front/node_modules/@elastic-suite/*` are **symlinks** to
  `api/packages/*` / `front/gally-admin/packages/*`: the *same files*. Always navigate via the
  canonical path, or you will commit to a repo you did not mean to.
- The `gally-dev` skill holds the cross-repo commit procedure and the full symlink trap.

Bootstrapping a fresh machine clones all four and links them: `make init-dev-env`.

---

## 2. Where to look for a given concern

| Concern | Read |
|---|---|
| URL routing, which service serves a path, caching, compose files, environment | `docker/AGENTS.md` |
| Which bundles are active, adding a new indexed entity type | `api/AGENTS.md` |
| Search, attributes and source fields, facets, indexing, async jobs and CSV import/export, auth and users, back-office nav | `api/packages/gally-standard/AGENTS.md` |
| A premium feature (boost, thesaurus, vector search...), or a standard behaviour that seems overridden | `api/packages/gally-premium/AGENTS.md` |
| Demo catalog data | `api/packages/gally-sample-data/AGENTS.md` |
| A back-office page or URL | `front/pwa/AGENTS.md` |
| A back-office screen or widget, API types and fetch layer, the storefront SDK | `front/gally-admin/AGENTS.md` |
| The demo storefront | `front/example-app/AGENTS.md` |
| End-to-end tests | `front/e2e/` (Playwright, run in the `e2e` container) |
| CI pipelines | `.github/workflows/{ci,qa,tests}.yml` (each nested repo has its own too) |
| Why a design choice was made (ADRs) | the owning repo's `docs/decisions/`; the example app has its own, `front/example-app/docs/decisions/` |

---

## 3. Workflows

**Use the `gally-dev` skill before running checks, tests or committing.** It holds the
change→check routing table, the gaps `make qa` does *not* cover (notably all of `gally-admin`),
the destructive-command guardrails, and the cross-repo commit procedure. `make help` lists every
target.

Everything runs **inside containers**. Do not run composer/yarn/php on the host.

**`make fixtures_load` is destructive.** It drops the database and clears all OpenSearch indices
before reloading. It prompts for confirmation. Never run it unprompted on a stack whose state the
user cares about. E2E tests assume that clean state.

---

## 4. Conventions

- **PHP**, Symfony, API Platform: versions are in `api/composer.json`. `php-cs-fixer` + `phpstan`
  configs are per-repo (`.php-cs-fixer.dist.php`, `phpstan.neon.dist`). Modules are
  self-contained bundles.
- **TS/JS**: eslint + prettier per workspace root. Jest for pwa/components/shared, vitest for the
  SDK, Playwright for e2e.
- **Commits**: conventional-commit, e.g. `feat(#1379782): example app i18n`. Commit in the repo
  that owns the file. Commits are authored by the developer who makes them: keep the message to
  the subject line, with no co-author or "generated with" trailer for the tool that helped
  write it.
- **Redmine ticket**: when the work has one, write its number as `#XXXXXX`: in the commit
  scope, in an ADR's `ticket` field, in a spec. Take it from the branch name when it carries
  one (`feat-1408943-adr` gives `#1408943`). It is optional: not every change has a ticket.

---

## 5. What belongs in these files

Put each line closest to the code it is about: this file routes, the `AGENTS.md` in a folder
holds that folder's map and its traps, and a folder's `docs/*` holds longer hard-won facts. The
admission test a new line has to pass, and why routing decays while facts do not,
are in **`docs/agents/doc-policy.md`** — read it before adding a line to any of these files.

---

## 6. Other docs

Not loaded automatically, and not tied to one folder. Each is worth reading when its subject
comes up. The per-folder `AGENTS.md` files are routed from §2.

| File | Read it when |
|---|---|
| `docs/agents/doc-policy.md` | adding a line to an `AGENTS.md`, a `docs/*` file or a skill |
