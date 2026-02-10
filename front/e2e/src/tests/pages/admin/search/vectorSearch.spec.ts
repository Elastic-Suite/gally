import {test, expect} from '@playwright/test'
import {Grid} from '../../../../helper/grid'
import {Filter, FilterType} from '../../../../helper/filter'
import {Dropdown} from '../../../../helper/dropdown'
import {login} from '../../../../utils/auth'
import {navigateTo} from '../../../../utils/menu'
import {Switch} from '../../../../helper/switch'
import {generateTestId, TestId} from "../../../../utils/testIds";

const resourceName = "VectorConfiguration"

const testIds = {
  grid: {
    testId: generateTestId(TestId.TABLE, resourceName),
    editableFields: {
      isVectorisable: 'isVectorisable',
      position: generateTestId(TestId.INPUT_TEXT, TestId.INPUT_INTEGER, 'position'),
      prompt: generateTestId(TestId.INPUT_TEXT, 'prompt')
    }
  },
  filter: {
    isVectorisable: 'isVectorisable'
  }
} as const

const texts = {
  labelMenuPage: 'Vector search',
  gridHeaders: {
    defaultLabel: 'Attribute label',
    isVectorisable: 'Vectorisable',
    position: 'Position',
    prompt: 'Prompt'
  },
  filtersToApply: {
    isVectorisable: true,
    defaultLabel: 'Product Name',
  },
  paginationOptions: ['10', '25', '50']
} as const

test('Pages > Search > Vector Search', {tag: ['@premium']}, async ({page}) => {
  await test.step('Login and navigate to vector search page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, '/admin/search/vector')
  })

  const grid = new Grid(page, resourceName)
  const filter = new Filter(page, resourceName, {
    [testIds.filter.isVectorisable]: FilterType.BOOLEAN,
  })
  const entityDropdown = new Dropdown(page, 'entity')
  await entityDropdown.expectToHaveValue('Product')

  await test.step('Verify grid headers and pagination', async () => {
    await grid.expectHeadersAndPaginationToBe(
      Object.values(texts.gridHeaders),
      ['10', '25', '50'],
      25
    )
    await grid.pagination.changeRowsPerPage(10)
    const nextPage = await grid.pagination.goToNextPage()
    await expect(nextPage).toBe(true)
  })

  const defaultRowCount = await grid.pagination.getCountNumber()

  await test.step('Add some filters and remove them', async () => {
    const applicableFilters = {
      [testIds.filter.isVectorisable]: texts.filtersToApply.isVectorisable,
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
        {[testIds.filter.isVectorisable]: texts.filtersToApply.isVectorisable},
        [{columnName: texts.gridHeaders.defaultLabel, value: texts.filtersToApply.defaultLabel}]
      )
    })

    await test.step('Clear filter', async () => {
      await grid.expectAllFiltersRemoved(filter, defaultRowCount)
    })

    const term = 'Announcement Date'
    await test.step(`Search in the grid '${term}'`, async () => {
      await grid.expectRowsAfterSearchToBe(
        filter,
        term,
        [{columnName: texts.gridHeaders.defaultLabel, value: term}]
      )
    })
  })



  await test.step('Verify that fields in the grid are editable', async () => {
    const vectorConfigurationTableLocator = page.getByTestId(
      testIds.grid.testId
    )
    const isVectorisableSwitch = new Switch(
      page,
      testIds.grid.editableFields.isVectorisable,
      vectorConfigurationTableLocator
    )

    await isVectorisableSwitch.toggle()

    const positionInput = vectorConfigurationTableLocator
      .getByTestId(testIds.grid.editableFields.position)
    const positionDefaultValue = Number(await positionInput.inputValue())
    await positionInput.fill((positionDefaultValue + 1).toString())
    await expect(positionInput).toHaveValue(
      (positionDefaultValue + 1).toString()
    )

    const promptInput = await vectorConfigurationTableLocator
      .getByTestId(testIds.grid.editableFields.prompt)
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
})
