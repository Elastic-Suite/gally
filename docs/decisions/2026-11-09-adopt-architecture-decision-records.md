---
status: accepted
date: 2026-11-09
decision-makers: gally team
---

# Record architecture decisions as MADR files

## Context and Problem Statement

We do not write down why we make design choices. A commit message says what changed. A
comment explains one line. Neither says which options we rejected, or why.

We are three people working in R&D. We decide based on how the product is used, or will be
used: small and large catalogs, different kinds of client. We try not to break what already
works. When we do break it, we need to remember why.

Where and how do we write these decisions down?

## Decision Drivers

* We must record the options we rejected, and why.
* We must say how to check that the decision is followed.
* A record must be short enough for three people to read and review in a pull request.

## Considered Options

* MADR
* Nygard's ADR format
* Y-statements

## Decision Outcome

Chosen option: "MADR", because it is the only format with a section for rejected options and
a section for checking the decision. Its optional sections can be deleted, so a small
decision stays short.

ADRs live in the repo, in `docs/decisions/`, with one folder per topic.
`docs/decisions/README.md` says when to write one and how.

### Consequences

* Good, because each decision keeps its rejected options, so we can tell later whether the
  reasons still hold.
* Good, because an ADR is reviewed in the same pull request as the code.
* Good, because we never edit a decision away. A new ADR replaces it, and the old one is
  marked `superseded`.
* Bad, because each ADR is one more file to write and review.

### Confirmation

In code review, a pull request that sets a new pattern, or breaks existing behaviour, comes
with an ADR.

## Pros and Cons of the Options

### Nygard's ADR format

Title, Status, Context, Decision, Consequences.

* Good, because it is the best known format, and the shortest.
* Bad, because it has no place for rejected options or for checking the decision.

### Y-statements

One sentence: "In the context of X, facing Y, we chose Z over W, to get A, accepting B."

* Good, because it is quick to write, and it names the rejected option.
* Bad, because one sentence leaves no room to explain the consequences.

## More Information

We also rejected three other places for decisions:

* Commit messages: they cannot be updated, and they are hard to find later.
* A wiki: it does not follow branches or code review.
* Tyree and Akerman's template: too many fields for a team of three.

MADR: <https://adr.github.io/madr/>
