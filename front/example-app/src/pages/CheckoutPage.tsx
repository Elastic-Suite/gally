import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useCatalog } from '../contexts/CatalogContext';
import { useTracking } from '../hooks/useTracking';

const STEP_KEYS = ['cart', 'shipping', 'payment', 'confirmation'];

export default function CheckoutPage() {
  const { t } = useTranslation('cart');
  const { items, total, clearCart } = useCart();
  const { formatPrice } = useCatalog();
  const { trackOrder } = useTracking();
  const [step, setStep] = useState(1); // 0=cart (already done), 1=shipping, 2=payment, 3=confirmation

  const handlePlaceOrder = () => {
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    trackOrder(
      orderId,
      total,
      items.map(i => ({ sku: i.sku, childSku: i.childSku, price: i.price, qty: i.qty }))
    );
    setStep(3);
    clearCart();
  };

  return (
    <div className="cart-page">
      {/* Checkout Tunnel Steps */}
      <div className="checkout-steps">
        {STEP_KEYS.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <div className="checkout-step-divider" />}
            <div className={`checkout-step ${i < step ? 'completed' : ''} ${i === step ? 'active' : ''}`}>
              {i < step ? '✓' : i + 1}. {t(`checkout.steps.${s}`)}
            </div>
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{t('checkout.shippingInfo')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input className="facet-search" placeholder={t('checkout.placeholders.firstName')} style={{ padding: '0.75rem' }} />
            <input className="facet-search" placeholder={t('checkout.placeholders.lastName')} style={{ padding: '0.75rem' }} />
            <input className="facet-search" placeholder={t('checkout.placeholders.email')} style={{ gridColumn: '1/-1', padding: '0.75rem' }} />
            <input className="facet-search" placeholder={t('checkout.placeholders.address')} style={{ gridColumn: '1/-1', padding: '0.75rem' }} />
            <input className="facet-search" placeholder={t('checkout.placeholders.city')} style={{ padding: '0.75rem' }} />
            <input className="facet-search" placeholder={t('checkout.placeholders.zip')} style={{ padding: '0.75rem' }} />
          </div>
          <button className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem' }} onClick={() => setStep(2)}>
            {t('checkout.continueToPayment')}
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{t('checkout.payment')}</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input className="facet-search" placeholder={t('checkout.placeholders.cardNumber')} style={{ padding: '0.75rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="facet-search" placeholder={t('checkout.placeholders.expiry')} style={{ padding: '0.75rem' }} />
              <input className="facet-search" placeholder={t('checkout.placeholders.cvc')} style={{ padding: '0.75rem' }} />
            </div>
          </div>
          <div className="cart-summary" style={{ marginTop: '1.5rem' }}>
            <div className="cart-summary-row total">
              <span>{t('checkout.totalToPay')}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <button className="btn btn-coral btn-lg" style={{ width: '100%', marginTop: '1rem' }} onClick={handlePlaceOrder}>
            {t('checkout.placeOrder', { amount: formatPrice(total) })}
          </button>
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign: 'center', background: 'white', borderRadius: 'var(--radius-md)', padding: '3rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
          <h2>{t('checkout.orderConfirmed')}</h2>
          <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>
            {t('checkout.orderConfirmedBody')}
          </p>
        </div>
      )}
    </div>
  );
}
