import {expect, test} from '@playwright/test'
import {Grid} from '../../../../helper/grid'
import {Filter, FilterType} from '../../../../helper/filter'
import {Dropdown} from '../../../../helper/dropdown'
import {login} from '../../../../utils/auth'
import {navigateTo} from '../../../../utils/menu'
import {generateTestId, TestId} from "../../../../utils/testIds"

const resourceName = 'FacetConfiguration'

const testIds = {
  filter: {
    displayMode: 'displayMode[]',
    coverageRate: 'coverageRate[between]',
    maxSize: 'maxSize[between]',
    sortOrder: 'sortOrder[]',
    position: 'position[between]',
  },
  grid: {
    testId: generateTestId(TestId.TABLE, resourceName),
    editableFields: {
      displayMode: 'displayMode',
      coverageRate: generateTestId(TestId.INPUT_TEXT, TestId.INPUT_INTEGER, 'coverageRate'),
      maxSize: generateTestId(TestId.INPUT_TEXT, TestId.INPUT_INTEGER,  'maxSize'),
      sortOrder: 'sortOrder',
      position: generateTestId(TestId.INPUT_TEXT, TestId.INPUT_INTEGER, 'position'),
    }
  },
  resetDefaultValuesButton: generateTestId(TestId.BUTTON, 'resetDefaultValues'),
  customValueCountMessage: generateTestId(TestId.RESOURCE_TABLE_NB_CUSTOM_VALUES_MESSAGE),
  categoryTitleItemTreeButton: generateTestId(TestId.TREE_ITEM_TITLE_BUTTON, 'category'),
  defaultValuesButton: generateTestId(TestId.FACETS_SETTINGS_BUTTON),
  pageTitle: generateTestId(TestId.FACETS_PAGE_TITLE),
}

const texts = {
  labelMenuPage: 'Facets',
  pageTitle: 'Facets',
  gridHeaders: {
    defaultCode: 'Attribute code',
    defaultLabel: 'Attribute label',
    displayMode: 'Display',
    coverageRate: 'Coverage',
    maxSize: 'Max size',
    sortOrder: 'Sort order',
    facetInternalLogic: "Facet internal logic",
    position: 'Position',
  },
  filtersToApply: {
    displayMode: ['Auto'],
    coverageRate: [0, 100],
    maxSize: [0, 10],
    sortOrder: ['Result count'],
    position: [0, 10],
    searchedTerm: 'Manufacturer'
  },
  displayModeOptions: [
    'Auto',
    'Displayed',
    'Hidden',
  ],
  sortOrderOptions: [
    'Result count',
    'Admin sort',
    'Name (A → Z)',
    'Name (Z → A)',
    'Natural sort (A → Z)',
    'Natural sort (Z → A)',
  ],
  noCustomValuesMessage: "You don't have any custom value",
  customValuesMessage: (nb: number) => `You are using ${nb} custom value${nb > 1 ? 's' : ''}`
} as const


const baseURL = process.env.SERVER_BASE_URL || 'https://gally.local'

test('Pages > Search > Facets', {tag: ['@premium', '@standard']}, async ({page}) => {
  async function waitForUpdateResponse(): Promise<void> {
    await page.waitForResponse(response => {
      return response.url().includes(`${baseURL}/api/facet_configurations`) && response.ok()
    }, {timeout: 5000})
  }

  await test.step('Login and navigate to the facets page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, '/admin/search/facets')
  })

  const grid = new Grid(page, resourceName)
  const filter = new Filter(page, resourceName, {
    [testIds.filter.displayMode]: FilterType.DROPDOWN,
    [testIds.filter.coverageRate]: FilterType.RANGE,
    [testIds.filter.maxSize]: FilterType.RANGE,
    [testIds.filter.sortOrder]: FilterType.DROPDOWN,
    [testIds.filter.position]: FilterType.RANGE,
  })

  await test.step('Verify grid headers and pagination', async () => {
    await grid.expectHeadersAndPaginationToBe(Object.values(texts.gridHeaders))
    await grid.pagination.changeRowsPerPage(10)
    const nextPage = await grid.pagination.goToNextPage()
    await expect(nextPage).toBe(true)
  })

  await test.step('Add some filters and remove them', async () => {
    const applicableFilters = {
      [testIds.filter.displayMode]: texts.filtersToApply.displayMode,
      [testIds.filter.coverageRate]: texts.filtersToApply.coverageRate,
      [testIds.filter.maxSize]: texts.filtersToApply.maxSize,
      [testIds.filter.sortOrder]: texts.filtersToApply.sortOrder,
      [testIds.filter.position]: texts.filtersToApply.position,
    }

    await test.step('Apply all filters available', async () => {
      await filter.addFilters(applicableFilters)
    })

    await test.step('Remove applied filters one by one', async () => {
      await filter.removeFilters(applicableFilters)
    })

    const term = texts.filtersToApply.searchedTerm
    await test.step(`Search in the grid '${term}'`, async () => {
      await grid.expectRowsAfterSearchToBe(
        filter,
        term,
        [{columnName: texts.gridHeaders.defaultLabel, value: term}]
      )
    })
  })

  // Verify that fields are editable.

  await test.step('Verify that fields in the grid are editable', async () => {
    const displayModeDropdown = new Dropdown(page, testIds.grid.editableFields.displayMode)
    await displayModeDropdown.expectToHaveOptions(texts.displayModeOptions)
    await displayModeDropdown.selectValue(texts.displayModeOptions[1])
    await displayModeDropdown.selectValue(texts.displayModeOptions[0])

    const coverageRateInput = page.getByTestId(testIds.grid.editableFields.coverageRate)
    await coverageRateInput.fill('70')
    await expect(coverageRateInput).toHaveValue('70')
    await coverageRateInput.fill('90')
    await expect(coverageRateInput).toHaveValue('90')

    const maxSizeInput = page.getByTestId(testIds.grid.editableFields.maxSize)
    await maxSizeInput.fill('20')
    await expect(maxSizeInput).toHaveValue('20')
    await maxSizeInput.fill('10')
    await expect(maxSizeInput).toHaveValue('10')

    const sortOrderDropdown = new Dropdown(page, testIds.grid.editableFields.sortOrder)
    await sortOrderDropdown.expectToHaveOptions(texts.sortOrderOptions)
    await sortOrderDropdown.selectValue(texts.sortOrderOptions[1])
    await sortOrderDropdown.selectValue(texts.sortOrderOptions[0])

    const positionInput = page.getByTestId(testIds.grid.editableFields.position)
    await positionInput.fill('1')
    await expect(positionInput).toHaveValue('1')
    await positionInput.fill('')
    await expect(positionInput).toHaveValue('')

    const resetValuesButton = page.getByTestId(testIds.resetDefaultValuesButton)
    const customValueCountMessage = page.getByTestId(testIds.customValueCountMessage)
    await expect(customValueCountMessage).toHaveText(
      texts.noCustomValuesMessage
    )
    await expect(resetValuesButton).toBeDisabled()
    await displayModeDropdown.selectValue(texts.displayModeOptions[2])
    await waitForUpdateResponse()
    await coverageRateInput.fill('70')
    await waitForUpdateResponse()
    await expect(coverageRateInput).toHaveValue('70')
    await maxSizeInput.fill('20')
    await waitForUpdateResponse()
    await expect(maxSizeInput).toHaveValue('20')
    await sortOrderDropdown.selectValue(texts.sortOrderOptions[1])
    await waitForUpdateResponse()
    await positionInput.fill('1')
    await waitForUpdateResponse()
    await expect(positionInput).toHaveValue('1')

    await expect(customValueCountMessage).toHaveText(
      texts.customValuesMessage(5)
    )

    await expect(resetValuesButton).not.toBeDisabled()
    await resetValuesButton.click()

    await expect(maxSizeInput).toHaveValue('10')
    await expect(coverageRateInput).toHaveValue('90')

    await expect(resetValuesButton).toBeDisabled()
    await expect(customValueCountMessage).toHaveText(
      texts.noCustomValuesMessage
    )

    await sortOrderDropdown.selectValue(texts.sortOrderOptions[1])

    await expect(customValueCountMessage).toHaveText(
      texts.customValuesMessage(1)
    )

    const firstCategory = page
      .getByTestId(testIds.categoryTitleItemTreeButton)
      .first()
    await firstCategory.click()
    const pageTitle = page.getByTestId(testIds.pageTitle)
    await expect(pageTitle).toHaveText(await firstCategory.innerText())

    await expect(customValueCountMessage).toHaveText(
      texts.noCustomValuesMessage
    )

    await sortOrderDropdown.expectToHaveValue(texts.sortOrderOptions[1])

    await expect(coverageRateInput).toHaveValue('90')
    await coverageRateInput.fill('70')
    await waitForUpdateResponse()
    await expect(coverageRateInput).toHaveValue('70')
    await sortOrderDropdown.selectValue(texts.sortOrderOptions[0])
    await waitForUpdateResponse()

    await expect(customValueCountMessage).toHaveText(
      texts.customValuesMessage(2)
    )

    const defaultValuesButton = page.getByTestId(testIds.defaultValuesButton)
    await defaultValuesButton.click()
    await expect(pageTitle).toHaveText(texts.pageTitle)

    await expect(coverageRateInput).toHaveValue('90')
    await sortOrderDropdown.expectToHaveValue(texts.sortOrderOptions[1])

    await expect(customValueCountMessage).toHaveText(
      texts.customValuesMessage(1)
    )
  })
})
