import { notFound } from 'next/navigation';
import { resolveLocale, cachedCategoryTree } from '../../../../src/sdk/server';
import { findTrail } from '../../../../src/sdk/categoryTree';

// See app/[locale]/product/[sku]/layout.tsx — the existence check must run outside the
// Suspense boundary loading.tsx creates, or the 404 status is already lost.
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
  return <>{children}</>;
}
