import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { resolveLocale, fetchProductBySku } from '../../../../src/sdk/server';
import { getProductFields } from '../../../../src/sdk/productFields';
import { SITE, toMetaDescription, openGraphBase } from '../../../../src/sdk/seo';
import JsonLd from '../../../../src/components/JsonLd';
import ProductPage from '../../../../src/views/ProductPage';

type Params = { params: Promise<{ locale: string; sku: string }> };

// Both this and the page body call the same cache()d fetchers, so the product and the
// catalog are each fetched once per render pass despite being needed twice.
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, sku } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) return {};

  const doc = await fetchProductBySku(resolved.localizedCatalog.code, sku);
  // Kept alongside the layout guard rather than relying on the page body alone: metadata
  // resolves before the response flushes, so this is the last point at which a real 404
  // status is reachable if a Suspense boundary is ever reintroduced above this route (it
  // would make the page stream, and a streamed notFound() can only paint 404 UI under a
  // 200). The fetch is cache()d, so it costs nothing. See
  // specs/bugfix-ssr-product-list-behind-suspense.md.
  if (!doc) notFound();

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

export default async function Page({ params }: Params) {
  const { locale, sku } = await params;
  const resolved = await resolveLocale(locale);
  if (!resolved) notFound();

  const doc = await fetchProductBySku(resolved.localizedCatalog.code, sku);

  // A missing product is a real 404. Falling through to the client would render the
  // "not found" state under a 200, which is exactly the soft-404 an SEO demo must not ship.
  if (!doc) notFound();

  const p = getProductFields(doc);
  const productUrl = `${SITE}/${locale}/product/${encodeURIComponent(p.sku)}`;

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
            availability: p.stock?.status
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
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/${locale}` },
            { '@type': 'ListItem', position: 2, name: p.name, item: productUrl },
          ],
        }}
      />
      {/* The interactive product view, seeded with the document already fetched above:
          it renders complete on the server and does not refetch after hydration. */}
      <ProductPage initialProduct={doc} />
    </>
  );
}
