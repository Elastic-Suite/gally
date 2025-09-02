import {test, expect} from '@playwright/test'
import {Grid} from '../../../../../helper/grid'
import {Filter, FilterType} from '../../../../../helper/filter'
import {Dropdown} from '../../../../../helper/dropdown'
import {login} from '../../../../../helper/auth'
import {navigateTo} from '../../../../../helper/menu'
import {Switch} from '../../../../../helper/switch'
import {generateTestId, TestId} from "../../../../../helper/testIds";

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
  paginationOptions: ['10', '25', '50'],
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
    await grid.expectHeadersToBe(Object.values(texts.gridHeaders))
    await grid.pagination.expectToHaveOptions(texts.paginationOptions)
    await grid.pagination.expectToHaveRowsPerPage(50)
    await grid.pagination.changeRowsPerPage(10)
    const nextPage = await grid.pagination.goToNextPage()
    await expect(nextPage).toBe(true)
  })

  await test.step('Add some filters and remove them', async () => {
    await filter.addFilter(testIds.filter.code, texts.filtersToApply.code)
    await filter.addFilter(
      testIds.filter.defaultLabel,
      texts.filtersToApply.defaultLabel
    )
    await filter.addFilter(
      testIds.filter.isSpellchecked,
      texts.filtersToApply.isSpellchecked
    )
    await filter.addFilter(testIds.filter.isSpannable, texts.filtersToApply.isSpannable)
    await filter.addFilter(testIds.filter.weight, texts.filtersToApply.weight)
    await filter.addFilter(
      testIds.filter.defaultSearchAnalyzer,
      texts.filtersToApply.defaultSearchAnalyzer
    )

    await filter.removeFilter(testIds.filter.code, texts.filtersToApply.code)
    await filter.removeFilter(
      testIds.filter.defaultLabel,
      texts.filtersToApply.defaultLabel
    )
    await filter.removeFilter(
      testIds.filter.isSpellchecked,
      texts.filtersToApply.isSpellchecked
    )
    await filter.removeFilter(
      testIds.filter.isSpannable,
      texts.filtersToApply.isSpannable
    )
    for (let i = 0; i < texts.filtersToApply.weight.length; i++) {
      await filter.removeFilter(
        testIds.filter.weight,
        texts.filtersToApply.weight[i]
      )
    }
    for (let i = 0; i < texts.filtersToApply.defaultSearchAnalyzer.length; i++) {
      await filter.removeFilter(
        testIds.filter.defaultSearchAnalyzer,
        texts.filtersToApply.defaultSearchAnalyzer[i]
      )
    }

    await filter.addFilter(testIds.filter.code, texts.filtersToApply.code)
    await filter.addFilter(
      testIds.filter.defaultLabel,
      texts.filtersToApply.defaultLabel
    )

    await grid.pagination.expectToHaveCount(1)
    await grid.expectToFindLineWhere([
      {columnName: texts.gridHeaders.code, value: texts.filtersToApply.code},
    ])

    await filter.clearFilters()

    await grid.pagination.expectNotToHaveCount(1)

    await filter.searchTerm(texts.filtersToApply.code)
    await grid.pagination.expectToHaveCount(1)
    await grid.expectToFindLineWhere([
      {columnName: texts.gridHeaders.code, value: texts.filtersToApply.code},
    ])

    await filter.clearFilters()
    await grid.pagination.expectNotToHaveCount(1)

    await filter.searchTerm(texts.filtersToApply.searchTermCategory)
    await grid.pagination.expectToHaveCount(1)

    await grid.expectToFindLineWhere([
      {
        columnName: texts.gridHeaders.defaultLabel,
        value: texts.filtersToApply.searchTermCategory,
      },
    ])
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
