import { useState } from 'react';

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
}

const SWATCH_COLORS: Record<string, string> = {
  black: '#222', white: '#fff', red: '#e53935', blue: '#1e88e5',
  green: '#43a047', yellow: '#fdd835', pink: '#ec407a', brown: '#6d4c41',
  gray: '#9e9e9e', orange: '#ff9800', purple: '#7b1fa2', gold: '#ffd700',
};

export default function Facets({ aggregations, activeFilters, onFilterChange }: Props) {
  return (
    <aside className="facets-sidebar">
      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', marginBottom: '1rem' }}>Filters</h3>
      {aggregations.map(agg => (
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
            const color = SWATCH_COLORS[opt.value.toLowerCase()] || opt.value;
            const isActive = Array.isArray(active) && active.includes(opt.value);
            return (
              <div
                key={opt.value}
                className={`swatch ${isActive ? 'active' : ''}`}
                style={{ backgroundColor: color }}
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

  return (
    <div className="facet-group">
      <div className="facet-title">{aggregation.label}</div>
      <div className="price-slider">
        <input
          type="range"
          min={min}
          max={max}
          value={localMin}
          onChange={e => {
            const v = parseFloat(e.target.value);
            setLocalMin(v);
            onChange({ gte: v, lte: localMax });
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={localMax}
          onChange={e => {
            const v = parseFloat(e.target.value);
            setLocalMax(v);
            onChange({ gte: localMin, lte: v });
          }}
        />
        <div className="price-range-labels">
          <span>{localMin}</span>
          <span>{localMax}</span>
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
