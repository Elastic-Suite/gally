import { notFound } from 'next/navigation';
import { resolveLocale, fetchCategoryProducts } from '../../../../src/sdk/server';

// The category existence check is NOT here. It moved to page.tsx and its generateMetadata,
// because what a missing category means depends on the `?from=` switch marker and Next does not
// give a layout its search params — a layout does not rerender on navigation, so they would be
// stale. Both remaining callers still 404 before the response flushes, which is what the check
// was in the layout for. See specs/feature-catalog-switch-missing-target.md.
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
