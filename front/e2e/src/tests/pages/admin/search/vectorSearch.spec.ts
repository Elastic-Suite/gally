import { test, expect } from '@playwright/test'
import { Grid } from '../../../../helper/grid'
import { Filter, FilterType } from '../../../../helper/filter'
import { Dropdown } from '../../../../helper/dropdown'
import { login } from '../../../../helper/auth'
import { navigateTo } from '../../../../helper/menu'
import { Switch } from '../../../../helper/switch'

const GridLabelsAndFilters = {
  defaultLabel: { gridLabel: 'Attribute label' },
  isVectorisable: { gridLabel: 'Vectorisable', filterTestId: 'isVectorisable' },
  position: { gridLabel: 'Position' },
  prompt: { gridLabel: 'Prompt' },
} as const

test('Page => Vector Search', async ({ page }) => {
  await login(page)
  await navigateTo(page, 'Vector search', '/admin/search/vector')

  const grid = new Grid(page, 'VectorConfigurationTable')
  await grid.expectHeadersToBe([
    GridLabelsAndFilters.defaultLabel.gridLabel,
    GridLabelsAndFilters.isVectorisable.gridLabel,
    GridLabelsAndFilters.position.gridLabel,
    GridLabelsAndFilters.prompt.gridLabel,
  ])

  const entityDropdown = new Dropdown(page, 'entity')
  await entityDropdown.expectToHaveValue('Product')

  await grid.pagination.expectToHaveOptions(['10', '25', '50'])
  await grid.pagination.expectNotToHaveCount(25)
  await grid.pagination.changeRowsPerPage(10)
  const nextPage = await grid.pagination.goToNextPage()
  await expect(nextPage).toBe(true)

  const defaultRowCount = await grid.pagination.getCountNumber()

  const filter = new Filter(page, 'VectorConfigurationFilter', {
    [GridLabelsAndFilters.isVectorisable.filterTestId]: FilterType.BOOLEAN,
  })

  await filter.addFilter(GridLabelsAndFilters.isVectorisable.filterTestId, true)
  await grid.pagination.expectToHaveCount(1)
  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.defaultLabel.gridLabel,
      value: 'Product Name',
    },
  ])

  await filter.removeFilter(
    GridLabelsAndFilters.isVectorisable.filterTestId,
    true
  )
  await filter.addFilter(GridLabelsAndFilters.isVectorisable.filterTestId, true)

  await filter.clearFilters()

  await grid.pagination.expectToHaveCount(defaultRowCount)

  await filter.searchTerm('Announcement Date')
  await grid.pagination.expectToHaveCount(1)
  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.defaultLabel.gridLabel,
      value: 'Announcement Date',
    },
  ])

  // Verify that fields are editable.

  const vectorConfigurationTableLocator = page.getByTestId(
    'VectorConfigurationTable'
  )
  const isVectorisableSwitch = new Switch(
    page,
    'isVectorisable',
    vectorConfigurationTableLocator
  )

  await isVectorisableSwitch.toggle()

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
  await isVectorisableSwitch.toggle()

  await positionInput.fill(positionDefaultValue.toString())
  await expect(positionInput).toHaveValue(positionDefaultValue.toString())

  await promptInput.fill(promptDefaultValue)
  await expect(promptInput).toHaveValue(promptDefaultValue)

  await filter.clearFilters()
  await grid.pagination.expectToHaveCount(defaultRowCount)
})
