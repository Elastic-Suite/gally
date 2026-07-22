import { useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import ProductCard from '../components/ProductCard';

export default function VectorSearchPage() {
  const [query, setQuery] = useState('summer lightweight eyewear');

  // Standard search
  const standard = useSearch({ searchQuery: query, pageSize: 6 });
  // For demo: vector search would use a different endpoint/flag
  // Here we simulate by using same query — in real implementation the API handles vector vs keyword
  const vector = useSearch({ searchQuery: query, pageSize: 6 });

  return (
    <div>
      <div className="page-title">
        <div className="breadcrumb">Home / Vector Search Comparison</div>
        <h1>Vector Search Preview</h1>
      </div>

      <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', maxWidth: '700px' }}>
        Compare standard keyword search with AI-powered vector search. Vector search understands
        semantic meaning — finding relevant products even when exact keywords don't match.
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          className="search-bar"
          style={{
            background: 'white',
            color: 'var(--gray-900)',
            border: '2px solid var(--indigo-200)',
            width: '100%',
            maxWidth: '500px',
            padding: '0.75rem 1.25rem',
            fontSize: '1rem',
          }}
          placeholder="Enter a semantic query…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      <div className="vector-compare">
        {/* Standard Search */}
        <div className="vector-panel">
          <h3>🔤 Standard Keyword Search</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
            Matches exact keywords in product titles and descriptions
          </p>
          {standard.loading ? (
            <div className="loading"><div className="loading-spinner" /> Loading…</div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {standard.products.length > 0 ? (
                standard.products.map((p: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--gray-50)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', width: '20px' }}>#{i + 1}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{p.sku}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <p>No keyword matches found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Vector Search */}
        <div className="vector-panel boosted">
          <h3>🧠 AI Vector Search</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
            Understands intent and semantic meaning for better relevance
          </p>
          {vector.loading ? (
            <div className="loading"><div className="loading-spinner" /> Loading…</div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {vector.products.length > 0 ? (
                vector.products.map((p: any, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 107, 107, 0.05)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--coral-500)', width: '20px', fontWeight: 700 }}>#{i + 1}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{p.sku}</div>
                    </div>
                    {i === 0 && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: 'var(--coral-500)', color: 'white', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-pill)' }}>Best Match</span>}
                  </div>
                ))
              ) : (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <p>No vector results yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Show products as cards below */}
      {vector.products.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Vector Search Results</h2>
          <div className="products-grid">
            {vector.products.map((p: any, i: number) => (
              <ProductCard key={p.sku || i} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
