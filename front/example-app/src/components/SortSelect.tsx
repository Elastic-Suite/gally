import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from './Icon'
import {
  ONE_WAY_SORT_FIELDS,
  SortContext,
  useSortOptions,
} from '../hooks/useSortOptions'

export type SortDirection = 'asc' | 'desc'

interface DefaultSort {
  field: string
  direction: SortDirection
}

interface SortSelectProps {
  context: SortContext
  // '' until the visitor picks a sort: no sort on a category page (the category's configured
  // default applies), `_score` on the search page. Keeping it empty is what lets both views
  // reuse the server-rendered first page - see specs/feature-dynamic-sort-options.md.
  field: string
  direction: SortDirection
  // The sort the API reported for the last result. While `field` is '', that is the default.
  appliedField?: string
  appliedDirection?: string
  onChange: (field: string, direction: SortDirection) => void
}

// The direction a field gets when it is picked.
function naturalDirection(field: string): SortDirection {
  return field === '_score' ? 'desc' : 'asc'
}

const SEARCH_DEFAULT: DefaultSort = { field: '_score', direction: 'desc' }

export default function SortSelect({
  context,
  field,
  direction,
  appliedField,
  appliedDirection,
  onChange,
}: SortSelectProps) {
  const { t } = useTranslation('common')
  const options = useSortOptions(context)

  // The default sort is shown as its own option, preselected, rather than as a separate
  // "Default" entry that would list it twice. On a category it is only known from a response
  // to the unsorted request, so it is remembered here: it must survive the visitor picking
  // another sort. Updated during render, React's pattern for state derived from a prop.
  const [categoryDefault, setCategoryDefault] = useState<DefaultSort | null>(
    null
  )
  // Compared after normalising: the API may report an empty direction, and comparing the raw
  // value against the stored 'asc' would set state on every render (an infinite loop).
  const reportedDirection: SortDirection =
    appliedDirection === 'desc' ? 'desc' : 'asc'
  if (
    context === 'category' &&
    field === '' &&
    appliedField &&
    (appliedField !== categoryDefault?.field ||
      reportedDirection !== categoryDefault?.direction)
  ) {
    setCategoryDefault({ field: appliedField, direction: reportedDirection })
  }
  const defaultSort = context === 'search' ? SEARCH_DEFAULT : categoryDefault

  const shownField = field || defaultSort?.field || ''
  const shownDirection = field ? direction : defaultSort?.direction ?? direction
  // Placeholder only while the shown sort is not one of the options yet (first response
  // pending, or the options request failed), so the select always has a valid value.
  const needsPlaceholder = !options.some((option) => option.code === shownField)

  const hasDirection =
    shownField !== '' && !ONE_WAY_SORT_FIELDS.includes(shownField)
  const directionLabel = t('sort.directionLabel', {
    direction: t(
      shownDirection === 'asc' ? 'sort.ascending' : 'sort.descending'
    ),
  })

  return (
    <div className="products-sort">
      <select
        aria-label={t('sort.label')}
        value={needsPlaceholder ? '' : shownField}
        onChange={(e) =>
          onChange(e.target.value, naturalDirection(e.target.value))
        }
      >
        {needsPlaceholder && (
          <option value="" disabled>
            {t('sort.default')}
          </option>
        )}
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
      {hasDirection && (
        <button
          type="button"
          className="products-sort-direction"
          aria-label={directionLabel}
          title={directionLabel}
          onClick={() =>
            onChange(shownField, shownDirection === 'asc' ? 'desc' : 'asc')
          }
        >
          <Icon
            name={shownDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
            standalone
          />
        </button>
      )}
    </div>
  )
}
