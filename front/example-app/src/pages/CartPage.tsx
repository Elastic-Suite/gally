import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useCatalog } from '../contexts/CatalogContext';
import { useSearch } from '../hooks/useSearch';
import ProductSlider from '../components/ProductSlider';

export default function CartPage() {
  const { items, removeFromCart, updateQty, total, itemCount } = useCart();
  const { currencySymbol } = useCatalog();
  const navigate = useNavigate();
  const { products: recommendations } = useSearch({ pageSize: 4 });

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="page-title"><h1>Your Cart</h1></div>
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Start shopping to add products to your cart.</p>
          <Link to="/search?q=" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-title"><h1>Your Cart ({itemCount} items)</h1></div>

      {items.map(item => (
        <div key={`${item.sku}-${item.variant}`} className="cart-item">
          <div className="cart-item-image">📷</div>
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

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span>{currencySymbol}{total.toFixed(2)}</span>
        </div>
        <div className="cart-summary-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="cart-summary-row total">
          <span>Total</span>
          <span>{currencySymbol}{total.toFixed(2)}</span>
        </div>
        <button
          className="btn btn-coral btn-lg"
          style={{ width: '100%', marginTop: '1rem' }}
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Cart Recommendations */}
      <section className="recommendations">
        <ProductSlider title="Complete Your Look" products={recommendations.slice(0, 4)} />
      </section>
    </div>
  );
}
