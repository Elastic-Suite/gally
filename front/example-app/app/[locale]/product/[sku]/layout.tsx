import { notFound } from 'next/navigation';
import { resolveLocale, fetchProductBySku } from '../../../../src/sdk/server';

// Existence check lives in the LAYOUT, not the page. It was originally the only place a real
// 404 status was reachable: `loading.tsx` made the page stream, so by the time it ran the 200
// header was already flushed and notFound() there could paint 404 UI but not set the status.
// Those boundaries are gone (specs/bugfix-ssr-product-list-behind-suspense.md), so a page-body
// notFound() would work too — but this keeps the guarantee independent of that, and the fetch
// is cache()d, so the page reuses this result rather than refetching.
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
