import { useParams } from 'react-router-dom';

const CMS_PAGES: Record<string, { title: string; content: string[] }> = {
  about: {
    title: 'About ElasticSuite',
    content: [
      'ElasticSuite is the leading open-source searchandising solution for e-commerce, powering hundreds of online stores worldwide.',
      'Built on cutting-edge AI and Elasticsearch technology, our platform delivers intelligent search, dynamic faceting, and personalized product recommendations that drive conversion.',
      'From small boutiques to enterprise retailers, ElasticSuite adapts to your catalog and your customers\' behavior, continuously learning and optimizing to deliver the best possible shopping experience.',
      'Our latest innovation, Gally, brings vector search capabilities that understand semantic meaning — so when a customer searches for "summer eyewear", they find exactly what they\'re looking for, even if the product title says "UV-protection sunglasses".',
    ],
  },
  'shipping-returns': {
    title: 'Shipping & Returns',
    content: [
      'We offer free standard shipping on all orders over €50. Express delivery is available at checkout.',
      'Standard shipping: 3-5 business days. Express: 1-2 business days.',
      'Returns are accepted within 30 days of delivery. Items must be unused and in original packaging.',
      'To initiate a return, please contact our customer service team or use the returns portal in your account dashboard.',
    ],
  },
  faq: {
    title: 'Frequently Asked Questions',
    content: [
      'How does ElasticSuite improve search? — Our AI analyzes customer behavior patterns to surface the most relevant results, reducing "no results" pages by up to 40%.',
      'What is vector search? — Vector search uses AI embeddings to understand the meaning behind search queries, not just keyword matching. This enables semantic search that understands intent.',
      'Can I customize facets? — Yes! ElasticSuite supports slider facets for prices, swatches for colors, boolean toggles, and hierarchical category trees — all configurable per catalog.',
      'How does event tracking work? — The SDK automatically tracks page views, searches, product views, add-to-cart events, and orders to optimize search relevance over time.',
    ],
  },
};

export default function CmsPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = CMS_PAGES[slug || 'about'] || CMS_PAGES.about;

  return (
    <div className="cms-page">
      <div className="page-title">
        <div className="breadcrumb">Home / Pages / {page.title}</div>
      </div>
      <h1>{page.title}</h1>
      {page.content.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}
