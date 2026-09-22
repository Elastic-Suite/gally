import { notFound } from 'next/navigation';
import { resolveLocale, fetchCmsPageById } from '../../../../src/sdk/server';

// The article existence check is NOT here. It moved to page.tsx and its generateMetadata, which
// can read the `?from=` catalog-switch marker; a layout cannot, because Next does not give it
// search params. Both of those still run before the response flushes — there is no `loading.tsx`
// and no Suspense boundary left (specs/bugfix-ssr-product-list-behind-suspense.md) — so the 404
// status is set exactly as it was. See specs/feature-catalog-switch-missing-target.md.
//
// What stays is the locale check and the cache()d fetch, which warms the article for the page.
export default async function ArticleGuard({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) notFound();
  await fetchCmsPageById(resolved.localizedCatalog.code, id);
  return <>{children}</>;
}
