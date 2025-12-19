import {test, expect} from '@playwright/test'
import {Grid} from '../../../../../helper/grid'
import {Filter, FilterType} from '../../../../../helper/filter'
import {Dropdown} from '../../../../../helper/dropdown'
import {login} from '../../../../../utils/auth'
import {navigateTo} from '../../../../../utils/menu'
import {Switch} from '../../../../../helper/switch'
import {generateTestId, TestId} from "../../../../../utils/testIds";

const resourceName = 'SourceField'

const testIds = {
  filter: {
    code: 'code',
    defaultLabel: 'defaultLabel',
    weight: 'weight[]',
    isSpellchecked: 'isSpellchecked',
    isSpannable: 'isSpannable',
    defaultSearchAnalyzer: 'defaultSearchAnalyzer[]',
  },
  grid: {
    testId: generateTestId(TestId.TABLE, resourceName),
    editableFields: {
      weight: 'weight',
      isSpellchecked: 'isSpellchecked',
      isSpannable: 'isSpannable',
      defaultSearchAnalyzer: 'defaultSearchAnalyzer',
    }
  }
} as const

const texts = {
  labelMenuPage: 'Attributes',
  gridHeaders: {
    code: 'Attribute code',
    defaultLabel: 'Attribute label',
    weight: 'Search weight',
    isSpellchecked: 'Used in spellcheck',
    isSpannable: 'Use for span queries',
    defaultSearchAnalyzer: 'Analyzer',
  },
  filtersToApply: {
    code: 'sku',
    weight: ['10'],
    defaultLabel: 'Sku',
    isSpellchecked: true,
    isSpannable: true,
    defaultSearchAnalyzer: ['standard', 'reference'],
    searchTermCategory: 'Category',
  }
} as const

test('Pages > Search > Configurations > Attributes', {tag: ['@premium', '@standard']}, async ({page}) => {
  await test.step('Login and navigate to the attributes page ', async () => {
    await login(page)
    await navigateTo(
      page,
      texts.labelMenuPage,
      '/admin/search/configuration/attributes'
    )
  })

  const grid = new Grid(page, resourceName)
  const filter = new Filter(page, resourceName, {
    [testIds.filter.code]: FilterType.TEXT,
    [testIds.filter.defaultLabel]: FilterType.TEXT,
    [testIds.filter.weight]: FilterType.DROPDOWN,
    [testIds.filter.isSpellchecked]: FilterType.BOOLEAN,
    [testIds.filter.isSpannable]: FilterType.BOOLEAN,
    [testIds.filter.defaultSearchAnalyzer]:
    FilterType.DROPDOWN,
  })

  const entityDropdown = new Dropdown(page, 'entity')
  await entityDropdown.expectToHaveValue('Product')

  await test.step('Verify grid headers and pagination', async () => {
    await grid.expectHeadersAndPaginationToBe(Object.values(texts.gridHeaders))
    await grid.pagination.changeRowsPerPage(10)
    const nextPage = await grid.pagination.goToNextPage()
    await expect(nextPage).toBe(true)
  })

  await test.step('Add some filters and remove them', async () => {
    const defaultRowCount = await grid.getCountLines()

    const applicableFilters = {
      [testIds.filter.code]: texts.filtersToApply.code,
      [testIds.filter.defaultLabel]: texts.filtersToApply.defaultLabel,
      [testIds.filter.isSpellchecked]: texts.filtersToApply.isSpellchecked,
      [testIds.filter.isSpannable]: texts.filtersToApply.isSpannable,
      [testIds.filter.weight]: texts.filtersToApply.weight,
      [testIds.filter.defaultSearchAnalyzer]: texts.filtersToApply.defaultSearchAnalyzer,
      [testIds.filter.weight]: texts.filtersToApply.weight,
    }

    await test.step('Apply all filters available', async () => {
      await filter.addFilters(applicableFilters)
    })

    await test.step('Remove applied filters one by one', async () => {
      await filter.removeFilters(applicableFilters)
    })

    await test.step('Apply a filter and compare the grid to see if it works', async () => {
      await grid.expectRowsAfterFiltersToBe(
        filter,
        {[testIds.filter.defaultLabel]: texts.filtersToApply.defaultLabel},
        [{columnName: texts.gridHeaders.code, value: texts.filtersToApply.code}]
      )
    })

    await test.step('Clear filter', async () => {
      await grid.expectAllFiltersRemoved(filter, defaultRowCount)
    })

    await test.step(`Search in the grid '${texts.filtersToApply.code}'`, async () => {
      await grid.expectRowsAfterSearchToBe(
        filter,
        texts.filtersToApply.code,
        [{columnName: texts.gridHeaders.code, value: texts.filtersToApply.code}]
      )
      await grid.expectAllFiltersRemoved(filter, defaultRowCount)
    })

    await test.step(`Search in the grid '${texts.filtersToApply.searchTermCategory}'`, async () => {
      await grid.expectRowsAfterSearchToBe(
        filter,
        texts.filtersToApply.searchTermCategory,
        [
          {
            columnName: texts.gridHeaders.defaultLabel,
            value: texts.filtersToApply.searchTermCategory,
          },
        ]
      )
    })
  })

  await test.step('Verify that fields in the grid are editable', async () => {
    const weightDropdown = new Dropdown(page, testIds.grid.editableFields.weight)
    await weightDropdown.selectValue('10')

    const sourceFieldTableLocator = page.getByTestId(testIds.grid.testId)
    const isSpellcheckedSwitch = new Switch(
      page,
      testIds.grid.editableFields.isSpellchecked,
      sourceFieldTableLocator
    )
    await isSpellcheckedSwitch.toggle()

    const isSpannableSwitch = new Switch(
      page,
      testIds.grid.editableFields.isSpannable,
      sourceFieldTableLocator
    )
    await isSpannableSwitch.toggle()

    const defaultSearchAnalyzerDropdown = new Dropdown(
      page,
      testIds.grid.editableFields.defaultSearchAnalyzer,
    )
    await defaultSearchAnalyzerDropdown.selectValue('reference')

    // Reset editable fields :
    await weightDropdown.selectValue('1')
    await isSpellcheckedSwitch.toggle()
    await isSpannableSwitch.toggle()
    await defaultSearchAnalyzerDropdown.selectValue('standard')
  })
})
