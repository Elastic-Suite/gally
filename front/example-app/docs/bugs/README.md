# Open bugs

Bugs found in the example app that are not fixed yet. One file per bug. This folder is a
temporary home until the bugs move to the issue tracker.

-   A file says what was observed, what still works, and where the evidence is.
-   When a bug is fixed, delete its file in the same change, and write a spec for the fix as usual.
-   Several bugs come from bugfix specs that were deleted. To read one, run
    `git show 2745ce7c:front/example-app/specs/<file name>`.

All observations below were made on 2026-11-13, in headless Chromium, on `papershop_fr`.

## Index

-   [Cart remove button goes off screen on phones](cart-remove-button-off-screen-on-phones.md) - bug
-   [Intro screen never shows, so the event log is never visible](intro-screen-never-shows.md) - bug
-   [Search falls back to `'*'`, which returns part of the catalog](search-wildcard-fallback-returns-a-subset.md) - bug
-   [Homepage sliders and blog list are rendered only in the browser](homepage-and-blog-list-not-server-rendered.md) - improvement
-   [Autocomplete popup is taller than the screen](autocomplete-popup-taller-than-screen.md) - design question
-   [Variant selector may announce raw attribute codes](variant-selector-raw-codes-in-aria-label.md) - to check
