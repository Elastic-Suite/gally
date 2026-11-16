# Intro screen never shows, so the event log is never visible

## Status: open (bug)

## Observed

-   No intro screen appears. `introSeen` starts as `true` (`src/contexts/DemoContext.tsx:45`).
-   `setAudience` is called only from the intro screen (`src/components/IntroScreen.tsx:56,64`).
    So the audience stays "direction", which hides the event log. The event log can never be seen.

## Still works

Hydration works. The event log and tracking insights mount, and add to cart updates the badge.

## Source

`bugfix-dynamic-ssr-false-bailout.md`, lines 95-100 (removed; see
`git show 2745ce7c:front/example-app/specs/bugfix-dynamic-ssr-false-bailout.md`).
