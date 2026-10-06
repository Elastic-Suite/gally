# Feature: one guided tour per sample catalog, built from its demo guide

## Status: planning (2026-10-06) - not started

## Page/Component: src/scenarios/ (one file per catalog), src/scenarios/types.ts, src/hooks/useStoryActions.ts, src/contexts/DemoContext.tsx, src/components/StoryCompanion.tsx, src/locales/\*/scenarios.json, new tools/check-tour-sync script. Depends on `specs/feature-guided-demo-rebuild.md` (tab, panel, engine cleanup).

## Why

The guided demo today tells one invented story ("Camille looks for a tank dress") that only works
on the Venia catalog (`feature-guided-demo-rebuild.md`, "Hardcoded to one catalog"). Meanwhile the
sample data package ships a demo script per catalog, written and measured by people who run the
demos: `api/packages/gally-sample-data/guides/{en,fr}/{default,fashion,papershop,toolbox}.md`.

Each script already has the shape of a tour. Its "The run - about ten minutes" section is a
numbered table of six storefront steps ("Type or click" / "What it shows"), followed by one
section per step: what to open, what to type, what appears, what to say
(`guides/en/toolbox.md:50-125`, same structure in the other three). Every step runs in the
storefront. None needs the admin.

So the tour should play that script, in whichever catalog is open, instead of the dress story.

## The four tours

Taken from the "The run" sections. Line numbers are in `guides/en/`.

| Catalog | Opens on | Steps |
| --- | --- | --- |
| Venia & Luma (`default.md`) | `com_en` only - French popular searches have aged out (`default.md:12`) | 1 type `robe` and stop on the suggestions (`:62`) - 2 search `dress`, then `robe`: same products, ranking rule on one (`:69`) - 3 `blazer`, widened on purpose (`:77`) - 4 vector search `jewellery`, `wedding guest outfit`, `gift for my wife` (`:84`) - 5 product pages: variants, bundle, out of stock (`:97`) - 6 articles searched beside products (`:105`) |
| Fiora Fashion (`fashion.md`) | `fashion_fr` | 1 `robe`, then `jupe`: rule fires on dresses only (`:60`) - 2 `robe` in the English shop (`:69`) - 3 one product, 27 colour/size variants (`:77`) - 4 category filters that follow the product type (`:85`) - 5 promotions, old price beside new (`:91`) - 6 article "Choisir sa robe de soirée", then its product (`:97`) |
| Le livre & le lièvre (`papershop.md`) | `papershop_fr` | 1 `bureau`: three departments on one page (`:59`) - 2 "Sélection éco-responsable", filled by a rule (`:67`) - 3 `papier`: same rule ranks (`:79`) - 4 price filter 1.20 to 1290 EUR (`:84`) - 5 `pen` in the French shop (`:92`) - 6 book filters: author, pages, year (`:97`) |
| Toolbox Bricolage (`toolbox.md`) | `toolbox_fr` | 1 `perceuse`, then `ponceuse` (`:63`) - 2 `perceuse` in the English shop (`:76`) - 3 typos `Bohrmashine`, `sandre` (`:84`) - 4 power tool category, filters and sort by power (`:92`) - 5 "Univers 18V sans fil", filled by a rule (`:101`) - 6 vector search *"protect my eyes while drilling"*, English shop (`:113`) |

Data caveats the tours have to respect, all stated in the guides:

- Search by meaning works best in English. Toolbox step 6 must run in `toolbox_en`
  (`toolbox.md:116`).
- Rule-built categories show 0 in the menu while the page lists the products
  (`papershop.md:132`, `toolbox.md:145`, "being fixed"). The tour opens the page, it does not
  point at the count.
- Luma (`fr`) and `uk` have no guide. The tab says so instead of starting a tour (see
  "No tour for this catalog").

## Decisions

### 1. Who reads the panel - recommendation: the presenter (open)

The guides speak to whoever runs the demo ("what to say about it"). The old story spoke to the
audience through personas (Camille, the merchant). The two read differently:

- **Presenter notes (recommended).** The panel shows: what the step does, what to point at,
  and the one sentence to say. It follows the guide closely, and stays short enough to be
  visible on a shared screen without looking like a script.
- **Audience story.** Rewrite each step as narrative with personas. More polish, but a second
  text to keep in step with the guide, and the guides would stop being the source.

With presenter notes, personas go: `Persona`, `personas` in `Scenario`, and the persona line in
the panel.

### 2. The dress story is replaced, not kept beside - recommendation (open)

The Venia tour covers what the dress story wanted to show (search, facets, ranking, vector
search) with steps that were measured. `demo-dress.ts`, its `scenarios.json` block and
`storytelling.md` go. The closing page is handled in decision 6.

### 3. Steps vary in number - decided by the data

The guides have six steps, not five acts. The panel shows "Étape n / N" from the scenario
length. Nothing in the engine assumes five.

### 4. Where the tour data lives - recommendation: in the app, checked against the guide

The app runs in its own container and does not read the PHP package at runtime. Three options:

- **A. Scenario files in the app, plus a sync check (recommended).** `src/scenarios/<catalog>.ts`
  holds the steps; `scenarios.json` holds the panel text. A script compares each scenario's
  inputs (queries, category names, product names) with the "Type or click" column of the
  guide's "The run" table and fails on a difference. Same idea as `guides/check-sync.py`.
- **B. A machine-readable block in each guide** (front matter or a fenced `tour` block),
  copied into the app at build time. One source, but it couples the app build to the package
  path and puts code-shaped data into documents written for people.
- **C. Hand-port with no check.** Drifts the first time a guide is re-measured.

### 5. Choosing the tour - by catalog code

`DemoContext` picks the scenario from the active catalog code (`useCatalog`,
`src/contexts/CatalogContext.tsx:132`), keyed the same way as `CATALOG_AXIS_CODES`
(`src/sdk/fields.ts:47`): `com`, `fashion`, `papershop`, `toolbox`.

- Switching catalog while guided mode is on restarts the new catalog's tour at step 1.
- **No tour for this catalog** (`fr`, `uk`): the tab still shows; the panel says there is no
  guided tour for this shop and lists the four that have one, each a link to its catalog.
- **Wrong locale for the tour** (Venia opened in `com_fr`): step 1 offers to switch to the
  locale the guide was measured in, rather than running on data it was not written for.

### 6. Closing page - open

Either a common last step "Le bilan" on every tour (`/closing`, which then needs the catalog
specifics removed: `ClosingPage.tsx:45,58`), or no closing step and the page is deleted with
the dress story. To decide together with `feature-guided-demo-rebuild.md` decision 8.

### 7. Admin steps stay out

"If you have more time" (switching a second ranking rule on live, `guides/en/README.md:24`)
needs the admin. Not in the tour. A step may end with a pointer to it, as text.

## Engine work

The current actions (`src/scenarios/types.ts:8-18`) cover two of the step shapes. The guides need:

| Action | Used by | Notes |
| --- | --- | --- |
| `type_and_wait` - type, keep the suggestions open, do not submit | Venia 1 | Needs the search overlay to stay open while the panel is visible (`feature-guided-demo-rebuild.md` decision 7) |
| `search` - one query, or a list played in order with a pause | most step 1-3 | Replaces `type_and_search`. "`dress`, then `robe`" is a list of two |
| `switch_locale` - go to the same page in another localized catalog | Fashion 2, Toolbox 2 and 6, Papershop 5 | Via the existing `pushLocale` path |
| `open_category` - by label, resolved in the category tree | Papershop 2, Toolbox 4 and 5, Fashion 4 | Labels, not ids: ids differ per catalog. Replaces `__first__` |
| `open_product` - by name or SKU, resolved by a search | Venia 5, Fashion 3, Papershop 6 | Replaces `add_to_cart_flow` and its broken selector |
| `vector_search` - one or more phrases on `/vector-search` | Venia 4, Toolbox 6 | |
| `open_article` - by title, then its first linked product | Fashion 6, Venia 6 | |
| `spotlight` - outline a `data-story-target` | every step | Facets, price slider, variant picker, struck-through price, article product link |

Each step can also name a spotlight target. All targets are `data-story-target` attributes
(`feature-guided-demo-rebuild.md` decision 6), added to the components the tours point at.

Steps play their action once on arrival. The presenter can replay a step from the panel
(click the current step again).

## Phases

1. **Panel and engine**, from `feature-guided-demo-rebuild.md`: the right-edge tab, the panel
   (variant to pick from `mockups/guided-demo-toggle/`), intro and audience mode removed,
   `data-story-target`, the new action set. Ships with the **Venia tour** as the only scenario,
   replacing the dress story.
2. **The three other tours**: Fashion, Papershop, Toolbox, and the catalog switch rules in
   decision 5.
3. **Sync check** (decision 4 A) and the docs: `storytelling.md` deleted, `docs/architecture.md`
   and `AGENTS.md` updated, and a line in `guides/{en,fr}/README.md` saying the app plays "The
   run" and that changing that table means changing the scenario.

## Text and locales

- Guides exist in en and fr. The app has en, fr and de, with parity required in
  `scenarios.json`. German text has to be written for the tours (the guides do not have it).
- Search terms, product names and catalog names stay untranslated in every locale, as the guides
  require (`guides/en/README.md:63-65`). They are data in the scenario file, not in
  `scenarios.json`.
- No markup inside translations. The panel builds its emphasis from structured fields, not
  `innerHTML` (`useStoryActions.ts:72` today).

## Acceptance criteria

- [ ] Each of the four catalogs, in the locale its guide names, plays its six steps to the end
      with what the guide says should appear.
- [ ] Switching catalog with guided mode on starts that catalog's tour.
- [ ] Luma and `uk` show the "no tour for this shop" panel.
- [ ] The sync check passes, and fails when a query in a guide's "The run" table is changed.
- [ ] No step depends on a CSS class: targets are `data-story-target`.
- [ ] Panel text exists in en, fr and de.
- [ ] `demo-dress.ts`, `storytelling.md` and the persona fields are gone.

## Tracking (required)

The tour fires no tracking itself. Its searches, category views and product views go through the
normal components, so they send `SEARCH`, `VIEW` and `DISPLAY` as a visitor's would. A tour run
therefore adds to popular searches - acceptable on a demo instance, worth knowing before running
it on a shared one.

## Related specs

- `specs/feature-guided-demo-rebuild.md` - entry tab, panel, engine cleanup (phase 1 here)
- `api/packages/gally-sample-data/guides/` - the source scripts
- `specs/feature-vector-search-comparison.md` - the vector search page steps 4 and 6 use
