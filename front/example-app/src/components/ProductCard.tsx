import { Link } from 'react-router-dom';
import { useCatalog } from '../contexts/CatalogContext';
import { useCart } from '../contexts/CartContext';
import { MEDIA_BASE_URL } from '../sdk';

interface Props {
  product: any;
}

function getProductFields(product: any) {
  // Products from search API come with a `source` wrapper
  const s = product.source || product;
  const name = Array.isArray(s.name) ? s.name[0] : s.name || 'Product';
  const sku = s.sku || product.sku || 'unknown';
  const image = s.image ? `${MEDIA_BASE_URL}${s.image}` : '';
  const price = s.price?.[0]?.price ?? 0;
  const originalPrice = s.price?.[0]?.original_price ?? s.price?.[0]?.originalPrice;
  const isDiscounted = s.price?.[0]?.is_discounted ?? s.price?.[0]?.isDiscounted ?? false;
  const isNew = s.new || s.is_new || false;
  const typeId = s.type_id || 'simple';
  const description = Array.isArray(s.description) ? s.description[0] : s.description || '';
  const stock = s.stock || { status: true, qty: 0 };
  return { name, sku, image, price, originalPrice, isDiscounted, isNew, typeId, description, stock };
}

export default function ProductCard({ product }: Props) {
  const { currencySymbol } = useCatalog();
  const { addToCart } = useCart();

  const { name, sku, image, price, originalPrice, isDiscounted, isNew, stock } = getProductFields(product);

  return (
    <div className="product-card">
      <Link to={`/product/${encodeURIComponent(sku)}`}>
        <div className="product-card-image">
          {isNew && <span className="product-card-badge">New</span>}
          {!stock.status && <span className="product-card-badge" style={{ background: 'var(--gray-500)' }}>Out of Stock</span>}
          {image ? (
            <img src={image} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          ) : (
            <span>📷 {name.substring(0, 20)}</span>
          )}
        </div>
      </Link>
      <div className="product-card-body">
        <Link to={`/product/${encodeURIComponent(sku)}`}>
          <div className="product-card-name">{name}</div>
        </Link>
        <div className="product-card-price">
          {isDiscounted && originalPrice && (
            <span style={{ textDecoration: 'line-through', color: 'var(--gray-400)', marginRight: '0.5rem', fontSize: '0.85em' }}>
              {currencySymbol}{originalPrice}
            </span>
          )}
          <span style={isDiscounted ? { color: 'var(--coral-500)', fontWeight: 600 } : {}}>
            {currencySymbol}{price}
          </span>
        </div>
        <div className="product-card-actions">
          <button
            className="btn btn-coral btn-sm"
            onClick={() => addToCart({ sku, name, price, childSku: sku, image })}
            disabled={!stock.status}
          >
            {stock.status ? 'Add to cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}

export { getProductFields };
