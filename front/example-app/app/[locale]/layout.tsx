import { notFound } from 'next/navigation';
import Providers from '../providers';
import {
  fetchCatalogs,
  fetchCategoryTree,
  findLocalizedCatalog,
} from '../../src/sdk/catalogs';
import { fetchAxisLabels } from '../../src/sdk/axisLabels';

// THE point of Phase 2: the catalog is resolved here, on the server, from the URL
// segment — before a single component renders. The SPA used to mount with no catalog,
// fetch the list in a useEffect, then re-render; that round trip (and its flash of
// empty state) is gone, and a crawler now gets a page that already knows its catalog,
// currency and language.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // Async in Next 15+ — must be awaited.
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const catalogs = await fetchCatalogs();
  const resolved = findLocalizedCatalog(catalogs, locale);

  // An unknown segment is a genuine 404, not a silent fallback to the default catalog:
  // quietly serving different content under a wrong URL is how duplicate-content and
  // soft-404 problems get baked in before the SEO phases even start.
  if (!resolved) notFound();

  // Both depend only on the resolved catalog, so they go out together rather than in series.
  // The axis labels are what a configurable product's headings are rendered from; fetching them
  // here is what puts them in the SSR HTML instead of appearing on hydration.
  const [categories, axisLabels] = await Promise.all([
    fetchCategoryTree(resolved.catalog.id, resolved.localizedCatalog.id),
    fetchAxisLabels(resolved.localizedCatalog.code, resolved.catalog.code),
  ]);

  return (
    <Providers
      locale={locale}
      catalogs={catalogs}
      selectedCatalog={resolved.catalog}
      selectedLocalizedCatalog={resolved.localizedCatalog}
      categories={categories}
      axisLabels={axisLabels}
    >
      {children}
    </Providers>
  );
}
