import { ReactNode } from 'react';

// Loading skeletons shared by two callers that must not drift apart:
//
//  1. each route's app/**/loading.tsx, shown while the SERVER fetches (Phase 3 moved
//     that fetch off the client, and without a Suspense boundary a navigation simply
//     freezes on the old page for a second or more with no feedback at all);
//  2. the views' own `if (loading)` branches, still reached whenever the client
//     refetches — sorting, filtering or paging a category.
//
// These exist to hold the page's shape, not to look busy. Every one mirrors the
// structure and the measured dimensions of the real view it stands in for, because a
// skeleton whose layout differs from the content replacing it does not reduce layout
// shift — it causes it. The load-bearing numbers, all read from styles.css:
//
//   .catalog-page       grid-template-columns: 280px 1fr   <- sidebar MUST be present
//   .products-grid      repeat(auto-fill, minmax(220px, 1fr))
//   .skeleton-card-image / .product-card-image   both 180px
//   .product-detail     grid-template-columns: 1fr 1fr
//   .product-detail-image   aspect-ratio: 1
//   .blog-post-hero     320px
//
// Deliberately uses only existing .skeleton / .skeleton-shimmer / .skeleton-card /
// layout classes — no new CSS, no new visual primitive.
//
// These are Server Components (no 'use client'): a loading.tsx must render before any
// client JavaScript exists, which is the entire point.

// Category pages request pageSize 20, so a 6-card skeleton left the page ~14 cards
// shorter than the content that replaced it — a large, avoidable shift.
const CATEGORY_PAGE_SIZE = 20;

export function ProductGridSkeleton({ count = CATEGORY_PAGE_SIZE }: { count?: number }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-card-image skeleton-shimmer" />
          <div className="skeleton-card-body">
            <div className="skeleton skeleton-text" style={{ width: '80%' }} />
            <div className="skeleton skeleton-text" style={{ width: '50%', marginTop: '0.5rem' }} />
            <div className="skeleton skeleton-btn" style={{ width: '100px', marginTop: '0.75rem' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Body only — the rows inside the sidebar. Facets.tsx renders this INSIDE its own
// <aside> + <h3>, so the sidebar box, its sticky position and its heading never unmount
// when results are refetched: only the rows swap. Sharing the body keeps the two states
// the same height.
export function FacetsSkeletonBody() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="facet-group">
          <div className="skeleton skeleton-text" style={{ width: '100px', height: '12px', marginBottom: '0.75rem' }} />
          {Array.from({ length: 4 }).map((_, j) => (
            // Deterministic, NOT Math.random(): the server and the client each render
            // this skeleton and must agree, or React reports a hydration mismatch and
            // abandons the subtree. The formula only needs to look irregular.
            <div key={j} className="skeleton skeleton-text" style={{ width: `${60 + ((i * 7 + j * 13) % 31)}%`, height: '14px', marginBottom: '0.5rem' }} />
          ))}
        </div>
      ))}
    </>
  );
}

// Full sidebar including the shell, for the route-level loading.tsx, which renders before
// Facets exists at all. `title` is a skeleton bar rather than the translated heading
// because loading.tsx receives no params and so cannot know the locale; the bar is the
// same height, so the swap does not move anything.
export function FacetsSkeleton({ title, open }: { title?: ReactNode; open?: boolean }) {
  return (
    // `open` is the mobile drawer state, carried over from the branch this replaced —
    // without it the skeleton would render off-canvas while the real sidebar is open.
    <aside className={`facets-sidebar ${open ? 'open' : ''}`}>
      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', marginBottom: '1rem' }}>
        {title ?? <span className="skeleton skeleton-text" style={{ display: 'block', width: '90px', height: '1rem' }} />}
      </h3>
      <FacetsSkeletonBody />
    </aside>
  );
}

export function ProductPageSkeleton() {
  return (
    <div>
      {/* ProductPage's .page-title holds a breadcrumb only — no h1 — so one line. */}
      <div className="page-title">
        <div className="skeleton skeleton-text" style={{ width: '200px' }} />
      </div>
      <div className="product-detail">
        <div className="product-detail-image skeleton-shimmer" />
        <div className="product-detail-info">
          <div className="skeleton skeleton-text" style={{ width: '80px', height: '20px' }} />
          <div className="skeleton skeleton-text" style={{ width: '60%', height: '2rem', marginTop: '0.5rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '120px', height: '14px', marginTop: '0.5rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '150px', height: '1.8rem', marginTop: '1rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '100%', height: '60px', marginTop: '1.5rem' }} />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <div className="skeleton skeleton-btn" style={{ width: '160px' }} />
            <div className="skeleton skeleton-btn" style={{ width: '120px' }} />
          </div>
        </div>
      </div>
      {/* No recommendations skeleton on purpose: that slider renders only when the
          (separate, client-side) recommendations query returns rows, so reserving space
          for it would introduce a shift on every product that has none. */}
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <div className="blog-post">
      <div className="page-title">
        <div className="skeleton skeleton-text" style={{ width: '180px', height: '0.8rem' }} />
      </div>
      <div className="blog-post-hero skeleton-shimmer" />
      {/* .blog-post-title, then meta row, summary, and body copy — the article was
          previously represented by three lines, so the page grew substantially once the
          real content arrived. */}
      <div className="skeleton skeleton-text" style={{ width: '70%', height: '2.2rem', marginTop: '1.5rem' }} />
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <div className="skeleton skeleton-text" style={{ width: '90px', height: '1.25rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '120px', height: '1.25rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '80px', height: '1.25rem' }} />
      </div>
      <div className="skeleton skeleton-text" style={{ width: '95%', height: '1.2rem', marginTop: '1.5rem' }} />
      <div className="skeleton skeleton-text" style={{ width: '88%', height: '1.2rem', marginTop: '0.5rem' }} />
      {[97, 93, 99, 90, 96, 85, 94, 78].map((w, i) => (
        <div key={i} className="skeleton skeleton-text" style={{ width: `${w}%`, height: '1rem', marginTop: i === 0 ? '1.5rem' : '0.6rem' }} />
      ))}
    </div>
  );
}

// No nav skeleton: CategoryNav now renders in app/[locale]/category/layout.tsx, above
// this Suspense boundary, so it stays on screen and must NOT be drawn again here.
export function CategoryPageSkeleton() {
  return (
    <div>
      {/* Three lines: breadcrumb, h1 (1.8rem), and the item count. */}
      <div className="page-title">
        <div className="skeleton skeleton-text" style={{ width: '220px', height: '0.8rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '260px', height: '1.8rem', marginTop: '0.25rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '140px', height: '0.9rem', marginTop: '0.5rem' }} />
      </div>

      {/* The single most important line in this file: without the .catalog-page grid and
          a sidebar occupying its 280px column, the content grid renders full-width and
          then jumps to two columns the moment the real page arrives. */}
      <div className="catalog-page">
        <FacetsSkeleton />
        <div>
          <div className="products-header">
            <span className="skeleton skeleton-text" style={{ display: 'block', width: '120px', height: '1rem' }} />
            <div className="skeleton skeleton-text" style={{ width: '180px', height: '2.25rem' }} />
          </div>
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  );
}
