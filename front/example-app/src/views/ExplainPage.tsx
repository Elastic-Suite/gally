'use client'

import { useState, useEffect } from 'react'
import { useCatalog } from '../contexts/CatalogContext'
import { useTranslation } from 'react-i18next'
import { getBaseUri } from '../sdk'
import { EXPLAIN_ENABLED, getExplainToken } from '../sdk/explain'
import Icon from '../components/Icon'

interface ExplainMatch {
  field: string
  originalField: string
  analyzer: string
  weight: number
  score: number
}

// One node of the engine's score explanation tree.
interface ExplainDetail {
  value: number
  description: string
  details: ExplainDetail[]
}

interface ExplainBoost {
  boost_mode: string
  weight: number
  total: number
  details: ExplainDetail[]
}

interface ExplainProduct {
  id: string
  sku: string
  name: string
  score: number
  boosts: ExplainBoost | null
  matches: ExplainMatch[]
  legends: Record<string, { field: string; legend: string }>
}

async function fetchExplain(
  localizedCatalog: string,
  query: string,
  pageSize = 6
): Promise<ExplainProduct[]> {
  const token = await getExplainToken()
  const gql = `{
    explain(
      localizedCatalog: "${localizedCatalog}",
      requestType: product_search,
      search: "${query.replace(/"/g, '\\"')}",
      pageSize: ${pageSize}
    ) {
      collection { id sku name score boosts matches legends }
    }
  }`
  const res = await fetch(`${getBaseUri()}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: gql }),
  })
  const data = await res.json()
  return data?.data?.explain?.collection || []
}

export default function ExplainPage() {
  const [query, setQuery] = useState('tank dress')
  const [results, setResults] = useState<ExplainProduct[]>([])
  const [loading, setLoading] = useState(false)
  const { selectedLocalizedCatalog } = useCatalog()
  const { t } = useTranslation('demo')

  useEffect(() => {
    if (!EXPLAIN_ENABLED || !selectedLocalizedCatalog || !query.trim()) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag of the debounced fetch this effect starts
    setLoading(true)
    const timeout = setTimeout(() => {
      fetchExplain(selectedLocalizedCatalog.code, query, 6)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false))
    }, 500)
    return () => clearTimeout(timeout)
  }, [query, selectedLocalizedCatalog])

  const maxScore = results.length > 0 ? results[0].score : 1

  return (
    <div className="explain-page">
      <div className="page-title">
        <div className="breadcrumb">Home / Search Intelligence</div>
        <h1>
          <Icon name="bulb" />
          Comment Gally classe vos produits
        </h1>
      </div>

      <p
        style={{
          color: 'var(--gray-600)',
          marginBottom: '1.5rem',
          maxWidth: '700px',
        }}
      >
        Visualisez en temps réel comment Gally calcule le score de pertinence de
        chaque produit. Comprenez l'impact des <strong>boosts</strong>, des{' '}
        <strong>champs texte</strong> et de la <strong>popularité</strong> sur
        le classement.
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
          placeholder="Tapez une requête…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && (
        <div className="loading">
          <div className="loading-spinner" /> Analyse en cours…
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="explain-results-page">
          {/* Legends banner */}
          {results[0]?.legends && (
            <div className="explain-legends-banner">
              <h4>
                <Icon name="book" />
                Comment lire les résultats
              </h4>
              <div className="legends-grid">
                {Object.entries(results[0].legends)
                  .slice(0, 5)
                  .map(([key, val]) => (
                    <div key={key} className="legend-card">
                      <code>{val.field}</code>
                      <span>{val.legend}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Product ranking cards */}
          <div className="explain-ranking">
            {results.map((product, idx) => (
              <div key={product.id} className="explain-rank-card">
                {/* Header */}
                <div className="explain-rank-header">
                  <div className="explain-rank-position">
                    <span className="rank-number">#{idx + 1}</span>
                    <div className="rank-score-bar">
                      <div
                        className="rank-score-fill"
                        style={{
                          width: `${(product.score / maxScore) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="explain-rank-info">
                    <h3>{product.name}</h3>
                    <span className="explain-rank-sku">{product.sku}</span>
                  </div>
                  <div className="explain-rank-score">
                    {product.score.toFixed(1)}
                  </div>
                </div>

                {/* Boost badge */}
                {product.boosts && product.boosts.weight > 1 && (
                  <div className="explain-boost-badge">
                    <span className="boost-icon">
                      <Icon name="rocket" standalone />
                    </span>
                    <span>Boost ×{product.boosts.weight}</span>
                    {product.boosts.details?.[0]?.details?.[0]?.description && (
                      <span className="boost-reason">
                        {product.boosts.details[0].details[0].description}
                      </span>
                    )}
                  </div>
                )}

                {/* Field match breakdown */}
                {product.matches && product.matches.length > 0 && (
                  <div className="explain-field-matches">
                    <div className="field-matches-label">
                      Contribution par champ :
                    </div>
                    <div className="field-matches-grid">
                      {product.matches
                        .sort((a, b) => b.score - a.score)
                        .slice(0, 6)
                        .map((m, i) => {
                          const pct = Math.min(
                            (m.score / product.score) * 100,
                            50
                          )
                          return (
                            <div key={i} className="field-match-row">
                              <span className="field-match-name">
                                {m.field.replace(/^\[/, '').replace(/\]$/, '')}
                              </span>
                              <span className="field-match-type">
                                {m.analyzer}
                              </span>
                              <div className="field-match-bar-container">
                                <div
                                  className="field-match-bar"
                                  style={{ width: `${pct * 2}%` }}
                                />
                              </div>
                              <span className="field-match-value">
                                {m.score.toFixed(1)}
                              </span>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!EXPLAIN_ENABLED && (
        <div className="empty-state">
          <p>{t('explain.disabled')}</p>
        </div>
      )}

      {EXPLAIN_ENABLED && !loading && results.length === 0 && query.trim() && (
        <div className="empty-state">
          <h3>Aucun résultat</h3>
          <p>Essayez une autre requête.</p>
        </div>
      )}
    </div>
  )
}
