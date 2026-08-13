import { notFound } from 'next/navigation';
import { resolveLocale, fetchCmsPageById } from '../../../../src/sdk/server';

// See app/[locale]/product/[sku]/layout.tsx — the existence check lives in the layout so the
// 404 status is set before any of the page is produced.
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
  if (!(await fetchCmsPageById(resolved.localizedCatalog.code, id))) notFound();
  return <>{children}</>;
}
