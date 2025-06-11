import { test, expect } from '@playwright/test'
import { Grid } from '../../../../helper/grid'
import { Filter, FilterType } from '../../../../helper/filter'
import { Dropdown } from '../../../../helper/dropdown'
import { login } from '../../../../helper/auth'
import { navigateTo } from '../../../../helper/menu'

const GridLabelsAndFilters = {
  code: {
    gridLabel: 'Code attribut',
    filterTestId: 'code',
  },
  defaultLabel: { gridLabel: 'Libellé attribut', filterTestId: 'defaultLabel' },
  weight: { gridLabel: 'Poids dans la recherche', filterTestId: 'weight[]' },
  isSpellchecked: {
    gridLabel: 'Utilisé dans le correcteur',
    filterTestId: 'isSpellchecked',
  },
  isSpannable: {
    gridLabel: 'Recherchable par proximité',
    filterTestId: 'isSpannable',
  },
  defaultSearchAnalyzer: {
    gridLabel: 'Analyseur',
    filterTestId: 'defaultSearchAnalyzer[]',
  },
} as const

test('Search Configuration attributes', async ({ page }) => {
  await login(page)
  await navigateTo(
    page,
    'Attributs',
    '/fr/admin/search/configuration/attributes'
  )

  const grid = new Grid(page, 'SourceFieldTable')
  await grid.expectHeadersToBe([
    GridLabelsAndFilters.code.gridLabel,
    GridLabelsAndFilters.defaultLabel.gridLabel,
    GridLabelsAndFilters.weight.gridLabel,
    GridLabelsAndFilters.isSpellchecked.gridLabel,
    GridLabelsAndFilters.isSpannable.gridLabel,
    GridLabelsAndFilters.defaultSearchAnalyzer.gridLabel,
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
    [GridLabelsAndFilters.weight.filterTestId]: FilterType.DROPDOWN,
    [GridLabelsAndFilters.isSpellchecked.filterTestId]: FilterType.BOOLEAN,
    [GridLabelsAndFilters.isSpannable.filterTestId]: FilterType.BOOLEAN,
    [GridLabelsAndFilters.defaultSearchAnalyzer.filterTestId]:
      FilterType.DROPDOWN,
  })

  await filter.addFilter(GridLabelsAndFilters.code.filterTestId, 'sku')
  await filter.addFilter(GridLabelsAndFilters.defaultLabel.filterTestId, 'Sku')
  await filter.addFilter(GridLabelsAndFilters.isSpellchecked.filterTestId, true)
  await filter.addFilter(GridLabelsAndFilters.isSpannable.filterTestId, true)
  await filter.addFilter(GridLabelsAndFilters.weight.filterTestId, ['10'])
  await filter.addFilter(
    GridLabelsAndFilters.defaultSearchAnalyzer.filterTestId,
    ['standard', 'reference']
  )

  await filter.expectFiltersCountToBe(7)

  await filter.removeFilter(GridLabelsAndFilters.code.filterTestId, 'sku')
  await filter.removeFilter(
    GridLabelsAndFilters.defaultLabel.filterTestId,
    'Sku'
  )
  await filter.removeFilter(
    GridLabelsAndFilters.isSpellchecked.filterTestId,
    true
  )
  await filter.removeFilter(GridLabelsAndFilters.isSpannable.filterTestId, true)
  await filter.removeFilter(GridLabelsAndFilters.weight.filterTestId, '10')
  await filter.removeFilter(
    GridLabelsAndFilters.defaultSearchAnalyzer.filterTestId,
    'standard'
  )
  await filter.removeFilter(
    GridLabelsAndFilters.defaultSearchAnalyzer.filterTestId,
    'reference'
  )

  await filter.expectFiltersCountToBe(0)

  await filter.addFilter(GridLabelsAndFilters.code.filterTestId, 'sku')
  await filter.addFilter(GridLabelsAndFilters.defaultLabel.filterTestId, 'Sku')

  await filter.expectFiltersCountToBe(2)

  await grid.pagination.expectCountToBe(1)
  await grid.expectToFindLineWhere(GridLabelsAndFilters.code.gridLabel, 'sku')

  await filter.clearFilters()
  await filter.expectFiltersCountToBe(0)

  await grid.pagination.expectCountToBeDifferentFrom(1)

  await filter.searchTerm('sku')
  await grid.pagination.expectCountToBe(1)
  await grid.expectToFindLineWhere(GridLabelsAndFilters.code.gridLabel, 'sku')

  await filter.clearFilters()
  await grid.pagination.expectCountToBeDifferentFrom(1)

  await filter.searchTerm('Category')
  await grid.pagination.expectCountToBe(1)
  await grid.expectToFindLineWhere(
    GridLabelsAndFilters.defaultLabel.gridLabel,
    'Category'
  )

  const weightDropdown = new Dropdown(page, 'weight')
  await weightDropdown.selectValue('10')

  const isSpellcheckedSwitch = await page
    .getByTestId('SourceFieldTable')
    .getByTestId('isSpellchecked')
    .locator('input')

  const isSpellcheckedSwitchValue = await isSpellcheckedSwitch.isChecked()
  await expect(isSpellcheckedSwitch).toBeChecked({
    checked: isSpellcheckedSwitchValue,
  })

  await isSpellcheckedSwitch.click()
  await expect(isSpellcheckedSwitch).toBeChecked({
    checked: !isSpellcheckedSwitchValue,
  })

  const isSpannableSwitch = await page
    .getByTestId('SourceFieldTable')
    .getByTestId('isSpannable')
    .locator('input')

  const isSpannableSwitchValue = await isSpannableSwitch.isChecked()

  await expect(isSpannableSwitch).toBeChecked({
    checked: isSpannableSwitchValue,
  })

  await isSpannableSwitch.click()
  await expect(isSpannableSwitch).toBeChecked({
    checked: !isSpannableSwitchValue,
  })

  const defaultSearchAnalyzerDropdown = new Dropdown(
    page,
    'defaultSearchAnalyzer'
  )
  await defaultSearchAnalyzerDropdown.selectValue('reference')
})
