import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useCatalog } from '../contexts/CatalogContext';
import { useTracking } from '../hooks/useTracking';

const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirmation'];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { currencySymbol } = useCatalog();
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
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && <div className="checkout-step-divider" />}
            <div className={`checkout-step ${i < step ? 'completed' : ''} ${i === step ? 'active' : ''}`}>
              {i < step ? '✓' : i + 1}. {s}
            </div>
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Shipping Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input className="facet-search" placeholder="First Name" style={{ padding: '0.75rem' }} />
            <input className="facet-search" placeholder="Last Name" style={{ padding: '0.75rem' }} />
            <input className="facet-search" placeholder="Email" style={{ gridColumn: '1/-1', padding: '0.75rem' }} />
            <input className="facet-search" placeholder="Address" style={{ gridColumn: '1/-1', padding: '0.75rem' }} />
            <input className="facet-search" placeholder="City" style={{ padding: '0.75rem' }} />
            <input className="facet-search" placeholder="ZIP Code" style={{ padding: '0.75rem' }} />
          </div>
          <button className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem' }} onClick={() => setStep(2)}>
            Continue to Payment →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Payment</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input className="facet-search" placeholder="Card Number" style={{ padding: '0.75rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="facet-search" placeholder="MM/YY" style={{ padding: '0.75rem' }} />
              <input className="facet-search" placeholder="CVC" style={{ padding: '0.75rem' }} />
            </div>
          </div>
          <div className="cart-summary" style={{ marginTop: '1.5rem' }}>
            <div className="cart-summary-row total">
              <span>Total to Pay</span>
              <span>{currencySymbol}{total.toFixed(2)}</span>
            </div>
          </div>
          <button className="btn btn-coral btn-lg" style={{ width: '100%', marginTop: '1rem' }} onClick={handlePlaceOrder}>
            Place Order — {currencySymbol}{total.toFixed(2)}
          </button>
        </div>
      )}

      {step === 3 && (
        <div style={{ textAlign: 'center', background: 'white', borderRadius: 'var(--radius-md)', padding: '3rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
          <h2>Order Confirmed!</h2>
          <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem' }}>
            Thank you for your order. A tracking event has been sent to Gally.
          </p>
        </div>
      )}
    </div>
  );
}
