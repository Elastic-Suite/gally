'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useAddedFlash } from '../hooks/useAddedFlash';
import VariantSelector, { getVariantAxes } from './VariantSelector';
import { getProductFields } from '../sdk/productFields';

// The add-to-cart affordance shared by the grid card and the autocomplete row, so the two cannot
// drift apart on the one rule that matters here: **a configurable product is never added without
// the visitor saying which combination.** Before this existed, both surfaces called
// addToCart({ ..., childSku: sku }) directly, which on the Venia catalogue meant blind-adding a
// parent SKU with no size and no colour for 70 of 85 products.
//
// What it deliberately does NOT do is invent a child SKU. The index carries `children.sku` but no
// per-child attribute values, so no chosen combination can be resolved to a real child — the
// parent SKU plus the chosen labels as `variant` is the only honest payload, and it is exactly
// what the product page already sends. See specs/feature-configurable-option-selection.md.

interface Props {
  product: any;
  // The autocomplete row lives inside a clickable row that navigates on click, and inside a popup
  // that closes on blur. It passes the guards it needs; the card passes nothing.
  onInteract?: (e: React.SyntheticEvent) => void;
  // useAddedFlash is per-instance state, so the confirmation this component shows on its own
  // button cannot drive the surrounding card's green flash. The card passes its own `flash` here.
  onAdded?: (sku: string) => void;
  // Extra class on the button. The autocomplete passes `autocomplete-add-to-cart` to keep the
  // five rules already written against it — the rest-opacity fade, the hover scale, the disabled
  // tint, and the (0,4,0) override that stops both animating under the add confirmation. Keeping
  // the class is safer than re-pointing those selectors at `.quick-add-button`.
  buttonClassName?: string;
}

export default function QuickAdd({ product, onInteract, onAdded, buttonClassName = '' }: Props) {
  const { t } = useTranslation('product');
  const { addToCart } = useCart();
  const { addedKey, flash } = useAddedFlash();
  const [selected, setSelected] = useState<Record<string, string>>({});

  const { name, sku, image, price, available, attributes } = getProductFields(product);
  const axes = getVariantAxes(attributes);
  const justAdded = addedKey === sku;

  // Every axis must be answered. This is the whole point of the overlay, so unlike the product
  // page — which deliberately does not gate, because there the parent SKU goes either way — an
  // incomplete selection here means there is nothing worth recording yet.
  const chosen = axes.filter(axis => selected[axis.code]);
  const isComplete = chosen.length === axes.length;

  const label = () => {
    if (!available) return t('card.unavailable');
    if (justAdded) return t('card.added');
    if (!isComplete) return t('card.chooseOptions');
    return t('card.addToCart');
  };

  return (
    <div className="quick-add" onClick={onInteract} onMouseDown={onInteract}>
      {axes.length > 0 && available && (
        <VariantSelector
          axes={axes}
          selected={selected}
          onSelect={(code, value) => setSelected(prev => ({ ...prev, [code]: value }))}
          compact
        />
      )}
      <button
        type="button"
        className={`btn btn-primary btn-sm quick-add-button ${buttonClassName} ${justAdded ? 'added' : ''}`}
        disabled={!available || !isComplete}
        onClick={() => {
          addToCart({
            sku,
            name,
            price,
            image,
            // Labels in axis order, matching the product page's format exactly so the same
            // combination lands on the same cart line whichever surface added it — line identity
            // is sku + variant (specs/bugfix-cart-variant-line-identity.md).
            variant: chosen.length
              ? axes
                  .map(axis => axis.options.find(o => String(o.value) === selected[axis.code])?.label)
                  .filter(Boolean)
                  .join(' / ')
              : undefined,
            // No childSku, on purpose. See the note at the top of this file.
          });
          flash(sku);
          onAdded?.(sku);
          setSelected({});
        }}
      >
        {label()}
      </button>
    </div>
  );
}
