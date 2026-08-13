import { notFound } from 'next/navigation';
import {
  resolveLocale,
  cachedCategoryTree,
  fetchCategoryProducts,
} from '../../../../src/sdk/server';
import { findTrail } from '../../../../src/sdk/categoryTree';

// See app/[locale]/product/[sku]/layout.tsx — the existence check lives in the layout so the
// 404 status is set before anything of the page is produced.
export default async function CategoryGuard({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; code: string }>;
}) {
  const { locale, code } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) notFound();
  const tree = await cachedCategoryTree(resolved.catalog.id, resolved.localizedCatalog.id);
  if (!findTrail(tree, code)) notFound();

  // Awaited HERE, and thrown away, on purpose: the listing is resolved before `children`
  // render, so the page component finds a cache() hit. Not a wasted request —
  // fetchCategoryProducts is cache()d, so the page body and generateMetadata reuse this one,
  // and the guard and the page therefore describe the same catalog state.
  //
  // Keep the arguments identical to page.tsx's call: a different pageSize is a different
  // cache key, which turns this into a second HTTP request rather than a warm-up.
  await fetchCategoryProducts(resolved.localizedCatalog.code, code);

  return <>{children}</>;
}
