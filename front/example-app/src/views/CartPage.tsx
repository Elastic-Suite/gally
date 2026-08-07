'use client';

import { useState, useEffect, useRef } from 'react';
import Link from '../components/LocaleLink';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useCatalog } from '../contexts/CatalogContext';
import { useLocaleHref } from '../contexts/LocaleContext';
import { useSearch } from '../hooks/useSearch';
import ProductSlider from '../components/ProductSlider';

const FREE_SHIPPING_THRESHOLD = 180;

// Accessory bundle items (simulated). nameKey resolves against cart.json's bundle.items.
const BUNDLE_ITEMS = [
  { sku: 'acc-clutch', nameKey: 'bundle.items.clutch', price: 29.90 },
  { sku: 'acc-belt', nameKey: 'bundle.items.belt', price: 19.90 },
  { sku: 'acc-scarf', nameKey: 'bundle.items.scarf', price: 24.90 },
];
const BUNDLE_DISCOUNT = 0.20;
const BUNDLE_TOTAL = BUNDLE_ITEMS.reduce((s, i) => s + i.price, 0);
const BUNDLE_PRICE = +(BUNDLE_TOTAL * (1 - BUNDLE_DISCOUNT)).toFixed(2);

// FBT items (simulated). nameKey resolves against cart.json's fbt.items.
const FBT_ITEMS = [
  { sku: 'fbt-sandals', nameKey: 'fbt.items.sandals', price: 49.90 },
  { sku: 'fbt-hat', nameKey: 'fbt.items.hat', price: 34.90 },
  { sku: 'fbt-earrings', nameKey: 'fbt.items.earrings', price: 22.90 },
];

export default function CartPage() {
  const { t } = useTranslation('cart');
  const { items, removeFromCart, updateQty, total, itemCount, addToCart } = useCart();
  const { formatPrice } = useCatalog();
  const router = useRouter();
  const localeHref = useLocaleHref();
  const { products: recommendations } = useSearch({ pageSize: 4 });
  const [fbtChecked, setFbtChecked] = useState<Record<string, boolean>>({});
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

  const fbtTotal = Object.entries(fbtChecked)
    .filter(([, checked]) => checked)
    .reduce((sum, [sku]) => {
      const item = FBT_ITEMS.find(f => f.sku === sku);
      return sum + (item?.price || 0);
    }, 0);

  const grandTotal = total + fbtTotal;
  const shippingProgress = Math.min((grandTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const freeShipping = grandTotal >= FREE_SHIPPING_THRESHOLD;
  const shippingRemaining = Math.max(FREE_SHIPPING_THRESHOLD - grandTotal, 0);

  const handleAddBundle = () => {
    BUNDLE_ITEMS.forEach((item, i) => {
      addToCart({
        sku: item.sku,
        name: t(item.nameKey),
        price: +(item.price * (1 - BUNDLE_DISCOUNT)).toFixed(2),
      });
    });
  };

  const handleToggleFbt = (sku: string) => {
    setFbtChecked(prev => ({ ...prev, [sku]: !prev[sku] }));
  };

  const handleAddFbt = () => {
    FBT_ITEMS.filter(f => fbtChecked[f.sku]).forEach(item => {
      addToCart({ sku: item.sku, name: t(item.nameKey), price: item.price });
    });
    setFbtChecked({});
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="page-title"><h1>{t('empty.title')}</h1></div>
        <div className="empty-state">
          <h3>{t('empty.heading')}</h3>
          <p>{t('empty.body')}</p>
          <Link href="/search?q=" className="btn btn-primary" style={{ marginTop: '1rem' }}>
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
            {item.image
              ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              : '👗'
            }
          </div>
          <div className="cart-item-info">
            <h4>{item.name}</h4>
            {item.variant && <div className="variant">{item.variant}</div>}
          </div>
          <div className="cart-item-qty">
            <button onClick={() => updateQty(item.sku, item.qty - 1)}>−</button>
            <span>{item.qty}</span>
            <button onClick={() => updateQty(item.sku, item.qty + 1)}>+</button>
          </div>
          <div className="cart-item-price">
            {formatPrice(item.price * item.qty)}
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => removeFromCart(item.sku)}
            style={{ color: 'var(--coral-500)' }}
          >
            ✕
          </button>
        </div>
      ))}

      {/* Accessory Bundle */}
      <div className="cart-bundle">
        <div className="cart-bundle-header">
          <h3>{t('bundle.heading', { discount: BUNDLE_DISCOUNT * 100 })}</h3>
          <span className="cart-bundle-badge">{t('bundle.save')} {formatPrice(BUNDLE_TOTAL - BUNDLE_PRICE)}</span>
        </div>
        <div className="cart-bundle-items">
          {BUNDLE_ITEMS.map(item => (
            <div key={item.sku} className="cart-bundle-item">
              <span>{t(item.nameKey)}</span>
              <span className="cart-bundle-item-price">
                <s>{formatPrice(item.price)}</s>
                {' '}
                {formatPrice(item.price * (1 - BUNDLE_DISCOUNT))}
              </span>
            </div>
          ))}
        </div>
        <div className="cart-bundle-footer">
          <span className="cart-bundle-total">
            {t('bundle.totalLabel')} <strong>{formatPrice(BUNDLE_PRICE)}</strong>
            {' '}
            <s className="cart-bundle-was">{formatPrice(BUNDLE_TOTAL)}</s>
          </span>
          <button className="btn btn-primary btn-sm" onClick={handleAddBundle}>
            {t('bundle.addButton')}
          </button>
        </div>
      </div>

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
        {fbtTotal > 0 && (
          <div className="cart-summary-row">
            <span>{t('summary.frequentlyBoughtTogether')}</span>
            <span>+{formatPrice(fbtTotal)}</span>
          </div>
        )}
        <div className="cart-summary-row">
          <span>{t('summary.shipping')}</span>
          <span className={freeShipping ? 'free-shipping-text' : ''}>{freeShipping ? t('shipping.free') : formatPrice(4.90)}</span>
        </div>
        <div className={`cart-summary-row total ${totalAnimating ? 'total-animate' : ''}`}>
          <span>{t('summary.total')}</span>
          <span>{formatPrice(grandTotal + (freeShipping ? 0 : 4.90))}</span>
        </div>
        <button
          className="btn btn-coral btn-lg"
          style={{ width: '100%', marginTop: '1rem' }}
          onClick={() => router.push(localeHref('/checkout'))}
        >
          {t('summary.checkout')}
        </button>
      </div>

      {/* Frequently Bought Together */}
      <div className="fbt-section">
        <h3>{t('summary.frequentlyBoughtTogether')}</h3>
        <div className="fbt-items">
          {FBT_ITEMS.map(item => (
            <label key={item.sku} className="fbt-item">
              <input
                type="checkbox"
                checked={!!fbtChecked[item.sku]}
                onChange={() => handleToggleFbt(item.sku)}
              />
              <div className="fbt-item-info">
                <span className="fbt-item-name">{t(item.nameKey)}</span>
                <span className="fbt-item-price">{formatPrice(item.price)}</span>
              </div>
            </label>
          ))}
        </div>
        {fbtTotal > 0 && (
          <div className="fbt-footer">
            <span>{t('fbt.selectedTotal')} <strong>{formatPrice(fbtTotal)}</strong></span>
            <button className="btn btn-primary btn-sm" onClick={handleAddFbt}>
              {t('fbt.addToCart')}
            </button>
          </div>
        )}
      </div>

      {/* Cart Recommendations */}
      <section className="recommendations">
        <ProductSlider title={t('recommendations')} products={recommendations.slice(0, 4)} />
      </section>
    </div>
  );
}
