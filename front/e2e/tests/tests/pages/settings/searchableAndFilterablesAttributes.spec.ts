import { test, expect } from '@playwright/test'
import { Grid } from '../../../helper/grid'
import { Filter, FilterType } from '../../../helper/filter'
import { Dropdown } from '../../../helper/dropdown'
import { login } from '../../../helper/auth'
import { navigateTo } from '../../../helper/menu'
import { Switch } from '../../../helper/switch'

const GridLabelsAndFilters = {
  code: {
    gridLabel: 'Attribute code',
    filterTestId: 'code',
  },
  defaultLabel: { gridLabel: 'Attribute label', filterTestId: 'defaultLabel' },
  type: { gridLabel: 'Attribute type', filterTestId: 'type[]' },
  isFilterable: { gridLabel: 'Filterable', filterTestId: 'isFilterable' },
  isSearchable: { gridLabel: 'Searchable', filterTestId: 'isSearchable' },
  isSortable: { gridLabel: 'Sortable', filterTestId: 'isSortable' },
  isUsedForRules: {
    gridLabel: 'Use in rule engine',
    filterTestId: 'isUsedForRules',
  },
  isUsedInAutocomplete: {
    gridLabel: 'Displayed in autocomplete',
    filterTestId: 'isUsedInAutocomplete',
  },
} as const

test('Page => Settings > Searchable and Filterable attributes', async ({
  page,
}) => {
  await login(page)
  await navigateTo(page, 'Settings', '/admin/settings/scope/catalogs')

  const tab = page.getByRole('tablist')
  const tab1 = tab.locator('#simple-tab-1')
  await expect(tab).toBeVisible()
  await tab1.click()
  await expect(page).toHaveURL('/admin/settings/attributes')

  const grid = new Grid(page, 'SourceFieldTable')
  await grid.expectHeadersToBe([
    GridLabelsAndFilters.code.gridLabel,
    GridLabelsAndFilters.defaultLabel.gridLabel,
    GridLabelsAndFilters.type.gridLabel,
    GridLabelsAndFilters.isFilterable.gridLabel,
    GridLabelsAndFilters.isSearchable.gridLabel,
    GridLabelsAndFilters.isSortable.gridLabel,
    GridLabelsAndFilters.isUsedForRules.gridLabel,
    GridLabelsAndFilters.isUsedInAutocomplete.gridLabel,
  ])

  const entityDropdown = new Dropdown(page, 'entity')
  await entityDropdown.expectToHaveValue('Product')

  await grid.pagination.expectToHaveRowsPerPage(50)
  await grid.pagination.changeRowsPerPage(10)
  const nextPage = await grid.pagination.goToNextPage()
  await expect(nextPage).toBe(true)
  await grid.pagination.expectToHaveOptions(['10', '25', '50'])

  const filter = new Filter(page, 'SourceFieldFilter', {
    [GridLabelsAndFilters.code.filterTestId]: FilterType.TEXT,
    [GridLabelsAndFilters.defaultLabel.filterTestId]: FilterType.TEXT,
    [GridLabelsAndFilters.type.filterTestId]: FilterType.DROPDOWN,
    [GridLabelsAndFilters.isFilterable.filterTestId]: FilterType.BOOLEAN,
    [GridLabelsAndFilters.isSearchable.filterTestId]: FilterType.BOOLEAN,
    [GridLabelsAndFilters.isSortable.filterTestId]: FilterType.BOOLEAN,
    [GridLabelsAndFilters.isUsedForRules.filterTestId]: FilterType.BOOLEAN,
    [GridLabelsAndFilters.isUsedInAutocomplete.filterTestId]:
      FilterType.BOOLEAN,
  })

  await filter.addFilter(GridLabelsAndFilters.code.filterTestId, 'sku')
  await filter.addFilter(GridLabelsAndFilters.defaultLabel.filterTestId, 'Sku')
  await filter.addFilter(GridLabelsAndFilters.type.filterTestId, [
    'Text',
    'Price',
  ])
  await filter.addFilter(GridLabelsAndFilters.isFilterable.filterTestId, true)
  await filter.addFilter(GridLabelsAndFilters.isSearchable.filterTestId, true)
  await filter.addFilter(GridLabelsAndFilters.isSortable.filterTestId, true)
  await filter.addFilter(GridLabelsAndFilters.isUsedForRules.filterTestId, true)
  await filter.addFilter(
    GridLabelsAndFilters.isUsedInAutocomplete.filterTestId,
    true
  )

  await expect(await filter.getActiveFiltersCount()).toBe(9)

  await filter.removeFilter(GridLabelsAndFilters.code.filterTestId, 'sku')
  await filter.removeFilter(
    GridLabelsAndFilters.defaultLabel.filterTestId,
    'Sku'
  )
  await filter.removeFilter(GridLabelsAndFilters.type.filterTestId, 'Text')
  await filter.removeFilter(GridLabelsAndFilters.type.filterTestId, 'Price')
  await filter.removeFilter(
    GridLabelsAndFilters.isFilterable.filterTestId,
    true
  )
  await filter.removeFilter(
    GridLabelsAndFilters.isSearchable.filterTestId,
    true
  )
  await filter.removeFilter(GridLabelsAndFilters.isSortable.filterTestId, true)
  await filter.removeFilter(
    GridLabelsAndFilters.isUsedForRules.filterTestId,
    true
  )
  await filter.removeFilter(
    GridLabelsAndFilters.isUsedInAutocomplete.filterTestId,
    true
  )

  await filter.addFilter(GridLabelsAndFilters.code.filterTestId, 'sku')
  await filter.addFilter(GridLabelsAndFilters.defaultLabel.filterTestId, 'Sku')

  await grid.pagination.expectToHaveCount(2)
  await grid.expectToFindLineWhere([
    { columnName: GridLabelsAndFilters.code.gridLabel, value: 'sku' },
  ])

  await filter.clearFilters()

  await grid.pagination.expectNotToHaveCount(2)

  await filter.searchTerm('Category')
  await grid.pagination.expectToHaveCount(2)
  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.defaultLabel.gridLabel,
      value: 'Category',
    },
  ])

  await filter.clearFilters()
  await grid.pagination.expectNotToHaveCount(2)

  await filter.searchTerm('manufacturer')
  await grid.pagination.expectToHaveCount(1)
  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.code.gridLabel,
      value: 'manufacturer',
    },
  ])

  // Edit Fields
  const sourceFieldTableLocator = page.getByTestId('SourceFieldTable')
  const isFilterableSwitch = new Switch(
    page,
    'isFilterable',
    sourceFieldTableLocator
  )

  await isFilterableSwitch.toggle()

  const isSearchableSwitch = new Switch(
    page,
    'isSearchable',
    sourceFieldTableLocator
  )
  await isSearchableSwitch.toggle()

  const isSortableSwitch = new Switch(
    page,
    'isSortable',
    sourceFieldTableLocator
  )
  await isSortableSwitch.toggle()

  const isUsedForRulesSwitch = new Switch(
    page,
    'isUsedForRules',
    sourceFieldTableLocator
  )
  await isUsedForRulesSwitch.toggle()

  const isUsedInAutocompleteSwitch = new Switch(
    page,
    'isUsedInAutocomplete',
    sourceFieldTableLocator
  )
  await isUsedInAutocompleteSwitch.toggle()

  // Reset edited fields
  await isFilterableSwitch.toggle()
  await isSearchableSwitch.toggle()
  await isSortableSwitch.toggle()
  await isUsedForRulesSwitch.toggle()
  await isUsedInAutocompleteSwitch.toggle()
})
