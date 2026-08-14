'use client';

import { useTranslation } from 'react-i18next';
import { guessColor, needsSwatchOutline } from './swatchColors';
import { parseAxisCodes } from '../sdk/productFields';

export interface VariantOption {
  label: string;
  value: string | number;
}

export interface VariantAxis {
  // Source-field code, e.g. `fashion_color` on Venia or `color` on Luma.
  code: string;
  options: VariantOption[];
}

// Neither source of options is ordered usefully: the raw `_source.fashion_size` comes back in
// Elasticsearch's order (`XL, 8, 6, 4, 10, 2` on VSK12) and the aggregation sorts
// alphabetically (`10, 2, 4, 6, 8, XL`). The source field's own `position` is not in the search
// response, so the ordering has to live here.
//
// The demo catalogue mixes two size systems on one attribute — numeric (2…12) and alpha
// (XS…XXL) — so a single scale cannot hold both. Numerics sort first among themselves, then the
// alpha scale in wearing order, then anything unrecognised, which keeps its incoming order
// (Array#sort is stable).
const ALPHA_SIZES = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];
const ALPHA_BASE = 1000;

function sizeRank(label: string): number {
  const lower = label.toLowerCase().trim();
  const alpha = ALPHA_SIZES.indexOf(lower);
  if (alpha !== -1) return ALPHA_BASE + alpha;
  const numeric = Number(lower);
  if (lower !== '' && !Number.isNaN(numeric)) return numeric;
  return Number.MAX_SAFE_INTEGER;
}

function isColorAxis(code: string): boolean {
  // Same test the colour facet applies to its field name (see Facets.tsx).
  return code.toLowerCase().includes('color') || code.toLowerCase().includes('colour');
}

// Which attributes actually vary, and with which values. `configurable_attributes` is the only
// field that says so — deriving axes from "every select attribute with more than one value"
// would promote `fashion_material` and `fashion_style` into axes, which they are not.
//
// `source` is either the PDP's raw `_source` or a projected listing row; the two are the same
// shape for this purpose. parseAxisCodes() absorbs the difference in how the codes arrive — a
// real array on the PDP, a string from GraphQL — so this function works on both surfaces.
export function getVariantAxes(source: Record<string, any> | undefined): VariantAxis[] {
  if (!source) return [];
  const codes = parseAxisCodes(source.configurable_attributes);

  return codes
    .map(code => {
      const raw = source[code];
      const options: VariantOption[] = (Array.isArray(raw) ? raw : [])
        .filter(o => o && typeof o === 'object' && 'label' in o)
        .map(o => ({ label: String(o.label), value: o.value }));

      if (isColorAxis(code)) {
        options.sort((a, b) => a.label.localeCompare(b.label));
      } else {
        options.sort((a, b) => sizeRank(a.label) - sizeRank(b.label));
      }

      return { code, options };
    })
    .filter(axis => axis.options.length > 0);
}

interface Props {
  axes: VariantAxis[];
  // Axis code → selected option value, as a string. Empty until the user picks: the previous
  // implementation defaulted to the first colour, which claimed a choice nobody made.
  selected: Record<string, string>;
  onSelect: (code: string, value: string) => void;
  // Drops the per-axis heading and tightens the rows, for the quick-add overlay on a 180px-tall
  // product picture. The axis is still announced to screen readers through `aria-label` on the
  // radiogroup, so losing the visible <h4> costs nothing but pixels.
  compact?: boolean;
}

export default function VariantSelector({ axes, selected, onSelect, compact = false }: Props) {
  const { t } = useTranslation('product');

  if (axes.length === 0) return null;

  return (
    <>
      {axes.map(axis => {
        // Heading per attribute code, falling back to the code itself. Deliberately not taken
        // from the matching aggregation's localized label: the PDP's server pre-fetch returns
        // the document only, so the heading would be missing from the SSR HTML and appear on
        // hydration. See specs/feature-configurable-option-selection.md.
        const heading = t(`page.axis.${axis.code}`, { defaultValue: axis.code });
        const asSwatches = isColorAxis(axis.code);

        return (
          <div className={`product-variants ${compact ? 'product-variants-compact' : ''}`} key={axis.code}>
            {!compact && <h4 id={`axis-${axis.code}`}>{heading}</h4>}
            <div
              className={asSwatches ? 'facet-swatches' : 'variant-options'}
              role="radiogroup"
              {...(compact
                ? { 'aria-label': heading }
                : { 'aria-labelledby': `axis-${axis.code}` })}
            >
              {axis.options.map(opt => {
                const value = String(opt.value);
                const isSelected = selected[axis.code] === value;
                return (
                  <div
                    key={value}
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={opt.label}
                    tabIndex={0}
                    title={asSwatches ? opt.label : undefined}
                    className={
                      asSwatches
                        ? `swatch ${isSelected ? 'active' : ''}`
                        : `variant-option ${isSelected ? 'selected' : ''}`
                    }
                    style={
                      asSwatches
                        ? {
                            background: guessColor(opt.label),
                            ...(needsSwatchOutline(opt.label)
                              ? { border: '2px solid var(--gray-300)' }
                              : {}),
                          }
                        : undefined
                    }
                    onClick={() => onSelect(axis.code, value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelect(axis.code, value);
                      }
                    }}
                  >
                    {asSwatches ? null : opt.label}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
