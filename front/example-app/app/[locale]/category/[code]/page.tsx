import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveLocale, fetchCategoryProducts, cachedCategoryTree } from '../../../../src/sdk/server';
import { ICategoryNode } from '../../../../src/sdk/catalogs';
import { findTrail } from '../../../../src/sdk/categoryTree';
import { getProductFields } from '../../../../src/sdk/productFields';
import { SITE, canonical, languageOf, openGraphBase } from '../../../../src/sdk/seo';
import { tServer } from '../../../../src/sdk/serverI18n';
import JsonLd from '../../../../src/components/JsonLd';
import CategoryPage from '../../../../src/views/CategoryPage';

type Params = { params: Promise<{ locale: string; code: string }> };

// The category tree is the only place a category's display name lives — the product
// search response carries no category entity — so metadata and breadcrumbs both read it.
async function categoryTrail(
  catalogId: number,
  localizedCatalogId: number,
  code: string
): Promise<ICategoryNode[]> {
  const tree = await cachedCategoryTree(catalogId, localizedCatalogId);
  return findTrail(tree, code) ?? [];
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, code } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) return {};
  const lang = languageOf(resolved.localizedCatalog);

  const trail = await categoryTrail(resolved.catalog.id, resolved.localizedCatalog.id, code);
  // Kept alongside the layout guard rather than relying on the page body alone: metadata
  // resolves before the response flushes, so this is the last point at which a real 404
  // status is reachable if a Suspense boundary is ever reintroduced above this route (it
  // would make the page stream, and a streamed notFound() can only paint 404 UI under a
  // 200). The fetch is cache()d, so it costs nothing. See
  // specs/bugfix-ssr-product-list-behind-suspense.md.
  if (trail.length === 0) notFound();

  const category = trail[trail.length - 1];
  const title = category.name;
  const url = canonical(locale, `/category/${encodeURIComponent(code)}`);

  // The count comes from the same cache()d fetch the page body uses, so this costs
  // nothing extra and the description states something true rather than boilerplate.
  const { total, products } = await fetchCategoryProducts(resolved.localizedCatalog.code, code);
  const description = tServer(
    lang, 'category', 'category.meta.description',
    'Browse our {{name}} selection: {{count}} products available.',
    { name: title, count: total }
  );
  const firstImage = products[0] ? getProductFields(products[0]).image : '';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...openGraphBase(resolved.localizedCatalog),
      type: 'website',
      title,
      description,
      url,
      images: firstImage ? [firstImage] : undefined,
    },
  };
}

export default async function Page({ params }: Params) {
  const { locale, code } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) notFound();
  const lang = languageOf(resolved.localizedCatalog);

  // Only the first page, unsorted and unfiltered — that is the URL a crawler sees.
  // CategoryPage itself decides whether the current view still matches this and
  // refetches when the user sorts, filters or pages.
  const initialData = await fetchCategoryProducts(resolved.localizedCatalog.code, code);
  const trail = await categoryTrail(resolved.catalog.id, resolved.localizedCatalog.id, code);

  // An id that matches no category still returns an empty product list rather than an
  // error, which would render an empty page under a 200 for any junk URL.
  if (trail.length === 0) notFound();

  const category = trail[trail.length - 1];
  const url = canonical(locale, `/category/${encodeURIComponent(code)}`);

  const breadcrumb = [
    {
      '@type': 'ListItem',
      position: 1,
      name: tServer(lang, 'common', 'meta.home', 'Home'),
      item: canonical(locale),
    },
    ...trail.map((node, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name: node.name,
      item: canonical(locale, `/category/${encodeURIComponent(String(node.id))}`),
    })),
  ];

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumb,
        }}
      />
      {/* The listing itself. Without this a crawler could see the category exists but
          nothing about what it contains — a product listing page that describes only its
          own breadcrumb is the one thing this page must not be. ItemList carries the
          first page only, matching the canonical URL and what is server-rendered. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: category.name,
          url,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: initialData.products.length,
            itemListElement: initialData.products.map((doc: any, i: number) => {
              const p = getProductFields(doc);
              return {
                '@type': 'ListItem',
                position: i + 1,
                item: {
                  '@type': 'Product',
                  name: p.name,
                  sku: p.sku,
                  image: p.image || undefined,
                  url: canonical(locale, `/product/${encodeURIComponent(p.sku)}`),
                  offers: {
                    '@type': 'Offer',
                    price: p.price,
                    priceCurrency: resolved.localizedCatalog.currency,
                    availability: p.available
                      ? 'https://schema.org/InStock'
                      : 'https://schema.org/OutOfStock',
                  },
                },
              };
            }),
          },
        }}
      />
      <CategoryPage initialData={initialData} />
    </>
  );
}
