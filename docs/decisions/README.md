# Architecture Decision Records

Decisions about gally, written in [MADR 4](https://adr.github.io/madr/) format.

ADRs are written for people first. They are read in code review, by a new team member, or by
anyone about to undo something that looks odd. Write them in plain language, and keep only
what a person needs to understand the decision. An LLM tool reads them too, but it is not
the audience.

## When to write one

Ask these four questions about the decision:

1. Is it information that could not be said in a commit message or a code comment? If yes,
   it is an ADR.
2. Do we need to record the choice we did not make, and why? If yes, it can be an ADR.
3. Does the decision set the structure that later code will follow? If yes, it can be an ADR.
4. Could someone, or an LLM tool, work out why we did this from the code alone? If no, it can
   be an ADR.

Decisions are based on how the product was used or will be used: catalogs of very different
sizes, and different kinds of client. A change that breaks existing behaviour needs an ADR
saying why.

## Writing a new ADR

1. Pick the topic folder: one folder per topic, named after the part of the product the
   decision is about. Reuse an existing folder when one fits, and create one when the topic
   is new. Decisions about the ADR process itself stay at this level.
2. Copy `adr-template.md` into it as `YYYY-MM-DD-short-title.md`.
3. Fill in the sections. Delete the optional ones you do not need, along with their
   `<!-- This is an optional element -->` comments and the `{placeholder}` text. In the
   front matter, `ticket` is the Redmine ticket number, `#XXXXXX`, when the work has one.
   Take it from the branch name when it carries one (`feat-1408943-adr` gives `#1408943`).
   It is optional: drop the line when no ticket applies.
4. Add a line to the index below, under its topic.

`adr-template.md` is MADR 4.0.0's `template/adr-template.md`, copied from
<https://github.com/adr/madr/tree/4.0.0/template> (license: MIT or CC0-1.0) with one line
added: the optional `ticket` field. Change nothing else, so a later MADR version can be
compared with a plain diff.

## Naming

Files are named `YYYY-MM-DD-short-title.md`.

- The date is the day the file is first committed. It never changes afterwards, so links to
  an ADR stay valid.
- A date is used instead of MADR's default `NNNN-` number. Two branches can then add an ADR
  at the same time without both taking the same number.
- When a decision is older than its ADR, the ADR's Context names the commit that made it.
- A later status change, such as `superseded`, goes in the `date` and `status` front matter,
  not in the file name.
- Moving an ADR to another topic folder breaks links to it. Pick the folder with care.

## Index

### ADR process

- [2026-11-09 - Record architecture decisions as MADR files](2026-11-09-adopt-architecture-decision-records.md) - accepted
