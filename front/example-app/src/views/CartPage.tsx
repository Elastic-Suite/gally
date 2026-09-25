'use client';

import { useState, useEffect, useRef } from 'react';
import Link from '../components/LocaleLink';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useCatalog } from '../contexts/CatalogContext';
import { useLocaleHref } from '../contexts/LocaleContext';
import { useRecommendations } from '../hooks/useRecommendations';
import { defaultListingPath } from '../sdk/categoryTree';
import ProductSlider from '../components/ProductSlider';
import ProductImage from '../components/ProductImage';

const FREE_SHIPPING_THRESHOLD = 180;

export default function CartPage() {
  const { t } = useTranslation('cart');
  const { items, removeFromCart, updateQty, total, itemCount, ready } = useCart();
  const { formatPrice, categories } = useCatalog();
  const router = useRouter();
  const localeHref = useLocaleHref();
  // Cross-sell rules seeded with every product in the cart. Cart lines carry the parent SKU in
  // `sku` (the variant is `childSku`), which is what the rules are written on.
  const { products: recommendations } = useRecommendations(['cross-sell'], items.map(i => i.sku), 8);
  const [totalAnimating, setTotalAnimating] = useState(false);
  const prevTotalRef = useRef(total);

  // Animate total on change
  useEffect(() => {
    if (prevTotalRef.current !== total && total > 0) {
      setTotalAnimating(true);
      const timer = setTimeout(() => setTotalAnimating(false), 400);
      prevTotalRef.current = total;
      return () => clearTimeout(timer);
    }
    prevTotalRef.current = total;
  }, [total]);

  const shippingProgress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const freeShipping = total >= FREE_SHIPPING_THRESHOLD;
  const shippingRemaining = Math.max(FREE_SHIPPING_THRESHOLD - total, 0);

  // Until the saved cart is read, "your cart is empty" would flash on every reload.
  if (!ready) {
    return <div className="cart-page" />;
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="page-title"><h1>{t('empty.title')}</h1></div>
        <div className="empty-state">
          <h3>{t('empty.heading')}</h3>
          <p>{t('empty.body')}</p>
          {/* The catalog's root category, like the header's Products tab - not an empty search. */}
          <Link href={defaultListingPath(categories)} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            {t('empty.browse')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-title"><h1>{t('title', { count: itemCount })}</h1></div>

      {/* Cart Items */}
      {items.map(item => (
        <div key={`${item.sku}-${item.variant}`} className="cart-item">
          <div className="cart-item-image">
            <ProductImage src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="cart-item-info">
            <h4>{item.name}</h4>
            {item.variant && <div className="variant">{item.variant}</div>}
          </div>
          <div className="cart-item-qty">
            <button onClick={() => updateQty(item.sku, item.qty - 1, item.variant)}>−</button>
            <span>{item.qty}</span>
            <button onClick={() => updateQty(item.sku, item.qty + 1, item.variant)}>+</button>
          </div>
          <div className="cart-item-price">
            {formatPrice(item.price * item.qty)}
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => removeFromCart(item.sku, item.variant)}
            style={{ color: 'var(--coral-500)' }}
          >
            ✕
          </button>
        </div>
      ))}

      {/* Cart Summary with Free Shipping Bar */}
      <div className="cart-summary">
        {/* Free shipping bar */}
        <div className="shipping-bar">
          {freeShipping ? (
            <div className="shipping-bar-unlocked">
              {t('shipping.unlocked')}
            </div>
          ) : (
            <>
              <div className="shipping-bar-label">
                {t('shipping.remainingPrefix')} <strong>{formatPrice(shippingRemaining)}</strong> {t('shipping.remainingSuffix')}
              </div>
              <div className="shipping-bar-track">
                <div className="shipping-bar-fill" style={{ width: `${shippingProgress}%` }} />
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
          <span className={freeShipping ? 'free-shipping-text' : ''}>{freeShipping ? t('shipping.free') : formatPrice(4.90)}</span>
        </div>
        <div className={`cart-summary-row total ${totalAnimating ? 'total-animate' : ''}`}>
          <span>{t('summary.total')}</span>
          <span>{formatPrice(total + (freeShipping ? 0 : 4.90))}</span>
        </div>
        <button
          className="btn btn-coral btn-lg"
          style={{ width: '100%', marginTop: '1rem' }}
          onClick={() => router.push(localeHref('/checkout'))}
        >
          {t('summary.checkout')}
        </button>
      </div>

      {/* Cart Recommendations */}
      {recommendations.length > 0 && (
        <section className="recommendations">
          <ProductSlider title={t('recommendations')} products={recommendations} />
        </section>
      )}
    </div>
  );
}
