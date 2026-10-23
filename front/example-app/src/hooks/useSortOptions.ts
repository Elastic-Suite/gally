import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getSearchManager } from '../sdk'
import { useCatalog } from '../contexts/CatalogContext'

export interface SortOption {
  code: string
  label: string
  type: string
}

export type SortContext = 'category' | 'search'

// Fields that sort one way only, so the direction button is hidden for them.
export const ONE_WAY_SORT_FIELDS = ['_score', 'category__position']

// Sort codes whose label the API returns as fixed English, whatever the catalog: its sort order
// providers ignore the field's labels for these (gally-standard, Search/Service/
// SortingOptionsProvider.php:98 and Search/GraphQl/Type/Definition/SortOrder/
// {Category,Price,Stock}DefaultSortOrderProvider.php:48). The storefront translates them itself
// until the API does. Keep this list to those labels only: any other field's label is the
// merchant's, and is already localized. Recorded in missing-features.md.
export const API_FIXED_LABEL_CODES = [
  '_score',
  'category__position',
  'price__price',
  'stock__status',
]

// Demo shop -> prefix of the attributes it owns. Sortable fields are global in Gally, not per
// catalog (SourceField.isSortable has no catalog), and the demo loads three unrelated shops into
// one instance, so each shop would list the others' sortable fields ("Pipe diameter" on the
// paper shop). A field carrying another shop's prefix is dropped; unprefixed fields (name,
// price, created_at...) are shared and kept. A demo shortcut, recorded in missing-features.md.
const SHOP_FIELD_PREFIXES: Record<string, string> = {
  toolbox: 'tbx_',
  fashion: 'fio_',
  papershop: 'llv_',
}

function belongsToOtherShop(code: string, catalog: string | undefined) {
  return Object.entries(SHOP_FIELD_PREFIXES).some(
    ([shop, prefix]) => shop !== catalog && code.startsWith(prefix)
  )
}

// Sortable fields from the API (`productSortingOptions`), labels in the catalog's language.
// The SDK caches the request per catalog, so every listing shares one request.
//
// Dropped here rather than in the view:
// - `location`: distance sort needs a reference point the app does not have.
// - on search, `category__position`, which means nothing without a category.
// - fields of another demo shop, see SHOP_FIELD_PREFIXES.
//
// On failure the list is empty and the select keeps only its placeholder.
export function useSortOptions(context: SortContext): SortOption[] {
  const { t } = useTranslation('common')
  const { selectedLocalizedCatalog, selectedCatalog } = useCatalog()
  const [options, setOptions] = useState<SortOption[]>([])
  const localizedCatalog = selectedLocalizedCatalog?.code
  const catalog = selectedCatalog?.code

  useEffect(() => {
    if (!localizedCatalog) return
    let cancelled = false
    getSearchManager()
      .getProductSortingOptions(localizedCatalog)
      .then((fields) => {
        if (cancelled) return
        setOptions(
          fields
            .map((field) => ({
              code: field.getCode(),
              label: field.getDefaultLabel(),
              type: field.getType(),
            }))
            .filter(
              (option) =>
                option.type !== 'location' &&
                !belongsToOtherShop(option.code, catalog) &&
                !(context === 'search' && option.code === 'category__position')
            )
        )
      })
      .catch(() => {
        if (!cancelled) setOptions([])
      })
    return () => {
      cancelled = true
    }
  }, [localizedCatalog, catalog, context])

  return localizeSortOptions(options, t)
}

// Relevance first, and the app's own label for the codes the API leaves in English. A plain
// function so it can be tested without rendering the hook (specs/test-plan-translations.md).
export function localizeSortOptions(
  options: SortOption[],
  t: (key: string) => string
): SortOption[] {
  // Relevance first: the API appends it last, but on search it is the preselected default.
  const ordered = [
    ...options.filter((option) => option.code === '_score'),
    ...options.filter((option) => option.code !== '_score'),
  ]
  return ordered.map((option) =>
    API_FIXED_LABEL_CODES.includes(option.code)
      ? { ...option, label: t(`sort.fields.${option.code}`) }
      : option
  )
}
