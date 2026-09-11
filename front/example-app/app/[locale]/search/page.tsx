import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveLocale, fetchSearchProducts } from '../../../src/sdk/server';
import { languageOf, NOINDEX } from '../../../src/sdk/seo';
import { tServer } from '../../../src/sdk/serverI18n';
import View from '../../../src/views/SearchPage';

type Params = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// Titled but noindex — see NOINDEX in src/sdk/seo.ts for why this route must not be
// indexed. No canonical: a page that should not be indexed should not be nominating
// itself as the canonical version of anything.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) return {};
  const lang = languageOf(resolved.localizedCatalog);
  return { title: tServer(lang, 'common', 'meta.search', 'Search'), ...NOINDEX };
}

export default async function Page({ params, searchParams }: Params) {
  const { locale } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) notFound();

  const sp = await searchParams;
  const q = typeof sp.q === 'string' ? sp.q : '';

  // Noindex, so this fetch is not for a crawler: it is here because the page previously
  // rendered a skeleton and nothing else until the browser's own request came back, on
  // every arrival from the header search. Skipped when the URL carries pre-applied
  // `f_<field>` filters (the autocomplete panel's attribute hand-off), because the view
  // seeds those into state on its first render and the server result would not match —
  // SearchPage passes initialData through only while the view still matches this request.
  const hasUrlFilters = Object.keys(sp).some(key => key.startsWith('f_'));
  const initialData = hasUrlFilters
    ? undefined
    : await fetchSearchProducts(resolved.localizedCatalog.code, q);

  return <View initialData={initialData} />;
}
