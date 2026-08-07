import { notFound } from 'next/navigation';
import { resolveLocale, fetchProductBySku } from '../../../../src/sdk/server';

// Existence check lives in the LAYOUT, not the page, because layouts render outside the
// Suspense boundary that loading.tsx creates. The page streams, so by the time it runs
// the 200 header is already flushed and notFound() there can only render the 404 UI —
// a soft-404. Blocking here is the only place a real 404 status is still possible.
// The fetch is cache()d, so the page reuses this result rather than refetching.
export default async function ProductGuard({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; sku: string }>;
}) {
  const { locale, sku } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) notFound();
  if (!(await fetchProductBySku(resolved.localizedCatalog.code, sku))) notFound();
  return <>{children}</>;
}
