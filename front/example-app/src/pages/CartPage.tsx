import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useCatalog } from '../contexts/CatalogContext';
import { useSearch } from '../hooks/useSearch';
import ProductSlider from '../components/ProductSlider';

const FREE_SHIPPING_THRESHOLD = 180;

// Accessory bundle items (simulated)
const BUNDLE_ITEMS = [
  { sku: 'acc-clutch', name: 'Pochette assortie', price: 29.90 },
  { sku: 'acc-belt', name: 'Ceinture tissu', price: 19.90 },
  { sku: 'acc-scarf', name: 'Foulard léger', price: 24.90 },
];
const BUNDLE_DISCOUNT = 0.20;
const BUNDLE_TOTAL = BUNDLE_ITEMS.reduce((s, i) => s + i.price, 0);
const BUNDLE_PRICE = +(BUNDLE_TOTAL * (1 - BUNDLE_DISCOUNT)).toFixed(2);

// FBT items (simulated)
const FBT_ITEMS = [
  { sku: 'fbt-sandals', name: 'Sandales tressées', price: 49.90 },
  { sku: 'fbt-hat', name: 'Chapeau de paille', price: 34.90 },
  { sku: 'fbt-earrings', name: 'Boucles d\'oreilles dorées', price: 22.90 },
];

export default function CartPage() {
  const { items, removeFromCart, updateQty, total, itemCount, addToCart } = useCart();
  const { currencySymbol } = useCatalog();
  const navigate = useNavigate();
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
        name: item.name,
        price: +(item.price * (1 - BUNDLE_DISCOUNT)).toFixed(2),
      });
    });
  };

  const handleToggleFbt = (sku: string) => {
    setFbtChecked(prev => ({ ...prev, [sku]: !prev[sku] }));
  };

  const handleAddFbt = () => {
    FBT_ITEMS.filter(f => fbtChecked[f.sku]).forEach(item => {
      addToCart({ sku: item.sku, name: item.name, price: item.price });
    });
    setFbtChecked({});
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="page-title"><h1>Votre Panier</h1></div>
        <div className="empty-state">
          <h3>Votre panier est vide</h3>
          <p>Commencez vos achats pour ajouter des produits.</p>
          <Link to="/search?q=" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Parcourir les produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-title"><h1>Votre Panier ({itemCount} articles)</h1></div>

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
            {currencySymbol}{(item.price * item.qty).toFixed(2)}
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
          <h3>🎁 Pack accessoires −{BUNDLE_DISCOUNT * 100}%</h3>
          <span className="cart-bundle-badge">Économisez {currencySymbol}{(BUNDLE_TOTAL - BUNDLE_PRICE).toFixed(2)}</span>
        </div>
        <div className="cart-bundle-items">
          {BUNDLE_ITEMS.map(item => (
            <div key={item.sku} className="cart-bundle-item">
              <span>{item.name}</span>
              <span className="cart-bundle-item-price">
                <s>{currencySymbol}{item.price.toFixed(2)}</s>
                {' '}
                {currencySymbol}{(item.price * (1 - BUNDLE_DISCOUNT)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="cart-bundle-footer">
          <span className="cart-bundle-total">
            Total pack : <strong>{currencySymbol}{BUNDLE_PRICE}</strong>
            {' '}
            <s className="cart-bundle-was">{currencySymbol}{BUNDLE_TOTAL.toFixed(2)}</s>
          </span>
          <button className="btn btn-coral btn-sm" onClick={handleAddBundle}>
            Ajouter le pack
          </button>
        </div>
      </div>

      {/* Cart Summary with Free Shipping Bar */}
      <div className="cart-summary">
        {/* Free shipping bar */}
        <div className="shipping-bar">
          {freeShipping ? (
            <div className="shipping-bar-unlocked">
              ✓ Livraison offerte !
            </div>
          ) : (
            <>
              <div className="shipping-bar-label">
                Plus que <strong>{currencySymbol}{shippingRemaining.toFixed(2)}</strong> pour la livraison offerte
              </div>
              <div className="shipping-bar-track">
                <div className="shipping-bar-fill" style={{ width: `${shippingProgress}%` }} />
              </div>
            </>
          )}
        </div>

        <div className="cart-summary-row">
          <span>Sous-total</span>
          <span>{currencySymbol}{total.toFixed(2)}</span>
        </div>
        {fbtTotal > 0 && (
          <div className="cart-summary-row">
            <span>Fréquemment achetés ensemble</span>
            <span>+{currencySymbol}{fbtTotal.toFixed(2)}</span>
          </div>
        )}
        <div className="cart-summary-row">
          <span>Livraison</span>
          <span className={freeShipping ? 'free-shipping-text' : ''}>{freeShipping ? 'Offerte' : '4,90 €'}</span>
        </div>
        <div className={`cart-summary-row total ${totalAnimating ? 'total-animate' : ''}`}>
          <span>Total</span>
          <span>{currencySymbol}{(grandTotal + (freeShipping ? 0 : 4.90)).toFixed(2)}</span>
        </div>
        <button
          className="btn btn-coral btn-lg"
          style={{ width: '100%', marginTop: '1rem' }}
          onClick={() => navigate('/checkout')}
        >
          Passer la commande
        </button>
      </div>

      {/* Frequently Bought Together */}
      <div className="fbt-section">
        <h3>Fréquemment achetés ensemble</h3>
        <div className="fbt-items">
          {FBT_ITEMS.map(item => (
            <label key={item.sku} className="fbt-item">
              <input
                type="checkbox"
                checked={!!fbtChecked[item.sku]}
                onChange={() => handleToggleFbt(item.sku)}
              />
              <div className="fbt-item-info">
                <span className="fbt-item-name">{item.name}</span>
                <span className="fbt-item-price">{currencySymbol}{item.price.toFixed(2)}</span>
              </div>
            </label>
          ))}
        </div>
        {fbtTotal > 0 && (
          <div className="fbt-footer">
            <span>Total sélectionné : <strong>{currencySymbol}{fbtTotal.toFixed(2)}</strong></span>
            <button className="btn btn-primary btn-sm" onClick={handleAddFbt}>
              Ajouter au panier
            </button>
          </div>
        )}
      </div>

      {/* Cart Recommendations */}
      <section className="recommendations">
        <ProductSlider title="Complétez votre look" products={recommendations.slice(0, 4)} />
      </section>
    </div>
  );
}
