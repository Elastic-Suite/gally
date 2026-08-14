'use client';

import Link from './LocaleLink';
import { useTranslation } from 'react-i18next';
import { useCatalog } from '../contexts/CatalogContext';
import { useAddedFlash } from '../hooks/useAddedFlash';
import { getProductFields, getProductBadges } from '../sdk/productFields';
import QuickAdd from './QuickAdd';

interface Props {
  product: any;
}


export default function ProductCard({ product }: Props) {
  const { t } = useTranslation('product');
  const { formatPrice } = useCatalog();
  // Same in-place confirmation the autocomplete uses — the cart badge is up in
  // the header, too far from a card in a long grid to be noticed. QuickAdd owns the button's
  // own confirmation; this instance only drives the card's green flash around it.
  const { addedKey, flash } = useAddedFlash();

  const fields = getProductFields(product);
  const { name, sku, image, price, originalPrice, isDiscounted } = fields;
  // Which badges apply is a property of the product, not of the card — the rule lives in
  // ../sdk/productFields.ts so the product page overlays the same set on its own picture.
  // A card gets exactly ONE: the picture is 180px tall in a grid of them, and a stack of pills
  // eats the product it is meant to sell. getProductBadges() is ordered by priority, so taking
  // the first is the whole selection rule — never re-sort here, or a card and its PDP would
  // disagree about which badge matters most.
  const badges = getProductBadges(fields).slice(0, 1);
  const justAdded = addedKey === sku;

  return (
    <div className={`product-card ${justAdded ? 'just-added' : ''}`}>
      {/* The Link wraps ONLY the picture, not the whole `.product-card-image` box as it used to.
          The quick-add panel is a sibling inside that box: its buttons and option chips cannot
          live inside an anchor — nested interactive elements are invalid HTML, and in practice
          every chip click would also navigate to the product page. */}
      <div className="product-card-image">
        {badges.length > 0 && (
          <div className="product-card-badges">
            {badges.map((badge) => (
              <span key={badge.variant} className={`product-card-badge product-card-badge--${badge.variant}`}>
                {t(badge.key, badge.params)}
              </span>
            ))}
          </div>
        )}
        <Link href={`/product/${encodeURIComponent(sku)}`} className="product-card-image-link">
          {image ? (
            <img src={image} alt={name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          ) : (
            <span>📷 {name.substring(0, 20)}</span>
          )}
        </Link>
        <QuickAdd product={product} onAdded={flash} />
      </div>
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
      </div>
    </div>
  );
}

export { getProductFields };
