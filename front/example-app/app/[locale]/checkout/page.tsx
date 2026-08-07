import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveLocale } from '../../../src/sdk/server';
import { languageOf, NOINDEX } from '../../../src/sdk/seo';
import { tServer } from '../../../src/sdk/serverI18n';
import View from '../../../src/views/CheckoutPage';

type Params = { params: Promise<{ locale: string }> };

// Titled but noindex — see NOINDEX in src/sdk/seo.ts for why this route must not be
// indexed. No canonical: a page that should not be indexed should not be nominating
// itself as the canonical version of anything.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) return {};
  const lang = languageOf(resolved.localizedCatalog);
  return { title: tServer(lang, 'common', 'meta.checkout', 'Checkout'), ...NOINDEX };
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  if (!(await resolveLocale(locale))) notFound();
  return <View />;
}
