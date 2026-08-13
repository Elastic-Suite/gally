import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveLocale, fetchCmsPageById } from '../../../../src/sdk/server';
import { getCmsFields } from '../../../../src/sdk/cmsFields';
import { SITE, toMetaDescription, openGraphBase } from '../../../../src/sdk/seo';
import JsonLd from '../../../../src/components/JsonLd';
import BlogPostPage from '../../../../src/views/BlogPostPage';

type Params = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, id } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) return {};

  const doc = await fetchCmsPageById(resolved.localizedCatalog.code, id);
  // Kept alongside the layout guard rather than relying on the page body alone: metadata
  // resolves before the response flushes, so this is the last point at which a real 404
  // status is reachable if a Suspense boundary is ever reintroduced above this route (it
  // would make the page stream, and a streamed notFound() can only paint 404 UI under a
  // 200). The fetch is cache()d, so it costs nothing. See
  // specs/bugfix-ssr-product-list-behind-suspense.md.
  if (!doc) notFound();

  const post = getCmsFields(doc);
  const url = `${SITE}/${locale}/blog/${encodeURIComponent(post.id)}`;

  return {
    title: post.title,
    description: toMetaDescription(post.summary),
    alternates: { canonical: url },
    openGraph: {
      ...openGraphBase(resolved.localizedCatalog),
      type: 'article',
      title: post.title,
      description: toMetaDescription(post.summary),
      url,
      images: post.image ? [post.image] : undefined,
      publishedTime: post.publishedAt || undefined,
    },
  };
}

export default async function Page({ params }: Params) {
  const { locale, id } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) notFound();

  const doc = await fetchCmsPageById(resolved.localizedCatalog.code, id);
  if (!doc) notFound();

  const post = getCmsFields(doc);
  const url = `${SITE}/${locale}/blog/${encodeURIComponent(post.id)}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: toMetaDescription(post.summary),
          image: post.image || undefined,
          datePublished: post.publishedAt || undefined,
          author: post.author
            ? { '@type': 'Person', name: post.author.label }
            : undefined,
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/${locale}` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/${locale}/blog` },
            { '@type': 'ListItem', position: 3, name: post.title, item: url },
          ],
        }}
      />
      {/* Passed the already-mapped CmsPage, which is the shape useCmsSearch returns —
          initialPages seeds the hook's state directly, so no mount refetch. */}
      <BlogPostPage initialPost={post} />
    </>
  );
}
