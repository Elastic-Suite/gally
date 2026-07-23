import { useMemo, useState } from 'react'
import { useLocale } from '../../hooks/useLocale'
import { formatPrice } from '../../lib/format'
import type { Facet } from '../../data/types'

interface FacetSidebarProps {
  facets: Facet[]
  selectedValues: Record<string, string[]>
  onToggle: (field: string, value: string) => void
  onPriceRangeChange?: (
    min: number | undefined,
    max: number | undefined,
  ) => void
  minPrice?: number
  maxPrice?: number
  hasActiveFilters: boolean
  onClearAll: () => void
}

const VISIBLE_OPTIONS_DEFAULT = 5

export function FacetSidebar({
  facets,
  selectedValues,
  onToggle,
  onPriceRangeChange,
  minPrice,
  maxPrice,
  hasActiveFilters,
  onClearAll,
}: FacetSidebarProps) {
  const { country, language } = useLocale()

  return (
    <aside className="w-full shrink-0 lg:w-64" aria-label="Filters">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-900/70">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm text-brand-500 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-col divide-y divide-line-200">
        {facets.map((facet) =>
          facet.type === 'slider' ? (
            <PriceFacet
              key={facet.field}
              facet={facet}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onChange={onPriceRangeChange ?? (() => {})}
              format={(value) => formatPrice(value, country, language)}
            />
          ) : (
            <CheckboxFacet
              key={facet.field}
              facet={facet}
              selected={selectedValues[facet.field] ?? []}
              onToggle={(value) => onToggle(facet.field, value)}
            />
          ),
        )}
      </div>
    </aside>
  )
}

function CheckboxFacet({
  facet,
  selected,
  onToggle,
}: {
  facet: Facet
  selected: string[]
  onToggle: (value: string) => void
}) {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(false)

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return facet.options
    return facet.options.filter((o) => o.label.toLowerCase().includes(q))
  }, [facet.options, search])

  const visibleOptions = expanded
    ? filteredOptions
    : filteredOptions.slice(0, VISIBLE_OPTIONS_DEFAULT)
  const canToggleVisibility = filteredOptions.length > VISIBLE_OPTIONS_DEFAULT

  return (
    <div className="py-4 first:pt-0">
      <h3 className="mb-2 text-sm font-semibold text-ink-900">{facet.label}</h3>

      {facet.options.length > VISIBLE_OPTIONS_DEFAULT && (
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${facet.label.toLowerCase()}...`}
          aria-label={`Search ${facet.label} options`}
          className="mb-2 w-full rounded border border-line-200 px-2 py-1 text-sm focus:border-brand-400 focus:outline-none"
        />
      )}

      <ul className="flex flex-col gap-1.5">
        {visibleOptions.map((option) => (
          <li key={option.value}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-900/80 hover:text-ink-900">
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => onToggle(option.value)}
                className="h-4 w-4 rounded border-line-200 accent-brand-500"
              />
              <span className="flex-1">{option.label}</span>
              <span className="text-ink-900/40">{option.count}</span>
            </label>
          </li>
        ))}
        {filteredOptions.length === 0 && (
          <li className="text-sm text-ink-900/40">No matches.</li>
        )}
      </ul>

      {canToggleVisibility && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-sm text-brand-500 hover:underline"
        >
          {expanded
            ? 'See less'
            : `See more (${filteredOptions.length - VISIBLE_OPTIONS_DEFAULT})`}
        </button>
      )}
    </div>
  )
}

const THUMB_STYLES =
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500 ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-brand-500'

function PriceFacet({
  facet,
  minPrice,
  maxPrice,
  onChange,
  format,
}: {
  facet: Facet
  minPrice: number | undefined
  maxPrice: number | undefined
  onChange: (min: number | undefined, max: number | undefined) => void
  format: (value: number) => string
}) {
  const values = facet.options.map((o) => Number(o.value))
  const boundMin = Math.min(...values)
  const boundMax = Math.max(...values)
  const currentMin = minPrice ?? boundMin
  const currentMax = maxPrice ?? boundMax
  const span = boundMax - boundMin || 1
  const minPercent = ((currentMin - boundMin) / span) * 100
  const maxPercent = ((currentMax - boundMin) / span) * 100

  return (
    <div className="py-4 first:pt-0">
      <h3 className="mb-2 text-sm font-semibold text-ink-900">{facet.label}</h3>

      <p className="mb-3 text-sm text-ink-900/80">
        {format(currentMin)} – {format(currentMax)}
      </p>

      <div className="relative h-4">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-line-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-500"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={boundMin}
          max={boundMax}
          value={currentMin}
          aria-label={`Minimum ${facet.label.toLowerCase()}`}
          onChange={(e) =>
            onChange(Math.min(Number(e.target.value), currentMax), maxPrice)
          }
          className={`pointer-events-none absolute inset-0 z-10 h-4 w-full appearance-none bg-transparent ${THUMB_STYLES}`}
        />
        <input
          type="range"
          min={boundMin}
          max={boundMax}
          value={currentMax}
          aria-label={`Maximum ${facet.label.toLowerCase()}`}
          onChange={(e) =>
            onChange(minPrice, Math.max(Number(e.target.value), currentMin))
          }
          className={`pointer-events-none absolute inset-0 z-20 h-4 w-full appearance-none bg-transparent ${THUMB_STYLES}`}
        />
      </div>

      <div className="mt-1 flex justify-between text-xs text-ink-900/40">
        <span>{format(boundMin)}</span>
        <span>{format(boundMax)}</span>
      </div>
    </div>
  )
}
