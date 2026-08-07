# Feature: Remove the redundant "Home" nav item

## Status: implemented
## Page/Component: src/components/Header.tsx, src/locales/{en,fr,de}/common.json

The header had two controls pointing at `/`: the brand lockup on the left and a "Home"
nav item immediately to its right. The nav item is dropped; the lockup remains the way
back to the homepage.

## Behaviour (testable)
- [x] The header nav no longer renders a Home item. It is now Products, Search
      Intelligence (`expert-only`, hidden by default) and Blog.
- [x] The brand lockup still links to `/` and keeps its `brand.ariaLabel`
      ("… — go to homepage"), so the homepage is still reachable from every page and
      still has an accessible name saying so.
- [x] `nav.home` removed from all three locale bundles — it had exactly one use, and a
      key left behind after its only consumer is deleted is invisible dead weight.
- [x] `isActive()` is still used (by the `/explain` link) and therefore not dead.
- [x] Verified rendered: nav reads "Produits  Blog" with no Home item.

## Consequence accepted
- On `/` no nav item carries the `active` class. That is correct — nothing in the nav
  represents the homepage any more. The lockup is not given an active state; it is a
  brand mark, not a nav item.

## SDK contract used
- None. Presentation-only.

## Tracking (required)
- No change. The Home link fired no tracking event, and homepage `VIEW` tracking comes
  from `Homepage.tsx` on mount, not from how the user got there.

## UI constraints
- No CSS change. `.header-nav` is unchanged and simply has one fewer child.

## MUST NOT change
- The brand lockup's `to="/"` target and `brand.ariaLabel`. With the nav item gone, the
  lockup is the **only** header route to the homepage — see
  `feature-header-brand-lockup.md`.
- `isActive()` in `Header.tsx`, still used by the Search Intelligence link.
