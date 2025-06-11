import { test, expect } from '@playwright/test'
import { Grid } from '../../../helper/grid'
import { Filter, FilterType } from '../../../helper/filter'
import { Dropdown } from '../../../helper/dropdown'
import { login } from '../../../helper/auth'
import { navigateTo } from '../../../helper/menu'

const GridLabelsAndFilters = {
  defaultLabel: { gridLabel: 'Libellé attribut' },
  isVectorisable: { gridLabel: 'Vectorisable', filterTestId: 'isVectorisable' },
  position: { gridLabel: 'Position' },
  prompt: { gridLabel: 'Prompt' },
} as const

test('Page => Vector Search', async ({ page }) => {
  await login(page)
  await navigateTo(page, 'Recherche vectorielle', '/fr/admin/search/vector')

  const grid = new Grid(page, 'VectorConfigurationTable')
  await grid.expectHeadersToBe([
    GridLabelsAndFilters.defaultLabel.gridLabel,
    GridLabelsAndFilters.isVectorisable.gridLabel,
    GridLabelsAndFilters.position.gridLabel,
    GridLabelsAndFilters.prompt.gridLabel,
  ])

  const entityDropdown = new Dropdown(page, 'entity')
  await entityDropdown.expectToHaveValue('Product')

  await grid.pagination.expectRowsPerPageToBe(25)
  await grid.pagination.changeRowsPerPage(10)
  const nextPage = await grid.pagination.goToNextPage()
  await expect(nextPage).toBe(true)
  await grid.pagination.expectOptionsToBe(['10', '25', '50'])

  const defaultRowCount = await grid.pagination.getCount()

  const filter = new Filter(page, 'VectorConfigurationFilter', {
    [GridLabelsAndFilters.isVectorisable.filterTestId]: FilterType.BOOLEAN,
  })

  await filter.addFilter(GridLabelsAndFilters.isVectorisable.filterTestId, true)
  await filter.expectFiltersCountToBe(1)
  await grid.pagination.expectCountToBe(1)
  await grid.expectToFindLineWhere(
    GridLabelsAndFilters.defaultLabel.gridLabel,
    'Product Name'
  )

  await filter.removeFilter(
    GridLabelsAndFilters.isVectorisable.filterTestId,
    true
  )
  await filter.expectFiltersCountToBe(0)
  await filter.addFilter(GridLabelsAndFilters.isVectorisable.filterTestId, true)
  await filter.expectFiltersCountToBe(1)

  await filter.clearFilters()
  await filter.expectFiltersCountToBe(0)

  await grid.pagination.expectCountToBe(defaultRowCount)

  await filter.searchTerm('Announcement Date')
  await grid.pagination.expectCountToBe(1)
  await grid.expectToFindLineWhere(
    GridLabelsAndFilters.defaultLabel.gridLabel,
    'Announcement Date'
  )

  // Verify that fields are editable.

  const isVectorisableSwitch = await page
    .getByTestId('VectorConfigurationTable')
    .getByTestId('isVectorisable')
    .locator('input')

  const isVectorisableSwitchValue = await isVectorisableSwitch.isChecked()
  await expect(isVectorisableSwitch).toBeChecked({
    checked: isVectorisableSwitchValue,
  })
  await isVectorisableSwitch.click()
  await expect(isVectorisableSwitch).toBeChecked({
    checked: !isVectorisableSwitchValue,
  })

  const positionInput = await page
    .getByTestId('VectorConfigurationTable')
    .getByTestId('position')
  const positionDefaultValue = Number(await positionInput.inputValue())
  await positionInput.fill((positionDefaultValue + 1).toString())
  await expect(positionInput).toHaveValue((positionDefaultValue + 1).toString())

  const promptInput = await page
    .getByTestId('VectorConfigurationTable')
    .getByTestId('prompt')
  const promptDefaultValue = await promptInput.inputValue()
  await promptInput.fill('Test %s')
  await expect(promptInput).toHaveValue('Test %s')

  // Reset fields.

  await isVectorisableSwitch.click()
  await expect(isVectorisableSwitch).toBeChecked({
    checked: isVectorisableSwitchValue,
  })

  await positionInput.fill(positionDefaultValue.toString())
  await expect(positionInput).toHaveValue(positionDefaultValue.toString())

  await promptInput.fill(promptDefaultValue)
  await expect(promptInput).toHaveValue(promptDefaultValue)

  await filter.clearFilters()
  await grid.pagination.expectCountToBe(defaultRowCount)
})
