import Link from './LocaleLink'
import { useTranslation } from 'react-i18next'
import { useCatalog } from '../contexts/CatalogContext'
import { defaultListingPath } from '../sdk/categoryTree'

// Shown by the cart and by the checkout when there is nothing to buy
// (specs/bugfix-checkout-empty-cart.md).
export default function CartEmptyState() {
  const { t } = useTranslation('cart')
  const { categories } = useCatalog()
  return (
    <div className="cart-page">
      <div className="page-title">
        <h1>{t('empty.title')}</h1>
      </div>
      <div className="empty-state">
        <h3>{t('empty.heading')}</h3>
        <p>{t('empty.body')}</p>
        {/* The catalog's root category, like the header's Products tab - not an empty search. */}
        <Link
          href={defaultListingPath(categories)}
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          {t('empty.browse')}
        </Link>
      </div>
    </div>
  )
}
