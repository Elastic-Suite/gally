import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveLocale } from '../../../../src/sdk/server';
import { canonical, languageOf, openGraphBase, toMetaDescription } from '../../../../src/sdk/seo';
import { tServer, tServerFirst } from '../../../../src/sdk/serverI18n';
import CmsPage from '../../../../src/views/CmsPage';

type Params = { params: Promise<{ locale: string; slug: string }> };

// Mirrors CMS_PAGE_KEYS in src/views/CmsPage.tsx. These pages are i18n strings, not
// indexed cms_page documents, so there is nothing to fetch — only to translate.
const CMS_PAGE_KEYS: Record<string, string> = {
  about: 'about',
  'shipping-returns': 'shippingReturns',
  faq: 'faq',
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) return {};
  const lang = languageOf(resolved.localizedCatalog);

  const key = CMS_PAGE_KEYS[slug] || CMS_PAGE_KEYS.about;
  const title = tServer(lang, 'cms', `${key}.title`, 'Information');
  const description = toMetaDescription(tServerFirst(lang, 'cms', `${key}.content`));
  const url = canonical(locale, `/cms/${encodeURIComponent(slug)}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { ...openGraphBase(resolved.localizedCatalog), type: 'article', title, description, url },
  };
}

export default async function Page({ params }: Params) {
  const { locale, slug } = await params;
  if (!(await resolveLocale(locale))) notFound();
  // An unmapped slug would silently render the About page under its own URL —
  // duplicate content on an unbounded set of URLs.
  if (!CMS_PAGE_KEYS[slug]) notFound();
  return <CmsPage />;
}
