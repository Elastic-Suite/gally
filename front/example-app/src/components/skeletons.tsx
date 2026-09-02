import { ReactNode } from 'react';

// Loading skeletons shared by two callers that must not drift apart:
//
//  1. RouteSkeleton.tsx, shown while a client-side navigation waits for the server. These
//     used to be a `loading.tsx` per route, which is a Suspense boundary — and a boundary
//     also defers the FIRST document, streaming the real page into a `<div hidden>` that a
//     script moves into place, so the product list did not exist for a client with
//     JavaScript off. See specs/bugfix-ssr-product-list-behind-suspense.md;
//  2. the views' own `if (loading)` branches, still reached whenever the client
//     refetches — sorting, filtering or paging a category.
//
// These exist to hold the page's shape, not to look busy. Every one mirrors the
// structure and the measured dimensions of the real view it stands in for, because a
// skeleton whose layout differs from the content replacing it does not reduce layout
// shift — it causes it. The load-bearing numbers, all read from styles.css:
//
//   .catalog-page       grid-template-columns: 280px 1fr   <- sidebar MUST be present
//   .products-grid      repeat(auto-fill, minmax(min(var(--product-grid-column), 100%), 1fr))
//   .skeleton-card-image / .product-card-image   both var(--product-card-image-height)
//   .skeleton-card-body / .product-card-body     both var(--product-card-body-padding)
//
// Those three variables are why this file needs no size of its own: .products-grid raises them
// above a 1200px viewport (220->340px column, 180->300px picture) and the skeleton follows the
// card automatically. Do not hardcode a height back in — see
// specs/feature-larger-product-grid.md.
//   .product-detail     grid-template-columns: 1fr 1fr
//   .product-detail-image   aspect-ratio: 1
//   .blog-post-hero     320px
//
// Deliberately uses only existing .skeleton / .skeleton-shimmer / .skeleton-card /
// layout classes — no new CSS, no new visual primitive.
//
// No 'use client' here, so this module can be pulled into either side: Facets.tsx and
// RouteSkeleton.tsx import it from client components, and it stays renderable on the server
// for anything that ever needs a skeleton before client JavaScript exists.

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

// Full sidebar including the shell, for RouteSkeleton, which renders before
// Facets exists at all. `title` is a skeleton bar rather than the translated heading
// because the pending-navigation skeleton has no params and so cannot know the locale, and
// picking one from the route being LEFT would be wrong; the bar is the
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

// SearchPage's shape, which differs from a category's in two ways that matter: its
// .page-title is two lines (breadcrumb + h1, no count — the count lives in the switch),
// and the products/articles switch sits between the title and the grid. Reserving the
// switch row is the load-bearing part; it is ~2.5rem plus a 1.5rem margin, and without it
// the whole listing jumps up when the real page arrives.
export function SearchPageSkeleton() {
  return (
    <div>
      <div className="page-title">
        <div className="skeleton skeleton-text" style={{ width: '180px', height: '0.8rem' }} />
        <div className="skeleton skeleton-text" style={{ width: '320px', height: '1.8rem', marginTop: '0.25rem' }} />
      </div>

      <div className="result-type-switch-row">
        {/* The real control is a pill-shaped segmented switch; one bar of the same
            height and radius stands in for it rather than two fake segments. */}
        <div className="skeleton" style={{ width: '280px', height: '2.5rem', borderRadius: 'var(--radius-pill)' }} />
      </div>

      <div className="catalog-page">
        <FacetsSkeleton />
        <div>
          <div className="products-header">
            <span className="skeleton skeleton-text" style={{ display: 'block', width: '140px', height: '1rem' }} />
            <div className="skeleton skeleton-text" style={{ width: '180px', height: '2.25rem' }} />
          </div>
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  );
}

// No nav skeleton here: RouteSkeleton draws CategoryNav itself, above this, because the
// pending-navigation swap replaces everything inside <main> — including the category layout
// the real nav lives in. Adding a second one here would double it.
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
