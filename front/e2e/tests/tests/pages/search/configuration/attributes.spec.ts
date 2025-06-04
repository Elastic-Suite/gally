import { test, expect } from '@playwright/test'
import { Grid } from '../../../../helper/grid'
import { Filter, FilterType } from '../../../../helper/filter'
import { Dropdown } from '../../../../helper/dropdown'
import { login } from '../../../../helper/auth'
import { navigateTo } from '../../../../helper/menu'
import { Switch } from '../../../../helper/switch'

const GridLabelsAndFilters = {
  code: {
    gridLabel: 'Attribute code',
    filterTestId: 'code',
  },
  defaultLabel: { gridLabel: 'Attribute label', filterTestId: 'defaultLabel' },
  weight: { gridLabel: 'Search weight', filterTestId: 'weight[]' },
  isSpellchecked: {
    gridLabel: 'Used in spellcheck',
    filterTestId: 'isSpellchecked',
  },
  isSpannable: {
    gridLabel: 'Use for span queries',
    filterTestId: 'isSpannable',
  },
  defaultSearchAnalyzer: {
    gridLabel: 'Analyzer',
    filterTestId: 'defaultSearchAnalyzer[]',
  },
} as const

test('Search Configuration attributes', async ({ page }) => {
  await login(page)
  await navigateTo(page, 'Attributes', '/admin/search/configuration/attributes')

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

  await grid.pagination.expectToHaveOptions(['10', '25', '50'])
  await grid.pagination.expectToHaveRowsPerPage(50)
  await grid.pagination.changeRowsPerPage(10)
  const nextPage = await grid.pagination.goToNextPage()
  await expect(nextPage).toBe(true)

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


  await filter.addFilter(GridLabelsAndFilters.code.filterTestId, 'sku')
  await filter.addFilter(GridLabelsAndFilters.defaultLabel.filterTestId, 'Sku')


  await grid.pagination.expectToHaveCount(1)
  await grid.expectToFindLineWhere([
    { columnName: GridLabelsAndFilters.code.gridLabel, value: 'sku' },
  ])

  await filter.clearFilters()

  await grid.pagination.expectNotToHaveCount(1)

  await filter.searchTerm('sku')
  await grid.pagination.expectToHaveCount(1)
  await grid.expectToFindLineWhere([
    { columnName: GridLabelsAndFilters.code.gridLabel, value: 'sku' },
  ])

  await filter.clearFilters()
  await grid.pagination.expectNotToHaveCount(1)

  await filter.searchTerm('Category')
  await grid.pagination.expectToHaveCount(1)
  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.defaultLabel.gridLabel,
      value: 'Category',
    },
  ])

  const weightDropdown = new Dropdown(page, 'weight')
  await weightDropdown.selectValue('10')

  const sourceFieldTableLocator = page.getByTestId('SourceFieldTable')
  const isSpellcheckedSwitch = new Switch(
    page,
    'isSpellchecked',
    sourceFieldTableLocator
  )
  await isSpellcheckedSwitch.toggle()

  const isSpannableSwitch = new Switch(
    page,
    'isSpannable',
    sourceFieldTableLocator
  )
  await isSpannableSwitch.toggle()

  const defaultSearchAnalyzerDropdown = new Dropdown(
    page,
    'defaultSearchAnalyzer'
  )
  await defaultSearchAnalyzerDropdown.selectValue('reference')
})
