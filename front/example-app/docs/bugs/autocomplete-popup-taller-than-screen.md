# Autocomplete popup is taller than the screen

## Status: open (design question)

## Observed

At 1920x1080, the panel starts at y=249 and is 1061px tall. Its content ends 261px below the
bottom of the screen.

## Still works

The page does not scroll while the popup is open, and Escape releases the scroll lock.

## To decide

A maximum height for the popup, or scrolling inside each column.

## Source

`bugfix-acp-background-scroll-and-density.md`, line 62, left open (removed; see
`git show 2745ce7c:front/example-app/specs/bugfix-acp-background-scroll-and-density.md`).
