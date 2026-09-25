import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveLocale } from '../../src/sdk/server';
import { canonical, languageOf, openGraphBase } from '../../src/sdk/seo';
import { tServer } from '../../src/sdk/serverI18n';
import Homepage from '../../src/views/Homepage';

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) return {};
  const lang = languageOf(resolved.localizedCatalog);

  const title = tServer(lang, 'category', 'homepage.heroTitle', 'Storefront');
  const description = tServer(lang, 'category', 'homepage.heroBody');

  return {
    title,
    description: description || undefined,
    alternates: { canonical: canonical(locale) },
    openGraph: { ...openGraphBase(resolved.localizedCatalog), type: 'website', title, description: description || undefined, url: canonical(locale) },
  };
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  if (!(await resolveLocale(locale))) notFound();
  return <Homepage />;
}
