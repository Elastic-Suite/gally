import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEventLog } from '../contexts/EventLogContext'
import Icon, { type IconName } from './Icon'

export default function TrackingInsights() {
  const { t } = useTranslation('demo')
  const [open, setOpen] = useState(false)
  const { entries } = useEventLog()

  // Group entries into insight categories
  const searches = entries.filter((e) => e.type === 'SEARCH')
  const displays = entries.filter((e) => e.type === 'DISPLAY')
  const categoryViews = entries.filter((e) => e.type === 'VIEW:category')
  const productViews = entries.filter((e) => e.type === 'VIEW:product')
  const addToCarts = entries.filter((e) => e.type === 'ADD_TO_CART')
  const orders = entries.filter((e) => e.type === 'ORDER')

  const totalEvents = entries.length

  if (!open) {
    return (
      <button
        className="tracking-insights-toggle"
        onClick={() => setOpen(true)}
      >
        <Icon name="stats-chart" />
        {t('insights.toggle')}{' '}
        {totalEvents > 0 && (
          <span className="insights-badge">{totalEvents}</span>
        )}
      </button>
    )
  }

  return (
    <div className="tracking-insights-panel">
      <div className="insights-header">
        <h3>
          <Icon name="stats-chart" />
          {t('insights.heading')}
        </h3>
        <button className="insights-close" onClick={() => setOpen(false)}>
          <span className="visually-hidden">{t('common:actions.close')}</span>
          <Icon name="close" standalone />
        </button>
      </div>

      <div className="insights-summary">
        <span>{t('insights.summary', { count: totalEvents })}</span>
      </div>

      {totalEvents === 0 ? (
        <div className="insights-empty">{t('insights.empty')}</div>
      ) : (
        <div className="insights-sections">
          {searches.length > 0 && (
            <InsightSection
              icon="search"
              color="#3f51b5"
              title={t('insights.sections.search.title', {
                count: searches.length,
              })}
              consequence={t('insights.sections.search.consequence')}
              details={searches.slice(0, 3).map((e) => e.detail)}
            />
          )}

          {categoryViews.length > 0 && (
            <InsightSection
              icon="folder-open"
              color="#7c4dff"
              title={t('insights.sections.category.title', {
                count: categoryViews.length,
              })}
              consequence={t('insights.sections.category.consequence')}
              details={categoryViews.slice(0, 3).map((e) => e.detail)}
            />
          )}

          {displays.length > 0 && (
            <InsightSection
              icon="list"
              color="#3949ab"
              title={t('insights.sections.display.title', {
                count: displays.length,
              })}
              consequence={t('insights.sections.display.consequence')}
              details={displays.slice(0, 3).map((e) => e.detail)}
            />
          )}

          {productViews.length > 0 && (
            <InsightSection
              icon="eye"
              color="#7c4dff"
              title={t('insights.sections.product.title', {
                count: productViews.length,
              })}
              consequence={t('insights.sections.product.consequence')}
              details={productViews.slice(0, 3).map((e) => e.detail)}
            />
          )}

          {addToCarts.length > 0 && (
            <InsightSection
              icon="cart"
              color="#ff6b6b"
              title={t('insights.sections.cart.title', {
                count: addToCarts.length,
              })}
              consequence={t('insights.sections.cart.consequence')}
              details={addToCarts.slice(0, 3).map((e) => e.detail)}
            />
          )}

          {orders.length > 0 && (
            <InsightSection
              icon="checkmark"
              color="#4caf50"
              title={t('insights.sections.order.title', {
                count: orders.length,
              })}
              consequence={t('insights.sections.order.consequence')}
              details={orders.slice(0, 3).map((e) => e.detail)}
            />
          )}
        </div>
      )}
    </div>
  )
}

function InsightSection({
  icon,
  color,
  title,
  consequence,
  details,
}: {
  icon: IconName
  color: string
  title: string
  consequence: string
  details: string[]
}) {
  return (
    <div className="insight-section">
      <div className="insight-section-header">
        <span className="insight-dot" style={{ background: color }} />
        <span className="insight-icon">
          <Icon name={icon} standalone />
        </span>
        <strong>{title}</strong>
      </div>
      <div className="insight-consequence">{consequence}</div>
      {details.length > 0 && (
        <div className="insight-details">
          {details.map((d, i) => (
            <div key={i} className="insight-detail">
              {d}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
