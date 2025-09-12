import {expect, test} from '@playwright/test'
import {Grid} from '../../../../helper/grid'
import {Filter, FilterType} from '../../../../helper/filter'
import {Dropdown} from '../../../../helper/dropdown'
import {login} from '../../../../helper/auth'
import {navigateTo} from '../../../../helper/menu'
import {Switch} from '../../../../helper/switch'
import {TestId, generateTestId} from '../../../../helper/testIds'
import {Tabs} from "../../../../helper/tabs";

const GridLabelsAndFilters = {
  code: {
    gridLabel: 'Attribute code',
    filterTestId: 'code',
  },
  defaultLabel: {gridLabel: 'Attribute label', filterTestId: 'defaultLabel'},
  type: {gridLabel: 'Attribute type', filterTestId: 'type[]'},
  isFilterable: {gridLabel: 'Filterable', filterTestId: 'isFilterable'},
  isSearchable: {gridLabel: 'Searchable', filterTestId: 'isSearchable'},
  isSortable: {gridLabel: 'Sortable', filterTestId: 'isSortable'},
  isUsedForRules: {
    gridLabel: 'Use in rule engine',
    filterTestId: 'isUsedForRules',
  },
  isUsedInAutocomplete: {
    gridLabel: 'Displayed in autocomplete',
    filterTestId: 'isUsedInAutocomplete',
  },
} as const

const resourceName = 'SourceField'

const testIds = {
  grid: {
    testId: generateTestId(TestId.TABLE, resourceName),
    editableFields: {
      isFilterable: 'isFilterable',
      isSearchable: 'isSearchable',
      isSortable: 'isSortable',
      isUsedForRules: 'isUsedForRules',
      isUsedInAutocomplete: 'isUsedInAutocomplete',
    }
  },
  filter: {
    code: 'code',
    defaultLabel: 'defaultLabel',
    type: 'type[]',
    isFilterable: 'isFilterable',
    isSearchable: 'isSearchable',
    isSortable: 'isSortable',
    isUsedForRules: 'isUsedForRules',
    isUsedInAutocomplete: 'isUsedInAutocomplete',
  }
}

const texts = {
  gridHeaders: {
    code: 'Attribute code',
    defaultLabel: 'Attribute label',
    type: 'Attribute type',
    isFilterable: 'Filterable',
    isSearchable: 'Searchable',
    isSortable: 'Sortable',
    isUsedForRules: 'Use in rule engine',
    isUsedInAutocomplete: 'Displayed in autocomplete',
  },
  paginationOptions: ['10', '25', '50'],
  tabs: {
    scope: 'Scope',
    searchableAndFilterableAttributes: 'Attributes',
    configurations: 'Configurations',
    searchableAndFilterableAttributes: 'Searchable and filterable attributes',
    users: 'Users',
  }
}

test('Pages > Settings > Tab > Searchable and Filterable attributes', {tag: ['@premium', '@standard']}, async ({
                                                                                                                 page,
                                                                                                               }) => {
  await test.step('Login and navigate to Searchable and Filterable attributes in the Settings page', async () => {
    await login(page)
    await navigateTo(page, 'Settings', '/admin/settings/scope/catalogs')

    const tabs = new Tabs(page)
    await tabs.expectToHaveTabs(Object.values(texts.tabs))
    await tabs.navigateTo(texts.tabs.searchableAndFilterableAttributes, '/admin/settings/attributes')
  })

  const grid = new Grid(page, resourceName)
  const filter = new Filter(page, resourceName, {
    [testIds.filter.code]: FilterType.TEXT,
    [testIds.filter.defaultLabel]: FilterType.TEXT,
    [testIds.filter.type]: FilterType.DROPDOWN,
    [testIds.filter.isFilterable]: FilterType.BOOLEAN,
    [testIds.filter.isSearchable]: FilterType.BOOLEAN,
    [testIds.filter.isSortable]: FilterType.BOOLEAN,
    [testIds.filter.isUsedForRules]: FilterType.BOOLEAN,
    [testIds.filter.isUsedInAutocomplete]: FilterType.BOOLEAN,
  })
  const entityDropdown = new Dropdown(page, 'entity')
  await entityDropdown.expectToHaveValue('Product')

  await test.step('Verify grid headers and pagination', async () => {
    await grid.expectHeadersToBe(Object.values(texts.gridHeaders))

    await grid.pagination.expectToHaveRowsPerPage(50)
    await grid.pagination.changeRowsPerPage(10)
    const nextPage = await grid.pagination.goToNextPage()
    await expect(nextPage).toBe(true)
    await grid.pagination.expectToHaveOptions(texts.paginationOptions)
  })
  await test.step('Add some filters and remove them', async () => {
    await filter.addFilter(testIds.filter.code, 'sku')
    await filter.addFilter(
      testIds.filter.defaultLabel,
      'Sku'
    )
    await filter.addFilter(testIds.filter.type, [
      'Text',
      'Price',
    ])
    await filter.addFilter(testIds.filter.isFilterable, true)
    await filter.addFilter(testIds.filter.isSearchable, true)
    await filter.addFilter(testIds.filter.isSortable, true)
    await filter.addFilter(
      testIds.filter.isUsedForRules,
      true
    )
    await filter.addFilter(
      testIds.filter.isUsedInAutocomplete,
      true
    )

    await expect(await filter.getActiveFiltersCount()).toBe(9)

    await filter.removeFilter(testIds.filter.code, 'sku')
    await filter.removeFilter(
      testIds.filter.defaultLabel,
      'Sku'
    )
    await filter.removeFilter(testIds.filter.type, 'Text')
    await filter.removeFilter(testIds.filter.type, 'Price')
    await filter.removeFilter(
      testIds.filter.isFilterable,
      true
    )
    await filter.removeFilter(
      testIds.filter.isSearchable,
      true
    )
    await filter.removeFilter(
      testIds.filter.isSortable,
      true
    )
    await filter.removeFilter(
      testIds.filter.isUsedForRules,
      true
    )
    await filter.removeFilter(
      testIds.filter.isUsedInAutocomplete,
      true
    )

    await filter.addFilter(testIds.filter.code, 'sku')
    await filter.addFilter(
      testIds.filter.defaultLabel,
      'Sku'
    )

    await grid.pagination.expectToHaveCount(2)
    await grid.expectToFindLineWhere([
      {columnName: GridLabelsAndFilters.code.gridLabel, value: 'sku'},
    ])

    await filter.clearFilters()

    await grid.pagination.expectNotToHaveCount(2)
  })

  await test.step('Search a term', async () => {
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
  })

  await filter.searchTerm('manufacturer')
  await grid.pagination.expectToHaveCount(1)
  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.code.gridLabel,
      value: 'manufacturer',
    },
  ])

  await test.step('Verify that fields in the grid are editable', async () => {
    const sourceFieldTableLocator = page.getByTestId(testIds.grid.testId)
    const isFilterableSwitch = new Switch(
      page,
      testIds.grid.editableFields.isFilterable,
      sourceFieldTableLocator
    )

    await isFilterableSwitch.toggle()

    const isSearchableSwitch = new Switch(
      page,
      testIds.grid.editableFields.isSearchable,
      sourceFieldTableLocator
    )
    await isSearchableSwitch.toggle()

    const isSortableSwitch = new Switch(
      page,
      testIds.grid.editableFields.isSortable,
      sourceFieldTableLocator
    )
    await isSortableSwitch.toggle()

    const isUsedForRulesSwitch = new Switch(
      page,
      testIds.grid.editableFields.isUsedForRules,
      sourceFieldTableLocator
    )
    await isUsedForRulesSwitch.toggle()

    const isUsedInAutocompleteSwitch = new Switch(
      page,
      testIds.grid.editableFields.isUsedInAutocomplete,
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
})
