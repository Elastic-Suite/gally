import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveLocale } from '../../../src/sdk/server';
import { languageOf, NOINDEX } from '../../../src/sdk/seo';
import { tServer } from '../../../src/sdk/serverI18n';
import View from '../../../src/views/VectorSearchPage';

type Params = { params: Promise<{ locale: string }> };

// Titled but noindex — see NOINDEX in src/sdk/seo.ts. No canonical: a page that should
// not be indexed should not nominate itself as the canonical version of anything.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) return {};
  const lang = languageOf(resolved.localizedCatalog);
  return { title: tServer(lang, 'common', 'meta.vectorSearch', 'Semantic search'), ...NOINDEX };
}

// No server pre-fetch, unlike /search. The view is a console: it owns a query the
// visitor is expected to change immediately, and seeding it would mean the server and
// the hook racing over which query the panels describe.
export default async function Page({ params }: Params) {
  const { locale } = await params;
  if (!(await resolveLocale(locale))) notFound();
  return <View />;
}
