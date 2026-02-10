import {expect, test} from '@playwright/test'
import {randomUUID} from 'crypto'
import {login} from '../../../../../utils/auth'
import {navigateTo} from '../../../../../utils/menu'
import {Grid} from '../../../../../helper/grid'
import {Filter, FilterType} from '../../../../../helper/filter'
import {AlertMessage, AlertMessageType} from '../../../../../helper/alertMessage'
import {generateTestId, TestId} from "../../../../../utils/testIds";
import {deleteEntity, getCommonFormTestIds} from "../../../../../utils/form";

const resourceName = 'RecommenderType'

const testIds = {
  grid: generateTestId(TestId.TABLE, resourceName),
  filter: {
    name: 'name',
    code: 'code'
  },
  form: {
    ... getCommonFormTestIds(resourceName),
    name: generateTestId(TestId.INPUT_TEXT, 'name'),
    code: generateTestId(TestId.INPUT_TEXT, 'code'),
  },
  ... Grid.getCommonGridTestIds(resourceName)
} as const

const texts = {
  labelMenuPage: 'Recommender types',
  gridHeaders: {
    name: 'Name',
    code: 'Code',
    actions: 'Actions'
  },
  filtersToApply: {
    name: 'Default',
    code: 'default',
  },
} as const

const urls = {
  grid: '/admin/merchandize/recommender/recommender_type/grid',
  create: '/admin/merchandize/recommender/recommender_type/create',
  edit: /\/admin\/merchandize\/recommender\/recommender_type\/edit\?id=\d+$/
}

test('Pages > Merchandising > Recommenders > Recommender Types', {tag: ['@premium']}, async ({page}) => {
  await test.step('Login and navigate to the "Recommender Types" page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, urls.grid)
  })

  // Grid and Filters Locators:
  const grid = new Grid(page, resourceName)
  const filter = new Filter(page, resourceName, {
    [testIds.filter.name]: FilterType.TEXT,
    [testIds.filter.code]: FilterType.TEXT,
  })
  const createButton = page.getByTestId(testIds.createButton)

  // Form Locators (Edit / Create):
  const nameInput = page.getByTestId(testIds.form.name)
  const codeInput = page.getByTestId(testIds.form.code)
  const saveButton = page.getByTestId(testIds.form.submitButton)

  // Define a name for the new created Entity.
  const newName = randomUUID()
  const newNameCreation = `${newName}_created`
  const newCode = `${newName}_code`

  await test.step('Verify grid headers and pagination', async () => {
    await grid.expectHeadersToBe(Object.values(texts.gridHeaders))
  })

  await test.step('Add some filters and remove them', async () => {
    const defaultRowCount = await grid.getCountLines()
    const applicableFilters = {
      [testIds.filter.name]: texts.filtersToApply.name,
      [testIds.filter.code]: texts.filtersToApply.code,
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
        {[testIds.filter.name]: texts.filtersToApply.name},
        [{columnName: texts.gridHeaders.name, value: texts.filtersToApply.name}]
      )
    })

    await test.step('Clear filter', async () => {
      await grid.expectAllFiltersRemoved(filter, defaultRowCount)
    })
  })

  await test.step('Create recommender type', async () => {
    await createButton.click()
    await expect(page).toHaveURL(urls.create)
    await nameInput.fill(newNameCreation)
    await codeInput.fill(newCode)
    // Create the Entity
    await saveButton.click()
    await expect(page).toHaveURL(urls.grid)
  })

  await test.step('Verify the recommender type existence in the grid', async () => {
    await grid.expectRowsAfterFiltersToBe(
      filter,
      {[testIds.filter.name]: newNameCreation},
      [{columnName: texts.gridHeaders.name, value: newNameCreation}]
    )
  })

  const editLink = page.locator(`[data-testid="${testIds.grid}"] a`)

  await test.step('Edit a recommender type', async () => {
    await editLink.click()
    await expect(page).toHaveURL(urls.edit)

    await expect(nameInput).toHaveValue(newNameCreation)
    await nameInput.fill(newName)

    await saveButton.click()
    const alertMessage = new AlertMessage(page)
    await alertMessage.expectToHaveText('Updating of the recommender type with success\n', AlertMessageType.SUCCESS)

    await page.getByTestId(testIds.form.backButton).click()
    await expect(page).toHaveURL(urls.grid)

    await grid.expectRowsAfterFiltersToBe(
      filter,
      {[testIds.filter.name]: newName},
      [
        {
          columnName: texts.gridHeaders.name,
          value: newName,
        },
      ]
    )
  })

  await test.step('Delete the recommender type', async () => {
    await editLink.click()

    await deleteEntity(
      page,
      testIds.form.deleteButton,
      testIds.form.deletePopin.dialogConfirmButton,
      urls.grid
    )
    await grid.expectRowsAfterFiltersToBe(filter, {[testIds.filter.name]: newName}, [], 0)
  })
})
