'use client';

import { useTranslation } from 'react-i18next';

// The sustainability mark for `llv_is_eco` products — see specs/feature-eco-badge.md.
//
// Deliberately NOT one of getProductBadges()'s entries. A card draws exactly one badge, and 23 of
// papershop's 104 eco products already win that slot with a sale or new pill; a fourth badge would
// go missing from the very listing this mark exists to explain. So it anchors to the opposite
// corner and never competes.
//
// Text, no glyph — the same shape as the sale, new and material pills. The green classifies and
// the word names; the attribute's full label is the tooltip, so the pill can be terse without
// being vague.
//
// Shared by the card and the product page on purpose: two copies of this is how the two surfaces
// start disagreeing about what an eco product looks like.
export default function EcoMark() {
  const { t } = useTranslation('product');

  return (
    <div className="product-card-badges product-card-badges--corner">
      {/* The visible word is the accessible name; `title` only elaborates on it. No aria-label —
          one that disagreed with the text would be worse than none. */}
      <span className="product-card-badge product-card-badge--eco" title={t('card.eco')}>
        {t('card.ecoShort')}
      </span>
    </div>
  );
}
