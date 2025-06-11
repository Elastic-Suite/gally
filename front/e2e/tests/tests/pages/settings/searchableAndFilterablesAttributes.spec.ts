import { test, expect } from '@playwright/test'
import { Grid } from '../../../helper/grid'
import { Filter, FilterType } from '../../../helper/filter'
import { Dropdown } from '../../../helper/dropdown'
import { login } from '../../../helper/auth'
import { navigateTo } from '../../../helper/menu'

const GridLabelsAndFilters = {
  code: {
    gridLabel: 'Code attribut',
    filterTestId: 'code',
  },
  defaultLabel: { gridLabel: 'Libellé attribut', filterTestId: 'defaultLabel' },
  type: { gridLabel: "Type d'attribut", filterTestId: 'type[]' },
  isFilterable: { gridLabel: 'Filtrable', filterTestId: 'isFilterable' },
  isSearchable: { gridLabel: 'Recherchable', filterTestId: 'isSearchable' },
  isSortable: { gridLabel: 'Triable', filterTestId: 'isSortable' },
  isUsedForRules: {
    gridLabel: 'Utilisable dans les conditions',
    filterTestId: 'isUsedForRules',
  },
  isUsedInAutocomplete: {
    gridLabel: "Affiché dans l'autocomplete",
    filterTestId: 'isUsedInAutocomplete',
  },
} as const

test('Page => Settings > Searchable and Filterable attributes', async ({
  page,
}) => {
  await login(page)
  await navigateTo(page, 'Paramètres', '/fr/admin/settings/scope/catalogs')

  const tab = await page.getByRole('tablist')
  await expect(tab).toBeVisible()
  await (await tab.locator('#simple-tab-1')).click()
  await expect(page).toHaveURL('/fr/admin/settings/attributes')

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

  await grid.pagination.expectRowsPerPageToBe(50)
  await grid.pagination.changeRowsPerPage(10)
  const nextPage = await grid.pagination.goToNextPage()
  await expect(nextPage).toBe(true)
  await grid.pagination.expectOptionsToBe(['10', '25', '50'])

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

  await filter.expectFiltersCountToBe(0)

  await filter.addFilter(GridLabelsAndFilters.code.filterTestId, 'sku')
  await filter.addFilter(GridLabelsAndFilters.defaultLabel.filterTestId, 'Sku')

  await filter.expectFiltersCountToBe(2)

  await grid.pagination.expectCountToBe(2)
  await grid.expectToFindLineWhere(GridLabelsAndFilters.code.gridLabel, 'sku')

  await filter.clearFilters()
  await filter.expectFiltersCountToBe(0)

  await grid.pagination.expectCountToBeDifferentFrom(2)

  await filter.searchTerm('Category')
  await grid.pagination.expectCountToBe(2)
  await grid.expectToFindLineWhere(
    GridLabelsAndFilters.defaultLabel.gridLabel,
    'Category'
  )

  await filter.clearFilters()
  await grid.pagination.expectCountToBeDifferentFrom(2)

  await filter.searchTerm('manufacturer')
  await grid.pagination.expectCountToBe(1)
  await grid.expectToFindLineWhere(
    GridLabelsAndFilters.code.gridLabel,
    'manufacturer'
  )

  const isFilterableSwitch = await page
    .getByTestId('SourceFieldTable')
    .getByTestId('isFilterable')
    .locator('input')

  const isFilterableSwitchValue = await isFilterableSwitch.isChecked()
  await expect(isFilterableSwitch).toBeChecked({
    checked: isFilterableSwitchValue,
  })
  await isFilterableSwitch.click()
  await expect(isFilterableSwitch).toBeChecked({
    checked: !isFilterableSwitchValue,
  })

  const isSearchableSwitch = await page
    .getByTestId('SourceFieldTable')
    .getByTestId('isSearchable')
    .locator('input')

  const isSearchableSwitchValue = await isSearchableSwitch.isChecked()
  await expect(isSearchableSwitch).toBeChecked({
    checked: isSearchableSwitchValue,
  })
  await isSearchableSwitch.click()
  await expect(isSearchableSwitch).toBeChecked({
    checked: !isSearchableSwitchValue,
  })

  const isSortableSwitch = await page
    .getByTestId('SourceFieldTable')
    .getByTestId('isSortable')
    .locator('input')

  const isSortableSwitchValue = await isSortableSwitch.isChecked()
  await expect(isSortableSwitch).toBeChecked({
    checked: isSortableSwitchValue,
  })
  await isSortableSwitch.click()
  await expect(isSortableSwitch).toBeChecked({
    checked: !isSortableSwitchValue,
  })

  const isUsedForRulesSwitch = await page
    .getByTestId('SourceFieldTable')
    .getByTestId('isUsedForRules')
    .locator('input')

  const isUsedForRulesSwitchValue = await isUsedForRulesSwitch.isChecked()
  await expect(isUsedForRulesSwitch).toBeChecked({
    checked: isUsedForRulesSwitchValue,
  })
  await isUsedForRulesSwitch.click()
  await expect(isUsedForRulesSwitch).toBeChecked({
    checked: !isUsedForRulesSwitchValue,
  })

  const isUsedInAutocompleteSwitch = await page
    .getByTestId('SourceFieldTable')
    .getByTestId('isUsedInAutocomplete')
    .locator('input')

  const isUsedInAutocompleteSwitchValue =
    await isUsedInAutocompleteSwitch.isChecked()
  await expect(isUsedInAutocompleteSwitch).toBeChecked({
    checked: isUsedInAutocompleteSwitchValue,
  })
  await isUsedInAutocompleteSwitch.click()
  await expect(isUsedInAutocompleteSwitch).toBeChecked({
    checked: !isUsedInAutocompleteSwitchValue,
  })
})
