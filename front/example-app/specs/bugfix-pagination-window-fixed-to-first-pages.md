# Bugfix: the pager always showed the first pages

## Status: implemented
## Page/Component: `src/components/Pagination.tsx` (new), `src/views/CategoryPage.tsx`,
## `src/views/SearchPage.tsx`, `src/views/BlogPage.tsx`, `src/views/VectorSearchPage.tsx`

## Problem
On page 6 of 12 the pager still read `1 2 3 4 5 …`, with no button highlighted. The window never
moved, so every page past the fifth was unreachable except by clicking the arrow once per page, and
the last page was unreachable in practice. The trailing `…` was a plain `<span>` that looked like a
button and did nothing.

**Root cause: the belief that a pager's page list is a property of the page count alone.** Every
call site built it as

```
Array.from({ length: Math.min(pageCount, 5) }, (_, i) => i + 1)
```

which is `1 … N` whatever page you are on. The current page was used only to mark one button
active - and once past the window, not even that. The expression was correct for the case it was
written in, a catalog small enough that every page fitted in the window, and it was then copied.

It was copied **five** times: `CategoryPage`, `BlogPage`, two pagers in `SearchPage`, and
`VectorSearchPage`, whose own comment says it reuses "the app's existing `.pagination` idiom,
verbatim" - which is how a bug in a snippet becomes a bug in five places.

## Behaviour (testable)
- [x] The window slides with the current page and clamps at both ends: page 6 of 12 with a window
      of 5 gives `1 … 4 5 [6] 7 8 … 12`, page 1 gives `[1] 2 3 4 5 … 12`, page 12 gives
      `1 … 8 9 10 11 [12]`. Checked against the shipped expression for ten page/count/window
      combinations, including both ends and both window sizes.
- [x] `pageCount <= windowSize` renders the plain run of numbers with no ellipsis and no
      duplicated first/last button - `page 3 of 5` gives `1 2 [3] 4 5`.
- [x] Page 2 and page 11 of 12 give `1 [2] 3 4 5 … 12` and `1 … 8 9 10 [11] 12`: no `…` between
      `1` and `2`, because there is nothing hidden there.
- [x] Server-rendered markup on a real listing is the new one:
      `<nav class="pagination" aria-label="Pagination">` with `class="active" aria-current="page"`
      on the current page.
- [x] A listing whose page count equals the window renders no ellipsis (`cat_2`, 5 pages,
      window 5).
- [ ] Clicking through pages in a browser, and the vector search page's two independent pagers -
      NOT exercised interactively. The arithmetic and the markup are checked; the click is not.
- [ ] A single page renders no pager at all. Unchanged from before by construction (the component
      returns `null`), not re-tested.

## The fix
One component, `src/components/Pagination.tsx`, replacing all five copies - golden rule 3, and the
only way the sixth copy does not get written next time.

```
const size = Math.min(windowSize, pageCount);
const start = Math.min(Math.max(page - Math.floor(size / 2), 1), pageCount - size + 1);
```

Props are `page`, `pageCount`, `onPage`, `windowSize`, `prevLabel`, `nextLabel`, `ariaLabel`.

**Scrolling stays at the call site.** The three behaviours differ on purpose: `CategoryPage` and
`SearchPage` scroll the window to the top, `VectorSearchPage` scrolls its own panel back into view
because its two panels sit side by side. The component only reports which page was asked for.

The markup is `VectorSearchPage`'s version, the best of the five: `<nav className="pagination"
aria-label>` with `aria-current="page"` on the active button. Adopting it in the other four is an
accessibility gain with no visual change.

## SDK contract used
None. Pagination is client-side over `pageCount`, which every view already had.

## Tracking (required)
Unchanged. `CategoryPage`'s display tracking still fires on the product list it renders, whichever
page that is.

## UI constraints
`.pagination` and `.pagination button` in `src/styles.css` already style everything; the only
addition is `.pagination span` in `--gray-500` so the ellipsis reads as a gap rather than a
disabled button. A token, not a new primitive.

## MUST NOT change
- **No call site goes back to building its own page numbers.** That is the whole bug.
- Each call site keeps its own scroll behaviour, its own labels and its own window size - the
  differences are deliberate and documented where they are.
- `VectorSearchPage`'s pager stays **above** its list; `src/views/VectorSearchPage.tsx` explains
  why, and the component must not force a position.
- The pager still renders nothing when there is one page or fewer.
