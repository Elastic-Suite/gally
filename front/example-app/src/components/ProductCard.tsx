'use client';

import Link from './LocaleLink';
import { useTranslation } from 'react-i18next';
import { useCatalog } from '../contexts/CatalogContext';
import { useCart } from '../contexts/CartContext';
import { useAddedFlash } from '../hooks/useAddedFlash';
import { getProductFields } from '../sdk/productFields';

interface Props {
  product: any;
}


export default function ProductCard({ product }: Props) {
  const { t } = useTranslation('product');
  const { formatPrice } = useCatalog();
  const { addToCart } = useCart();
  // Same in-place confirmation the autocomplete uses — the cart badge is up in
  // the header, too far from a card in a long grid to be noticed.
  const { addedKey, flash } = useAddedFlash();

  const { name, sku, image, price, originalPrice, isDiscounted, isNew, stock } = getProductFields(product);
  const justAdded = addedKey === sku;

  return (
    <div className={`product-card ${justAdded ? 'just-added' : ''}`}>
      <Link href={`/product/${encodeURIComponent(sku)}`}>
        <div className="product-card-image">
          {isNew && <span className="product-card-badge">{t('card.new')}</span>}
          {!stock.status && <span className="product-card-badge" style={{ background: 'var(--gray-500)' }}>{t('card.outOfStock')}</span>}
          {image ? (
            <img src={image} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          ) : (
            <span>📷 {name.substring(0, 20)}</span>
          )}
        </div>
      </Link>
      <div className="product-card-body">
        <Link href={`/product/${encodeURIComponent(sku)}`}>
          <div className="product-card-name">{name}</div>
        </Link>
        <div className="product-card-price">
          {isDiscounted && originalPrice && (
            <span style={{ textDecoration: 'line-through', color: 'var(--gray-400)', marginRight: '0.5rem', fontSize: '0.85em' }}>
              {formatPrice(originalPrice)}
            </span>
          )}
          <span style={isDiscounted ? { color: 'var(--coral-500)', fontWeight: 600 } : {}}>
            {formatPrice(price)}
          </span>
        </div>
        <div className="product-card-actions">
          <button
            className={`btn btn-primary btn-sm ${justAdded ? 'added' : ''}`}
            onClick={() => {
              addToCart({ sku, name, price, childSku: sku, image });
              flash(sku);
            }}
            disabled={!stock.status}
          >
            {!stock.status
              ? t('card.unavailable')
              : justAdded
                ? t('card.added')
                : t('card.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}

export { getProductFields };
