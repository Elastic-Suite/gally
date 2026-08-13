'use client';

import { ReactElement } from 'react';
import CategoryNav from './CategoryNav';
import {
  BlogPostSkeleton, CategoryPageSkeleton, ProductPageSkeleton, SearchPageSkeleton,
} from './skeletons';

// Picks the skeleton for a navigation in flight, from the href it is heading to. The route
// files can no longer do this — a `loading.tsx` would put the skeleton back in the initial
// HTML and push the real page into a `<div hidden>` (see
// specs/bugfix-ssr-product-list-behind-suspense.md) — so the destination is read from the
// URL instead, in the one place that knows a navigation is pending.
//
// Only the four server-fetched routes get one. Everywhere else returns null, which tells
// AppShell to keep the current page on screen: those routes render from data the client
// already has, so they commit immediately and a skeleton would only flash.
export default function RouteSkeleton({ href }: { href: string }): ReactElement | null {
  // Drop the locale segment: hrefs arrive prefixed (/com_fr/category/cat_11), and matching
  // on the rest keeps this independent of how many catalogs exist.
  const path = `/${href.replace(/^\/+/, '').split('/').slice(1).join('/')}`;

  if (path.startsWith('/category/')) {
    // CategoryNav lives in app/[locale]/category/layout.tsx, which is inside the children
    // AppShell swaps out — so without drawing it here the shared nav bar would blink out on
    // every category click, the exact regression
    // specs/feature-persist-shared-ui-across-navigation.md fixed. It renders from
    // CatalogContext, so it costs nothing and looks identical; only CategoryItem's hover
    // state is lost, and the pointer has just left the link anyway.
    return (
      <>
        <CategoryNav />
        <CategoryPageSkeleton />
      </>
    );
  }
  if (path.startsWith('/product/')) return <ProductPageSkeleton />;
  // The blog LIST is client-fetched and renders its own loading state; only an article has
  // a server fetch to wait on.
  if (path.startsWith('/blog/')) return <BlogPostSkeleton />;
  if (path === '/search' || path.startsWith('/search?')) return <SearchPageSkeleton />;

  return null;
}
