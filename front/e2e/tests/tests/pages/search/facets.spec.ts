import { test, expect } from '@playwright/test'
import { Grid } from '../../../helper/grid'
import { Filter, FilterType } from '../../../helper/filter'
import { Dropdown } from '../../../helper/dropdown'
import { login } from '../../../helper/auth'
import { navigateTo } from '../../../helper/menu'

const GridLabelsAndFilters = {
  defaultLabel: { gridLabel: 'Attribute label' },
  displayMode: { gridLabel: 'Display', filterTestId: 'displayMode[]' },
  coverageRate: {
    gridLabel: 'Coverage',
    filterTestId: 'coverageRate[between]',
  },
  maxSize: { gridLabel: 'Max size', filterTestId: 'maxSize[between]' },
  sortOrder: { gridLabel: 'Sort order', filterTestId: 'sortOrder[]' },
  position: { gridLabel: 'Position', filterTestId: 'position[between]' },
} as const

test('Page => Facets', async ({ page }) => {
  await login(page)
  await navigateTo(page, 'Facets', '/admin/search/facets')

  const grid = new Grid(page, 'FacetConfigurationTable')
  await grid.expectHeadersToBe([
    GridLabelsAndFilters.defaultLabel.gridLabel,
    GridLabelsAndFilters.displayMode.gridLabel,
    GridLabelsAndFilters.coverageRate.gridLabel,
    GridLabelsAndFilters.maxSize.gridLabel,
    GridLabelsAndFilters.sortOrder.gridLabel,
    GridLabelsAndFilters.position.gridLabel,
  ])

  await grid.pagination.expectToHaveOptions(['10', '25', '50'])
  await grid.pagination.expectToHaveRowsPerPage(50)
  await grid.pagination.changeRowsPerPage(10)
  const nextPage = await grid.pagination.goToNextPage()
  await expect(nextPage).toBe(true)

  const filter = new Filter(page, 'FacetConfigurationFilter', {
    [GridLabelsAndFilters.displayMode.filterTestId]: FilterType.DROPDOWN,
    [GridLabelsAndFilters.coverageRate.filterTestId]: FilterType.RANGE,
    [GridLabelsAndFilters.maxSize.filterTestId]: FilterType.RANGE,
    [GridLabelsAndFilters.sortOrder.filterTestId]: FilterType.DROPDOWN,
    [GridLabelsAndFilters.position.filterTestId]: FilterType.RANGE,
  })

  await filter.addFilter(GridLabelsAndFilters.displayMode.filterTestId, [
    'Auto',
  ])
  await filter.addFilter(
    GridLabelsAndFilters.coverageRate.filterTestId,
    [0, 100]
  )
  await filter.addFilter(GridLabelsAndFilters.maxSize.filterTestId, [0, 10])
  await filter.addFilter(GridLabelsAndFilters.sortOrder.filterTestId, [
    'Result count',
  ])
  await filter.addFilter(GridLabelsAndFilters.position.filterTestId, [0, 10])


  await filter.removeFilter(
    GridLabelsAndFilters.displayMode.filterTestId,
    'Auto'
  )
  await filter.removeFilter(
    GridLabelsAndFilters.coverageRate.filterTestId,
    [0, 100]
  )
  await filter.removeFilter(GridLabelsAndFilters.maxSize.filterTestId, [0, 10])
  await filter.removeFilter(
    GridLabelsAndFilters.sortOrder.filterTestId,
    'Result count'
  )
  await filter.removeFilter(GridLabelsAndFilters.position.filterTestId, [0, 10])


  await filter.addFilter(GridLabelsAndFilters.displayMode.filterTestId, [
    'Auto',
  ])
  await filter.addFilter(
    GridLabelsAndFilters.coverageRate.filterTestId,
    [0, 100]
  )

  await filter.clearFilters()


  await filter.searchTerm('Manufacturer')

  await grid.pagination.expectToHaveCount(1)

  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.defaultLabel.gridLabel,
      value: 'Manufacturer',
    },
  ])

  // Verify that fields are editable.

  const displayModeDropdown = new Dropdown(page, 'displayMode')
  await displayModeDropdown.expectToHaveOptions(['Auto', 'Displayed', 'Hidden'])
  await displayModeDropdown.selectValue('Displayed')
  await displayModeDropdown.selectValue('Auto')

  const coverageRateInput = page.getByTestId('coverageRate')
  await coverageRateInput.fill('70')
  await expect(coverageRateInput).toHaveValue('70')
  await coverageRateInput.fill('90')
  await expect(coverageRateInput).toHaveValue('90')

  const maxSizeInput = page.getByTestId('maxSize')
  await maxSizeInput.fill('20')
  await expect(maxSizeInput).toHaveValue('20')
  await maxSizeInput.fill('10')
  await expect(maxSizeInput).toHaveValue('10')

  const sortOrderDropdown = new Dropdown(page, 'sortOrder')
  await sortOrderDropdown.expectToHaveOptions([
    'Result count',
    'Admin sort',
    'Name',
    'Relevance',
  ])
  await sortOrderDropdown.selectValue('Admin sort')
  await sortOrderDropdown.selectValue('Result count')

  const positionInput = page.getByTestId('position')
  await positionInput.fill('1')
  await expect(positionInput).toHaveValue('1')
  await positionInput.fill('')
  await expect(positionInput).toHaveValue('')

  const resetValuesButton = page.getByTestId('resetDefaultValuesButton')
  const customValueCountMessage = page.getByTestId('customValueCountMessage')
  await expect(customValueCountMessage).toHaveText(
    "You don't have any custom value"
  )
  await expect(resetValuesButton).toBeDisabled()
  await displayModeDropdown.selectValue('Hidden')
  await coverageRateInput.fill('70')
  await expect(coverageRateInput).toHaveValue('70')
  await maxSizeInput.fill('20')
  await expect(maxSizeInput).toHaveValue('20')
  await sortOrderDropdown.selectValue('Admin sort')
  await positionInput.fill('1')
  await expect(positionInput).toHaveValue('1')

  await expect(customValueCountMessage).toHaveText(
    'You are using 5 custom values'
  )

  await expect(resetValuesButton).not.toBeDisabled()
  await resetValuesButton.click()

  await expect(maxSizeInput).toHaveValue('10')
  await expect(coverageRateInput).toHaveValue('90')

  await expect(resetValuesButton).toBeDisabled()
  await expect(customValueCountMessage).toHaveText(
    "You don't have any custom value"
  )

  await sortOrderDropdown.selectValue('Admin sort')

  const firstCategory = page.getByTestId('categoryTitleItemTreeButton').first()
  await firstCategory.click()
  const pageTitle = page.getByTestId('pageTitle')
  await expect(pageTitle).toHaveText(await firstCategory.innerText())

  await expect(coverageRateInput).toHaveValue('90')
  await coverageRateInput.fill('70')
  await expect(coverageRateInput).toHaveValue('70')

  // await expect(customValueCountMessage).toHaveText(
  //   'Vous utilisez 1 valeur personnalisée'
  // )

  const defaultValuesButton = page.getByTestId('defaultValuesButton')
  await defaultValuesButton.click()
  await expect(pageTitle).toHaveText('Facets')
  // await expect(coverageRateInput).toHaveValue('90')
})
