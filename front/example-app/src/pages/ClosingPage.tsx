import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ClosingPage() {
  const { t } = useTranslation('demo');
  const [revealStage, setRevealStage] = useState(0); // 0=delay, 1=cost, 2=pricing

  return (
    <div className="closing-page">
      <div className="page-title">
        <h1>{t('closing.title')}</h1>
      </div>

      {/* Stats band */}
      <div className="closing-stats">
        <div className="closing-stat">
          <span className="closing-stat-value coral">−40%</span>
          <span className="closing-stat-label">{t('closing.stats.noResults')}</span>
        </div>
        <div className="closing-stat">
          <span className="closing-stat-value">+30%</span>
          <span className="closing-stat-label">{t('closing.stats.conversion')}</span>
        </div>
        <div className="closing-stat">
          <span className="closing-stat-value">+15%</span>
          <span className="closing-stat-label">{t('closing.stats.aov')}</span>
        </div>
      </div>

      {/* Tracking Journey Timeline */}
      <div className="closing-card" style={{ marginBottom: '2rem' }}>
        <h3>{t('closing.timeline.heading')}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1.5rem' }}>
          {t('closing.timeline.intro')}
        </p>
        <div className="tracking-timeline">
          <div className="timeline-item">
            <div className="timeline-dot search" />
            <div className="timeline-content">
              <div className="timeline-event">
                <span className="timeline-badge">SEARCH</span>
                {t('closing.timeline.search.eventPrefix')} <strong>"tank dress"</strong>
              </div>
              <div className="timeline-consequence">
                {t('closing.timeline.search.consequence')}
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot display" />
            <div className="timeline-content">
              <div className="timeline-event">
                <span className="timeline-badge">DISPLAY</span>
                {t('closing.timeline.display.event', { count: 12 })}
              </div>
              <div className="timeline-consequence">
                {t('closing.timeline.display.consequence')}
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot view" />
            <div className="timeline-content">
              <div className="timeline-event">
                <span className="timeline-badge">VIEW:category</span>
                {t('closing.timeline.viewCategory.event')}
              </div>
              <div className="timeline-consequence">
                {t('closing.timeline.viewCategory.consequence')}
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot view" />
            <div className="timeline-content">
              <div className="timeline-event">
                <span className="timeline-badge">VIEW:product</span>
                {t('closing.timeline.viewProduct.event')}
              </div>
              <div className="timeline-consequence">
                {t('closing.timeline.viewProduct.consequence')}
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot cart" />
            <div className="timeline-content">
              <div className="timeline-event">
                <span className="timeline-badge">ADD_TO_CART</span>
                {t('closing.timeline.addToCart.event')}
              </div>
              <div className="timeline-consequence">
                {t('closing.timeline.addToCart.consequence')}
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot order" />
            <div className="timeline-content">
              <div className="timeline-event">
                <span className="timeline-badge">ORDER</span>
                {t('closing.timeline.order.event')}
              </div>
              <div className="timeline-consequence">
                {t('closing.timeline.order.consequence')}
              </div>
            </div>
          </div>
        </div>

        <div className="timeline-summary">
          <div className="timeline-summary-item">
            <strong>{t('closing.timeline.summary.eventTypes')}</strong> {t('closing.timeline.summary.eventTypesSuffix')}
          </div>
          <div className="timeline-summary-item">
            <strong>{t('closing.timeline.summary.popularityScore')}</strong> {t('closing.timeline.summary.popularityScoreSuffix')}
          </div>
          <div className="timeline-summary-item">
            <strong>{t('closing.timeline.summary.recommendations')}</strong> {t('closing.timeline.summary.recommendationsSuffix')}
          </div>
          <div className="timeline-summary-item">
            <strong>{t('closing.timeline.summary.relevance')}</strong> {t('closing.timeline.summary.relevanceSuffix')}
          </div>
        </div>
      </div>

      {/* Sequenced reveal */}
      <div className="closing-cards">
        {/* Stage 0: Delay — always visible */}
        <div className="closing-card">
          <h3>{t('closing.delay.heading')}</h3>
          <div className="closing-compare">
            <div className="closing-compare-col market">
              <div className="closing-compare-label">{t('closing.market')}</div>
              <div className="closing-compare-value">{t('closing.delay.marketValue')}</div>
            </div>
            <div className="closing-compare-vs">vs</div>
            <div className="closing-compare-col gally">
              <div className="closing-compare-label">Gally</div>
              <div className="closing-compare-value">{t('closing.delay.gallyValue')}</div>
            </div>
          </div>
          {revealStage === 0 && (
            <button className="btn btn-primary closing-reveal-btn" onClick={() => setRevealStage(1)}>
              {t('closing.delay.ctaBudget')}
            </button>
          )}
        </div>

        {/* Stage 1: Cost */}
        {revealStage >= 1 && (
          <div className="closing-card reveal-in">
            <h3>{t('closing.cost.heading')}</h3>
            <div className="closing-compare">
              <div className="closing-compare-col market">
                <div className="closing-compare-label">{t('closing.market')}</div>
                <div className="closing-compare-value">{t('closing.cost.marketValue')}</div>
              </div>
              <div className="closing-compare-vs">vs</div>
              <div className="closing-compare-col gally">
                <div className="closing-compare-label">Gally</div>
                <div className="closing-compare-value">{t('closing.cost.gallyValue')}</div>
                <div className="closing-compare-note">{t('closing.cost.gallyNote')}</div>
              </div>
            </div>
            {revealStage === 1 && (
              <button className="btn btn-primary closing-reveal-btn" onClick={() => setRevealStage(2)}>
                {t('closing.cost.ctaPricing')}
              </button>
            )}
          </div>
        )}

        {/* Stage 2: Pricing */}
        {revealStage >= 2 && (
          <div className="closing-card reveal-in">
            <h3>{t('closing.pricing.heading')}</h3>
            <div className="pricing-cards">
              <div className="pricing-card featured">
                <div className="pricing-badge">{t('closing.pricing.popular')}</div>
                <h4>{t('closing.pricing.business')}</h4>
                <div className="pricing-price">{t('closing.pricing.businessPrice')}<span>{t('closing.pricing.perMonth')}</span></div>
                <ul className="pricing-features">
                  {(t('closing.pricing.businessFeatures', { returnObjects: true }) as string[]).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button className="btn btn-coral" style={{ width: '100%' }}>
                  {t('closing.pricing.talkToSales')}
                </button>
              </div>
              <div className="pricing-card">
                <h4>{t('closing.pricing.enterprise')}</h4>
                <div className="pricing-price">{t('closing.pricing.enterprisePrice')}</div>
                <ul className="pricing-features">
                  {(t('closing.pricing.enterpriseFeatures', { returnObjects: true }) as string[]).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button className="btn btn-outline" style={{ width: '100%' }}>
                  {t('closing.pricing.talkToSales')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <p className="closing-disclaimer">
        {t('closing.disclaimer')}
      </p>
    </div>
  );
}
