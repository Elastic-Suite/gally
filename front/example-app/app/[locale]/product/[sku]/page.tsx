import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveLocale, fetchProductBySku, cachedCategoryTree } from '../../../../src/sdk/server';
import { getProductFields } from '../../../../src/sdk/productFields';
import { productCategoryTrail } from '../../../../src/sdk/categoryTree';
import { missingInCatalog, RouteSearchParams } from '../../../../src/sdk/catalogSwitch';
import { SITE, canonical, languageOf, toMetaDescription, openGraphBase } from '../../../../src/sdk/seo';
import { tServer } from '../../../../src/sdk/serverI18n';
import JsonLd from '../../../../src/components/JsonLd';
import ProductPage from '../../../../src/views/ProductPage';

type Params = {
  params: Promise<{ locale: string; sku: string }>;
  // See the same prop on the category route: the catalog-switch marker, which a layout cannot
  // read.
  searchParams: Promise<RouteSearchParams>;
};

// Both this and the page body call the same cache()d fetchers, so the product and the
// catalog are each fetched once per render pass despite being needed twice.
export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const { locale, sku } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) return {};

  const doc = await fetchProductBySku(resolved.localizedCatalog.code, sku);
  // Metadata resolves before the response flushes, so this is the last point at which a real
  // 404 status is reachable if a Suspense boundary is ever reintroduced above this route (it
  // would make the page stream, and a streamed notFound() can only paint 404 UI under a
  // 200). The fetch is cache()d, so it costs nothing. See
  // specs/bugfix-ssr-product-list-behind-suspense.md.
  if (!doc) await missingInCatalog(locale, resolved, await searchParams);

  const p = getProductFields(doc);
  const description =
    toMetaDescription(p.description) ||
    `${p.name} — available in the Gally demo storefront.`;

  return {
    title: p.name,
    description,
    alternates: { canonical: `${SITE}/${locale}/product/${encodeURIComponent(p.sku)}` },
    openGraph: {
      ...openGraphBase(resolved.localizedCatalog),
      type: 'website',
      title: p.name,
      description,
      url: `${SITE}/${locale}/product/${encodeURIComponent(p.sku)}`,
      images: p.image ? [p.image] : undefined,
    },
  };
}

export default async function Page({ params, searchParams }: Params) {
  const { locale, sku } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) notFound();

  const doc = await fetchProductBySku(resolved.localizedCatalog.code, sku);

  // A missing product is a real 404. Falling through to the client would render the
  // "not found" state under a 200, which is exactly the soft-404 an SEO demo must not ship.
  // A catalog switch is the one exception — the SKU belongs to the catalog just left.
  if (!doc) await missingInCatalog(locale, resolved, await searchParams);

  const p = getProductFields(doc);
  const productUrl = `${SITE}/${locale}/product/${encodeURIComponent(p.sku)}`;

  const tree = await cachedCategoryTree(resolved.catalog.id, resolved.localizedCatalog.id);
  const categoryTrail = productCategoryTrail(tree, doc?.source);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: p.name,
          sku: p.sku,
          // Plain text, not the raw HTML: schema.org's description is a text field,
          // and structured-data validators flag embedded markup.
          description: toMetaDescription(p.description, 5000),
          image: p.image || undefined,
          offers: {
            '@type': 'Offer',
            price: p.price,
            priceCurrency: resolved.localizedCatalog.currency,
            // Same `available` the page body renders from. Structured data that claims InStock
            // while the visible page says out of stock is a validator error, not a detail.
            availability: p.available
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            url: productUrl,
          },
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          // The category path down to this product, so the structured data says the same
          // thing the visible breadcrumb does — both from productCategoryTrail(). The tree
          // fetch is cache()d and the layout already made it, so this costs nothing.
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: tServer(languageOf(resolved.localizedCatalog), 'common', 'meta.home', 'Home'),
              item: canonical(locale),
            },
            ...categoryTrail.map((node, i) => ({
              '@type': 'ListItem',
              position: i + 2,
              name: node.name,
              item: canonical(locale, `/category/${encodeURIComponent(String(node.id))}`),
            })),
            {
              '@type': 'ListItem',
              position: categoryTrail.length + 2,
              name: p.name,
              item: productUrl,
            },
          ],
        }}
      />
      {/* The interactive product view, seeded with the document already fetched above:
          it renders complete on the server and does not refetch after hydration. */}
      <ProductPage initialProduct={doc} />
    </>
  );
}
