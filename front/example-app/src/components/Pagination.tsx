'use client';

import { ReactNode, Ref } from 'react';

// The one pager. It replaced five hand-copied ones, each of which built its page numbers as
// `Array.from({ length: Math.min(pageCount, N) }, (_, i) => i + 1)` — always the first N pages,
// whatever page you were on. See specs/bugfix-pagination-window-fixed-to-first-pages.md.
//
// What a call site keeps for itself: its labels, its window size, and what scrolling means to
// it. Those three genuinely differ per page — the vector search scrolls its own panel rather
// than the window — so this component only reports which page was asked for.

interface Props {
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
  // Number of page buttons in the sliding window, before the first/last jumps are added.
  windowSize?: number;
  prevLabel: ReactNode;
  nextLabel: ReactNode;
  ariaLabel?: string;
  // React 19 takes `ref` as a plain prop. VectorSearchPage needs the DOM node to find the panel
  // it belongs to; nothing else uses it.
  ref?: Ref<HTMLElement>;
}

export default function Pagination({
  page,
  pageCount,
  onPage,
  windowSize = 7,
  prevLabel,
  nextLabel,
  ariaLabel,
  ref,
}: Props) {
  if (pageCount <= 1) return null;

  // The window slides with the current page and stops at either end rather than running past
  // it: page 6 of 12 with a window of 5 is 4-8, page 1 is 1-5, page 12 is 8-12.
  const size = Math.min(windowSize, pageCount);
  const start = Math.min(Math.max(page - Math.floor(size / 2), 1), pageCount - size + 1);
  const pages = Array.from({ length: size }, (_, i) => start + i);
  const first = pages[0];
  const last = pages[pages.length - 1];

  const pageButton = (p: number) => (
    <button
      key={p}
      className={p === page ? 'active' : ''}
      aria-current={p === page ? 'page' : undefined}
      onClick={() => onPage(p)}
    >
      {p}
    </button>
  );

  return (
    <nav className="pagination" aria-label={ariaLabel} ref={ref}>
      <button disabled={page <= 1} onClick={() => onPage(page - 1)}>{prevLabel}</button>
      {/* First and last stay one click away. Reaching page 12 used to mean eleven clicks on the
          arrow. The gap marker is a plain span: it is a gap, not a button that does nothing. */}
      {first > 1 && pageButton(1)}
      {first > 2 && <span aria-hidden="true">…</span>}
      {pages.map(pageButton)}
      {last < pageCount - 1 && <span aria-hidden="true">…</span>}
      {last < pageCount && pageButton(pageCount)}
      <button disabled={page >= pageCount} onClick={() => onPage(page + 1)}>{nextLabel}</button>
    </nav>
  );
}
