'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts/CartContext'
import { useCatalog } from '../contexts/CatalogContext'
import { useLocaleHref } from '../contexts/LocaleContext'
import { useRecommendations } from '../hooks/useRecommendations'
import { cartShipping } from '../contexts/shipping'
import CartEmptyState from '../components/CartEmptyState'
import ProductSlider from '../components/ProductSlider'
import ProductImage from '../components/ProductImage'
import Icon from '../components/Icon'

export default function CartPage() {
  const { t } = useTranslation('cart')
  const { items, removeFromCart, updateQty, total, itemCount, ready } =
    useCart()
  const { formatPrice } = useCatalog()
  const router = useRouter()
  const localeHref = useLocaleHref()
  // Cross-sell rules seeded with every product in the cart. Cart lines carry the parent SKU in
  // `sku` (the variant is `childSku`), which is what the rules are written on.
  const { products: recommendations } = useRecommendations(
    ['cross-sell'],
    items.map((i) => i.sku),
    8
  )
  const [totalAnimating, setTotalAnimating] = useState(false)
  const prevTotalRef = useRef(total)

  // Animate total on change
  useEffect(() => {
    if (prevTotalRef.current !== total && total > 0) {
      setTotalAnimating(true)
      const timer = setTimeout(() => setTotalAnimating(false), 400)
      prevTotalRef.current = total
      return () => clearTimeout(timer)
    }
    prevTotalRef.current = total
  }, [total])

  const shipping = cartShipping(total)
  const freeShipping = shipping.free

  // Until the saved cart is read, "your cart is empty" would flash on every reload.
  if (!ready) {
    return <div className="cart-page" />
  }

  if (items.length === 0) {
    return <CartEmptyState />
  }

  return (
    <div className="cart-page">
      <div className="page-title">
        <h1>{t('title', { count: itemCount })}</h1>
      </div>

      {/* Lines on the left, totals on the right (specs/feature-cart-summary-side-column.md) */}
      <div className="cart-layout">
        <div className="cart-lines">
          {items.map((item) => (
            <div key={`${item.sku}-${item.variant}`} className="cart-item">
              <div className="cart-item-image">
                <ProductImage
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                {item.variant && <div className="variant">{item.variant}</div>}
              </div>
              <div className="cart-item-qty">
                <button
                  onClick={() =>
                    updateQty(item.sku, item.qty - 1, item.variant)
                  }
                >
                  <span className="visually-hidden">
                    {t('common:actions.decrease')}
                  </span>
                  <Icon name="remove" standalone />
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() =>
                    updateQty(item.sku, item.qty + 1, item.variant)
                  }
                >
                  <span className="visually-hidden">
                    {t('common:actions.increase')}
                  </span>
                  <Icon name="add" standalone />
                </button>
              </div>
              <div className="cart-item-price">
                {formatPrice(item.price * item.qty)}
              </div>
              <button
                className="btn btn-outline btn-sm cart-item-remove"
                onClick={() => removeFromCart(item.sku, item.variant)}
              >
                <span className="visually-hidden">
                  {t('common:actions.remove')}
                </span>
                <Icon name="close" standalone />
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary with Free Shipping Bar */}
        <div className="cart-summary">
          {/* Free shipping bar */}
          <div className="shipping-bar">
            {freeShipping ? (
              <div className="shipping-bar-unlocked">
                <Icon name="checkmark" />
                {t('shipping.unlocked')}
              </div>
            ) : (
              <>
                <div className="shipping-bar-label">
                  {t('shipping.remainingPrefix')}{' '}
                  <strong>{formatPrice(shipping.remaining)}</strong>{' '}
                  {t('shipping.remainingSuffix')}
                </div>
                <div className="shipping-bar-track">
                  <div
                    className="shipping-bar-fill"
                    style={{ width: `${shipping.progress}%` }}
                  />
                </div>
              </>
            )}
          </div>

          <div className="cart-summary-row">
            <span>{t('summary.subtotal')}</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="cart-summary-row">
            <span>{t('summary.shipping')}</span>
            <span className={freeShipping ? 'free-shipping-text' : ''}>
              {freeShipping ? t('shipping.free') : formatPrice(shipping.fee)}
            </span>
          </div>
          <div
            className={`cart-summary-row total ${
              totalAnimating ? 'total-animate' : ''
            }`}
          >
            <span>{t('summary.total')}</span>
            <span>{formatPrice(shipping.total)}</span>
          </div>
          <button
            className="btn btn-coral btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={() => router.push(localeHref('/checkout'))}
          >
            {t('summary.checkout')}
          </button>
        </div>
      </div>

      {/* Cart Recommendations */}
      {recommendations.length > 0 && (
        <section className="recommendations">
          <ProductSlider
            title={t('recommendations')}
            products={recommendations}
          />
        </section>
      )}
    </div>
  )
}
