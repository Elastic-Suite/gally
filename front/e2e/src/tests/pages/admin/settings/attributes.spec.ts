import {expect, test} from '@playwright/test'
import {Grid} from '../../../../helper/grid'
import {Filter, FilterType} from '../../../../helper/filter'
import {Dropdown} from '../../../../helper/dropdown'
import {login} from '../../../../utils/auth'
import {navigateTo} from '../../../../utils/menu'
import {Switch} from '../../../../helper/switch'
import {TestId, generateTestId} from '../../../../utils/testIds'
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
  filtersToApply: {
    code: 'sku',
    defaultLabel: 'Sku',
    type: ['Text', 'Price'],
    isFilterable: true,
    isSearchable: true,
    isSortable: true,
    isUsedForRules: true,
    isUsedInAutocomplete: true,
  },
  paginationOptions: ['10', '25', '50'],
  tabs: {
    scope: 'Scope',
    attributes: 'Attributes',
    configurations: 'Configurations',
    users: 'Users',
  }
}

test('Pages > Settings > Tab > Attributes', {tag: ['@premium', '@standard']}, async ({page}) => {
  await test.step('Login and navigate to Attributes in the Settings page', async () => {
    await login(page)
    await navigateTo(page, 'Settings', '/admin/settings/scope/catalogs')

    const tabs = new Tabs(page)
    await tabs.expectToHaveTabs(Object.values(texts.tabs))
    await tabs.navigateTo(texts.tabs.attributes, '/admin/settings/attributes')
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
    await grid.expectHeadersAndPaginationToBe(Object.values(texts.gridHeaders))
    await grid.pagination.changeRowsPerPage(10)
    const nextPage = await grid.pagination.goToNextPage()
    await expect(nextPage).toBe(true)
    await grid.pagination.expectToHaveOptions(texts.paginationOptions)
  })

  await test.step('Add some filters and remove them', async () => {
    const defaultRowCount = await grid.getCountLines()

    const applicableFilters = {
      [testIds.filter.code]: texts.filtersToApply.code,
      [testIds.filter.defaultLabel]: texts.filtersToApply.defaultLabel,
      [testIds.filter.type]: texts.filtersToApply.type,
      [testIds.filter.isFilterable]: texts.filtersToApply.isFilterable,
      [testIds.filter.isSearchable]: texts.filtersToApply.isSearchable,
      [testIds.filter.isSortable]: texts.filtersToApply.isSortable,
      [testIds.filter.isUsedForRules]: texts.filtersToApply.isUsedForRules,
      [testIds.filter.isUsedInAutocomplete]: texts.filtersToApply.isUsedInAutocomplete,
    }

    await test.step('Apply all filters available', async () => {
      await filter.addFilters(applicableFilters)
    })

    await test.step('Verify filters applied count', async () => {
      await expect(await filter.getActiveFiltersCount()).toBe(9)
    })

    await test.step('Remove applied filters one by one', async () => {
      await filter.removeFilters(applicableFilters)
    })

    await test.step('Apply a filter and compare the grid to see if it works', async () => {
      await filter.addFilter(testIds.filter.code, texts.filtersToApply.code)
      await filter.addFilter(testIds.filter.defaultLabel, texts.filtersToApply.defaultLabel)
      await grid.pagination.expectToHaveCount(2)
      await grid.expectToFindLineWhere([
        {columnName: GridLabelsAndFilters.code.gridLabel, value: 'sku'},
      ])
    })

    await test.step('Clear filter', async () => {
      await grid.expectAllFiltersRemoved(filter, defaultRowCount)
    })

    let term = 'Category'
    await test.step(`Search in the grid '${term}'`, async () => {
      await grid.expectRowsAfterSearchToBe(
        filter,
        term,
        [{columnName: GridLabelsAndFilters.defaultLabel.gridLabel, value: term}],
        2
      )
      await grid.expectAllFiltersRemoved(filter, defaultRowCount)
    })

    term = 'manufacturer'
    await test.step(`Search in the grid '${term}'`, async () => {
      await grid.expectRowsAfterSearchToBe(
        filter,
        term,
        [{columnName: GridLabelsAndFilters.code.gridLabel, value: term}]
      )
    })
  })

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
