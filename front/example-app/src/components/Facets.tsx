import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FacetsSkeletonBody } from './skeletons';
// Shared with the PDP option selector, which draws the same swatches from the same labels.
import { guessColor, needsSwatchOutline } from './swatchColors';

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
  hasMore?: boolean;
}

interface Props {
  aggregations: Aggregation[];
  activeFilters: Record<string, any>;
  onFilterChange: (field: string, value: any) => void;
  loading?: boolean;
  onLoadMore?: (field: string) => Promise<FacetOption[]>;
  open?: boolean;
  // Required, not optional: it picks which "no filters" message to show, and a wrong
  // default would state something false about the result set.
  resultCount: number;
}

// Facet fields to hide (not discriminant)
const IGNORED_FACETS = ['name'];

export default function Facets({ aggregations, activeFilters, onFilterChange, loading, onLoadMore, open, resultCount }: Props) {
  const { t } = useTranslation('facets');

  // A facet with 0 or 1 possible value can't narrow anything — every matching
  // product already shares it — so it's noise, not a useful filter. Applies
  // uniformly across all facet types (checkbox/boolean/swatch/slider/category).
  const visibleAggregations = aggregations.filter(
    agg => !IGNORED_FACETS.includes(agg.field) && (agg.options?.length ?? 0) > 1
  );

  // Skeleton whenever a request is in flight and there is nothing to draw. Keyed on
  // visibleAggregations, not raw `aggregations`: a reload whose stale aggregations all
  // turn out non-discriminant would otherwise fall through and flash the "no filters"
  // message mid-request. This flag is also what guarantees that message only ever
  // renders on a settled result.
  const showSkeleton = loading && visibleAggregations.length === 0;

  const hasActiveFilters = Object.values(activeFilters).some(v => v !== undefined);

  return (
    // The <aside> and its heading are rendered unconditionally: the sidebar's shell —
    // its box, shadow, padding and sticky offset — does not depend on the results, so
    // returning a different <aside> while loading made the whole container unmount and
    // remount on every filter change. Only the rows below swap now.
    <aside className={`facets-sidebar ${open ? 'open' : ''}`}>
      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', marginBottom: '1rem' }}>{t('title')}</h3>
      {showSkeleton ? (
        <FacetsSkeletonBody />
      ) : (
        <>
        <ActiveFilterChips
          aggregations={visibleAggregations}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
        />
        {visibleAggregations.length === 0 ? (
          /* Nothing left to render: either the API returned no aggregations (it returns
             none at all for a zero-result query) or every one was dropped just above as
             non-discriminant. Without this the sidebar is a bare "Filters" heading on an
             empty card, which reads as a loading bug rather than an answer. The three
             cases are genuinely different, and only one of them is actionable. */
          <p className="facets-empty">
            {resultCount === 0
              ? (hasActiveFilters ? t('empty.filteredOut') : t('empty.noResults'))
              : t('empty.notDiscriminant', { count: resultCount })}
          </p>
        ) : (
          visibleAggregations.map(agg => (
            <FacetGroup
              key={agg.field}
              aggregation={agg}
              active={activeFilters[agg.field]}
              onChange={(val) => onFilterChange(agg.field, val)}
              onLoadMore={onLoadMore}
            />
          ))
        )}
        </>
      )}
    </aside>
  );
}

interface FilterChip {
  key: string;
  text: string;
  onRemove: () => void;
}

function ActiveFilterChips({
  aggregations,
  activeFilters,
  onFilterChange,
}: {
  aggregations: Aggregation[];
  activeFilters: Record<string, any>;
  onFilterChange: (field: string, value: any) => void;
}) {
  const { t } = useTranslation('facets');
  const chips: FilterChip[] = [];

  for (const [field, value] of Object.entries(activeFilters)) {
    if (value === undefined) continue;
    const agg = aggregations.find(a => a.field === field);
    const fieldLabel = agg?.label || field;

    if (Array.isArray(value)) {
      value.forEach((v: string) => {
        const opt = agg?.options?.find(o => o.value === v);
        chips.push({
          key: `${field}:${v}`,
          text: t('chip.default', { label: fieldLabel, value: opt?.label || v }),
          onRemove: () => {
            const next = value.filter((x: string) => x !== v);
            onFilterChange(field, next.length ? next : undefined);
          },
        });
      });
    } else if (typeof value === 'object' && value.gte !== undefined) {
      chips.push({
        key: field,
        text: t('chip.range', { label: fieldLabel, gte: value.gte, lte: value.lte }),
        onRemove: () => onFilterChange(field, undefined),
      });
    } else if (typeof value === 'boolean') {
      chips.push({
        key: field,
        text: fieldLabel,
        onRemove: () => onFilterChange(field, undefined),
      });
    } else {
      const opt = agg?.options?.find(o => o.value === value);
      chips.push({
        key: field,
        text: t('chip.default', { label: fieldLabel, value: opt?.label || value }),
        onRemove: () => onFilterChange(field, undefined),
      });
    }
  }

  if (chips.length === 0) return null;

  return (
    <div className="active-filters">
      {chips.map(chip => (
        <button key={chip.key} className="filter-chip" onClick={chip.onRemove}>
          {chip.text} <span aria-hidden="true">✕</span>
        </button>
      ))}
      {chips.length > 1 && (
        <button
          className="filter-chip filter-chip-clear"
          onClick={() => {
            // Clear each active field once — calling every chip's onRemove would
            // race for multi-value fields (each closes over the pre-clear array).
            Object.entries(activeFilters).forEach(([field, value]) => {
              if (value !== undefined) onFilterChange(field, undefined);
            });
          }}
        >
          {t('clearAll')}
        </button>
      )}
    </div>
  );
}

function FacetGroup({
  aggregation,
  active,
  onChange,
  onLoadMore,
}: {
  aggregation: Aggregation;
  active: any;
  onChange: (val: any) => void;
  onLoadMore?: (field: string) => Promise<FacetOption[]>;
}) {
  const { t } = useTranslation('facets');
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [extraOptions, setExtraOptions] = useState<FacetOption[] | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  if (aggregation.type === 'slider') {
    return <SliderFacet aggregation={aggregation} active={active} onChange={onChange} />;
  }

  if (aggregation.type === 'boolean') {
    return <BooleanFacet aggregation={aggregation} active={active} onChange={onChange} />;
  }

  if (aggregation.type === 'category') {
    return <CategoryFacet aggregation={aggregation} active={active} onChange={onChange} />;
  }

  // Check if it's a color swatch
  const isColor = aggregation.field.toLowerCase().includes('color');

  const baseOptions = extraOptions ?? aggregation.options ?? [];
  const filteredOptions = baseOptions.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const displayOptions = expanded ? filteredOptions : filteredOptions.slice(0, 5);
  const hasMoreLocally = filteredOptions.length > 5;
  // Backend truncates each aggregation's option list (~10); hasMore signals
  // there are more values on the server than were returned with the search.
  const canFetchFromServer = !!aggregation.hasMore && !extraOptions && !!onLoadMore;

  const handleShowMore = async () => {
    if (canFetchFromServer) {
      setLoadingMore(true);
      try {
        const fetched = await onLoadMore!(aggregation.field);
        if (fetched.length > 0) setExtraOptions(fetched);
      } finally {
        setLoadingMore(false);
      }
    }
    setExpanded(true);
  };

  if (isColor) {
    return (
      <div className="facet-group">
        <div className="facet-title">{aggregation.label}</div>
        <div className="facet-swatches">
          {filteredOptions.map(opt => {
            const color = guessColor(opt.label);
            const isActive = Array.isArray(active) && active.includes(opt.value);
            return (
              <div
                key={opt.value}
                className={`swatch ${isActive ? 'active' : ''}`}
                style={{ background: color, ...(needsSwatchOutline(opt.label) ? { border: '2px solid var(--gray-300)' } : {}) }}
                title={t('swatchTitle', { label: opt.label, count: opt.count })}
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
      {(baseOptions.length > 5 || canFetchFromServer) && (
        <input
          className="facet-search"
          placeholder={t('searchPlaceholder', { label: aggregation.label.toLowerCase() })}
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
      {(hasMoreLocally || canFetchFromServer) && !expanded && (
        <div className="facet-show-more" onClick={handleShowMore}>
          {loadingMore
            ? t('loading')
            : canFetchFromServer
              ? t('showMore')
              : t('showMoreCount', { count: filteredOptions.length - 5 })}
        </div>
      )}
      {expanded && filteredOptions.length > 5 && (
        <div className="facet-show-more" onClick={() => setExpanded(false)}>
          {t('showLess')}
        </div>
      )}
    </div>
  );
}

function CategoryFacet({ aggregation, active, onChange }: { aggregation: Aggregation; active: any; onChange: (val: any) => void }) {
  return (
    <div className="facet-group">
      <div className="facet-title">{aggregation.label}</div>
      {(aggregation.options || []).map(opt => {
        const isActive = active === opt.value;
        return (
          <label key={opt.value} className="facet-option">
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => onChange(isActive ? undefined : opt.value)}
            />
            <span>{opt.label}</span>
            <span className="count">{opt.count}</span>
          </label>
        );
      })}
    </div>
  );
}

function SliderFacet({ aggregation, active, onChange }: { aggregation: Aggregation; active: any; onChange: (val: any) => void }) {
  const { t } = useTranslation('facets');
  const options = aggregation.options || [];
  const min = options.length > 0 ? parseFloat(options[0].value) : 0;
  const max = options.length > 0 ? parseFloat(options[options.length - 1].value) : 1000;
  const [localMin, setLocalMin] = useState(active?.gte ?? min);
  const [localMax, setLocalMax] = useState(active?.lte ?? max);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-sync whenever the aggregation's bounds shift (a new search response narrows or
  // widens the price range — e.g. another filter changed, or this filter was cleared).
  // Without this, a stale localMin/localMax outside the new [min, max] produces
  // leftPct/rightPct outside 0–100%, and the track visually overflows its container.
  useEffect(() => {
    const clamp = (v: number) => Math.min(Math.max(v, min), max);
    setLocalMin(clamp(active?.gte ?? min));
    setLocalMax(clamp(active?.lte ?? max));
  }, [min, max, active?.gte, active?.lte]);

  const debouncedOnChange = (gte: number, lte: number) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange({ gte, lte }), 400);
  };

  const range = max - min;
  const leftPct = range > 0 ? ((localMin - min) / range) * 100 : 0;
  const rightPct = range > 0 ? ((localMax - min) / range) * 100 : 100;

  return (
    <div className="facet-group">
      <div className="facet-title">{aggregation.label}</div>
      <div className="price-slider">
        <div className="price-slider-bounds">
          <span className="price-bound-label">{t('min', { value: min })}</span>
          <span className="price-bound-label">{t('max', { value: max })}</span>
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
  const { t } = useTranslation('facets');
  return (
    <div className="facet-group">
      <div className="facet-title">{aggregation.label}</div>
      <label className="facet-option">
        <input
          type="checkbox"
          checked={!!active}
          onChange={() => onChange(active ? undefined : true)}
        />
        <span>{t('yes')}</span>
      </label>
    </div>
  );
}
