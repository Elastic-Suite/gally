import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCatalog } from '../contexts/CatalogContext';

const BASE_URI = 'https://gally.localhost/api';
const AUTH_EMAIL = 'admin@example.com';
const AUTH_PASSWORD = 'apassword';

interface ExplainMatch {
  field: string;
  originalField: string;
  analyzer: string;
  weight: number;
  score: number;
  synonym: string;
}

interface ExplainBoost {
  boost_mode: string;
  weight: number;
  total: number;
  score_mode: string;
  details: any[];
}

interface ExplainProduct {
  id: string;
  sku: string;
  name: string;
  score: number;
  boosts: ExplainBoost | null;
  matches: ExplainMatch[];
  legends: Record<string, { field: string; legend: string }>;
}

async function getToken(): Promise<string> {
  const cached = sessionStorage.getItem('gally_explain_token');
  if (cached) {
    try {
      const payload = JSON.parse(atob(cached.split('.')[1]));
      if (payload.exp * 1000 > Date.now()) return cached;
    } catch { /* token invalid, refresh */ }
  }

  const res = await fetch(`${BASE_URI}/authentication_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: AUTH_EMAIL, password: AUTH_PASSWORD }),
  });
  const data = await res.json();
  if (data.token) {
    sessionStorage.setItem('gally_explain_token', data.token);
    return data.token;
  }
  throw new Error('Auth failed');
}

async function fetchExplain(
  localizedCatalog: string,
  opts: { query?: string; categoryId?: string },
  pageSize = 5,
): Promise<ExplainProduct[]> {
  const token = await getToken();
  const isSearch = !!opts.query;
  const requestType = isSearch ? 'product_search' : 'product_catalog';
  const args = [
    `localizedCatalog: "${localizedCatalog}"`,
    `requestType: ${requestType}`,
    `pageSize: ${pageSize}`,
  ];
  if (opts.query) args.push(`search: "${opts.query.replace(/"/g, '\\"')}"`);
  if (opts.categoryId) args.push(`currentCategoryId: "${opts.categoryId}"`);

  const gql = `{ explain(${args.join(', ')}) { collection { id sku name score boosts matches legends } } }`;

  const res = await fetch(`${BASE_URI}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: gql }),
  });
  const data = await res.json();
  return data?.data?.explain?.collection || [];
}

export default function SearchExplain() {
  const { t } = useTranslation('demo');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<ExplainProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { selectedLocalizedCatalog } = useCatalog();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const lastKeyRef = useRef('');

  const query = searchParams.get('q') || '';
  const isSearchPage = location.pathname === '/search';
  const isCategoryPage = location.pathname.startsWith('/category/');
  const categoryCode = isCategoryPage ? location.pathname.split('/category/')[1] : '';

  const contextLabel = isSearchPage ? `"${query}"` : categoryCode ? t('explain.category') : '';

  // Auto-fetch explain when on search or category page
  useEffect(() => {
    if (!selectedLocalizedCatalog) return;
    if (!isSearchPage && !isCategoryPage) return;
    if (isSearchPage && !query) return;

    const key = isSearchPage ? `search:${query}` : `cat:${categoryCode}`;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    setLoading(true);
    setError('');
    fetchExplain(
      selectedLocalizedCatalog.code,
      isSearchPage ? { query } : { categoryId: categoryCode },
      5,
    )
      .then(setResults)
      .catch(e => setError(e.message || t('explain.explainFailed')))
      .finally(() => setLoading(false));
  }, [isSearchPage, isCategoryPage, query, categoryCode, selectedLocalizedCatalog, t]);

  // Don't show if not on search or category page
  if (!isSearchPage && !isCategoryPage) return null;
  if (isSearchPage && !query) return null;

  if (!open) {
    return (
      <button className="explain-toggle" onClick={() => setOpen(true)}>
        {t('explain.toggle')} {results.length > 0 && <span className="explain-badge">{results.length}</span>}
      </button>
    );
  }

  return (
    <div className="explain-panel">
      <div className="explain-header">
        <h3>{t('explain.headerPrefix')} {contextLabel}</h3>
        <button className="explain-close" onClick={() => setOpen(false)}>✕</button>
      </div>

      {loading && <div className="explain-loading">{t('explain.analyzing')}</div>}
      {error && <div className="explain-error">⚠ {error}</div>}

      {results.length > 0 && (
        <div className="explain-results">
          {results.map((product, idx) => (
            <div key={product.id} className="explain-product">
              <div className="explain-product-header">
                <span className="explain-rank">#{idx + 1}</span>
                <div className="explain-product-info">
                  <strong>{product.name}</strong>
                  <span className="explain-sku">{product.sku}</span>
                </div>
                <div className="explain-score">{product.score.toFixed(2)}</div>
              </div>

              {/* Boosts */}
              {product.boosts && product.boosts.weight > 1 && (
                <div className="explain-section boost">
                  <span className="explain-section-label">{t('explain.boostPrefix')}{product.boosts.weight}</span>
                  <span className="explain-section-detail">
                    {t('explain.modePrefix')} {product.boosts.boost_mode}
                    {product.boosts.details?.[0]?.details?.[0]?.description && (
                      <> — {product.boosts.details[0].details[0].description}</>
                    )}
                  </span>
                </div>
              )}

              {/* Top matches */}
              {product.matches && product.matches.length > 0 && (
                <div className="explain-matches">
                  <span className="explain-section-label">{t('explain.fieldMatches')}</span>
                  {product.matches
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5)
                    .map((m, i) => (
                      <div key={i} className="explain-match">
                        <span className="explain-match-field">{m.field.replace(/^\[/, '')}</span>
                        <span className="explain-match-analyzer">{m.analyzer}</span>
                        <span className="explain-match-score">{m.score.toFixed(1)}</span>
                        <div className="explain-match-bar">
                          <div
                            className="explain-match-bar-fill"
                            style={{ width: `${Math.min((m.score / (product.matches[0]?.score || 1)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Legends (show once for first product) */}
              {idx === 0 && product.legends && Object.keys(product.legends).length > 0 && (
                <div className="explain-legends">
                  <span className="explain-section-label">{t('explain.legend')}</span>
                  {Object.entries(product.legends).slice(0, 4).map(([key, val]) => (
                    <div key={key} className="explain-legend-item">
                      <code>{val.field}</code> — {val.legend}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
