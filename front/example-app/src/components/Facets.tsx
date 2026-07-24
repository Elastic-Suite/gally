import { useState, useRef } from 'react';

interface FacetOption {
  label: string;
  count: number;
  value: string;
}

interface Aggregation {
  field: string;
  label: string;
  type: string;
  options: FacetOption[];
}

interface Props {
  aggregations: Aggregation[];
  activeFilters: Record<string, any>;
  onFilterChange: (field: string, value: any) => void;
  loading?: boolean;
}

// Facet fields to hide (not discriminant)
const IGNORED_FACETS = ['name'];

// Extended color map for label-to-hex approximation
const SWATCH_COLORS: Record<string, string> = {
  black: '#222', white: '#fff', red: '#e53935', blue: '#1e88e5',
  green: '#43a047', yellow: '#fdd835', pink: '#ec407a', brown: '#6d4c41',
  gray: '#9e9e9e', grey: '#9e9e9e', orange: '#ff9800', purple: '#7b1fa2',
  gold: '#ffd700', silver: '#c0c0c0', beige: '#f5f5dc', navy: '#001f3f',
  coral: '#ff6b6b', cream: '#fffdd0', ivory: '#fffff0', khaki: '#c3b091',
  lavender: '#b57edc', lime: '#cddc39', magenta: '#e91e63', maroon: '#800000',
  mint: '#98ff98', olive: '#808000', peach: '#ffcba4', plum: '#8e4585',
  rose: '#ff007f', rust: '#b7410e', salmon: '#fa8072', teal: '#008080',
  turquoise: '#40e0d0', violet: '#7f00ff', wine: '#722f37', tan: '#d2b48c',
  charcoal: '#36454f', burgundy: '#800020', taupe: '#483c32', nude: '#f2d2bd',
  aqua: '#00ffff', indigo: '#4b0082', chocolate: '#7b3f00', camel: '#c19a6b',
  blush: '#de5d83', champagne: '#f7e7ce', copper: '#b87333', denim: '#1560bd',
  emerald: '#50c878', fuchsia: '#ff00ff', garnet: '#733635', jade: '#00a86b',
  lemon: '#fff44f', lilac: '#c8a2c8', mauve: '#e0b0ff', mustard: '#ffdb58',
  opal: '#a8c3bc', pewter: '#8e9196', ruby: '#e0115f', sage: '#bcb88a',
  sapphire: '#0f52ba', scarlet: '#ff2400', slate: '#708090', stone: '#928e85',
  'off white': '#faf9f6', 'off-white': '#faf9f6', 'light blue': '#add8e6',
  'light green': '#90ee90', 'light pink': '#ffb6c1', 'light gray': '#d3d3d3',
  'dark blue': '#00008b', 'dark green': '#006400', 'dark red': '#8b0000',
  'dark gray': '#a9a9a9', 'dark grey': '#a9a9a9',
  multi: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
  multicolor: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
};

function guessColor(label: string): string {
  const lower = label.toLowerCase().trim();
  // Direct match
  if (SWATCH_COLORS[lower]) return SWATCH_COLORS[lower];
  // Partial match — check if any key is contained in the label
  for (const [key, val] of Object.entries(SWATCH_COLORS)) {
    if (lower.includes(key)) return val;
  }
  // Fallback: use a hash-based hue
  let hash = 0;
  for (let i = 0; i < lower.length; i++) hash = lower.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 55%)`;
}

export default function Facets({ aggregations, activeFilters, onFilterChange, loading }: Props) {
  // Show skeleton when loading and no aggregations yet
  if (loading && aggregations.length === 0) {
    return (
      <aside className="facets-sidebar">
        <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', marginBottom: '1rem' }}>Filters</h3>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="facet-group">
            <div className="skeleton skeleton-text" style={{ width: '100px', height: '12px', marginBottom: '0.75rem' }} />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="skeleton skeleton-text" style={{ width: `${60 + Math.random() * 30}%`, height: '14px', marginBottom: '0.5rem' }} />
            ))}
          </div>
        ))}
      </aside>
    );
  }

  const visibleAggregations = aggregations.filter(
    agg => !IGNORED_FACETS.includes(agg.field)
  );

  return (
    <aside className="facets-sidebar">
      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', marginBottom: '1rem' }}>Filters</h3>
      {visibleAggregations.map(agg => (
        <FacetGroup
          key={agg.field}
          aggregation={agg}
          active={activeFilters[agg.field]}
          onChange={(val) => onFilterChange(agg.field, val)}
        />
      ))}
    </aside>
  );
}

function FacetGroup({ aggregation, active, onChange }: { aggregation: Aggregation; active: any; onChange: (val: any) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');

  if (aggregation.type === 'slider') {
    return <SliderFacet aggregation={aggregation} active={active} onChange={onChange} />;
  }

  if (aggregation.type === 'boolean') {
    return <BooleanFacet aggregation={aggregation} active={active} onChange={onChange} />;
  }

  // Check if it's a color swatch
  const isColor = aggregation.field.toLowerCase().includes('color');

  const filteredOptions = aggregation.options?.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const displayOptions = expanded ? filteredOptions : filteredOptions.slice(0, 5);
  const hasMore = filteredOptions.length > 5;

  if (isColor) {
    return (
      <div className="facet-group">
        <div className="facet-title">{aggregation.label}</div>
        <div className="facet-swatches">
          {filteredOptions.map(opt => {
            const color = guessColor(opt.label);
            const isMulti = color.includes('gradient');
            const isActive = Array.isArray(active) && active.includes(opt.value);
            return (
              <div
                key={opt.value}
                className={`swatch ${isActive ? 'active' : ''}`}
                style={{ background: color, ...(opt.label.toLowerCase() === 'white' ? { border: '2px solid var(--gray-300)' } : {}) }}
                title={`${opt.label} (${opt.count})`}
                onClick={() => {
                  const current = Array.isArray(active) ? active : [];
                  const next = isActive
                    ? current.filter((v: string) => v !== opt.value)
                    : [...current, opt.value];
                  onChange(next.length ? next : undefined);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="facet-group">
      <div className="facet-title">{aggregation.label}</div>
      {filteredOptions.length > 5 && (
        <input
          className="facet-search"
          placeholder={`Search ${aggregation.label.toLowerCase()}…`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      )}
      {displayOptions.map(opt => {
        const isChecked = Array.isArray(active) && active.includes(opt.value);
        return (
          <label key={opt.value} className="facet-option">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => {
                const current = Array.isArray(active) ? active : [];
                const next = isChecked
                  ? current.filter((v: string) => v !== opt.value)
                  : [...current, opt.value];
                onChange(next.length ? next : undefined);
              }}
            />
            <span>{opt.label}</span>
            <span className="count">{opt.count}</span>
          </label>
        );
      })}
      {hasMore && !expanded && (
        <div className="facet-show-more" onClick={() => setExpanded(true)}>
          + Show more ({filteredOptions.length - 5})
        </div>
      )}
      {expanded && hasMore && (
        <div className="facet-show-more" onClick={() => setExpanded(false)}>
          − Show less
        </div>
      )}
    </div>
  );
}

function SliderFacet({ aggregation, active, onChange }: { aggregation: Aggregation; active: any; onChange: (val: any) => void }) {
  const options = aggregation.options || [];
  const min = options.length > 0 ? parseFloat(options[0].value) : 0;
  const max = options.length > 0 ? parseFloat(options[options.length - 1].value) : 1000;
  const [localMin, setLocalMin] = useState(active?.gte ?? min);
  const [localMax, setLocalMax] = useState(active?.lte ?? max);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedOnChange = (gte: number, lte: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange({ gte, lte }), 400);
  };

  const leftPct = ((localMin - min) / (max - min)) * 100;
  const rightPct = ((localMax - min) / (max - min)) * 100;

  return (
    <div className="facet-group">
      <div className="facet-title">{aggregation.label}</div>
      <div className="price-slider">
        <div className="price-slider-bounds">
          <span className="price-bound-label">Min: {min}</span>
          <span className="price-bound-label">Max: {max}</span>
        </div>
        <div className="price-slider-track-container">
          <div className="price-slider-track-bg" />
          <div className="price-slider-track-active" style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }} />
          <input
            type="range"
            min={min}
            max={max}
            value={localMin}
            onChange={e => {
              const v = Math.min(parseFloat(e.target.value), localMax - 1);
              setLocalMin(v);
              debouncedOnChange(v, localMax);
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={localMax}
            onChange={e => {
              const v = Math.max(parseFloat(e.target.value), localMin + 1);
              setLocalMax(v);
              debouncedOnChange(localMin, v);
            }}
          />
        </div>
        <div className="price-range-values">
          <span className="price-value-badge">{localMin}</span>
          <span className="price-value-sep">—</span>
          <span className="price-value-badge">{localMax}</span>
        </div>
      </div>
    </div>
  );
}

function BooleanFacet({ aggregation, active, onChange }: { aggregation: Aggregation; active: any; onChange: (val: any) => void }) {
  return (
    <div className="facet-group">
      <div className="facet-title">{aggregation.label}</div>
      <label className="facet-option">
        <input
          type="checkbox"
          checked={!!active}
          onChange={() => onChange(active ? undefined : true)}
        />
        <span>Yes</span>
      </label>
    </div>
  );
}
