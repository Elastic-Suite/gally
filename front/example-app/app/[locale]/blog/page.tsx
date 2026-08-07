import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveLocale } from '../../../src/sdk/server';
import { canonical, languageOf, openGraphBase } from '../../../src/sdk/seo';
import { tServer } from '../../../src/sdk/serverI18n';
import BlogPage from '../../../src/views/BlogPage';

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) return {};
  const lang = languageOf(resolved.localizedCatalog);

  const title = tServer(lang, 'blog', 'title', 'Blog');
  const description = tServer(lang, 'blog', 'intro');

  return {
    title,
    description: description || undefined,
    alternates: { canonical: canonical(locale, '/blog') },
    openGraph: { ...openGraphBase(resolved.localizedCatalog), type: 'website', title, description: description || undefined, url: canonical(locale, '/blog') },
  };
}

export default async function Page({ params }: Params) {
  const { locale } = await params;
  if (!(await resolveLocale(locale))) notFound();
  return <BlogPage />;
}
