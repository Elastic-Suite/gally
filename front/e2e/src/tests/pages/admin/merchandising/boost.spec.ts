import {expect, test} from '@playwright/test'
import {randomUUID} from 'crypto'
import {login} from '../../../../utils/auth'
import {navigateTo} from '../../../../utils/menu'
import {Dropdown} from '../../../../helper/dropdown'
import {Switch} from '../../../../helper/switch'
import {Grid} from '../../../../helper/grid'
import {Filter, FilterType} from '../../../../helper/filter'
import {AlertMessage, AlertMessageType} from '../../../../helper/alertMessage'
import {generateTestId, TestId} from "../../../../utils/testIds";
import {deleteEntity, getCommonFormTestIds} from "../../../../utils/form";

const resourceName = 'Boost'

const testIds = {
  grid: generateTestId(TestId.TABLE, resourceName),
  filter: {
    name: 'name',
    model: 'model[]',
    requestType: 'requestTypes.requestType[]',
    isActive: 'isActive',
    localizedCatalogs: 'localizedCatalogs.id[]',
  },
  form: {
    ... getCommonFormTestIds(resourceName),
    localizedCatalogs: 'localizedCatalogs',
    isActive: 'isActive',
    name: generateTestId(TestId.INPUT_TEXT, 'name'),
    requestType: 'requestTypes',
    model: 'model',
    previewFieldSet: generateTestId(TestId.FIELD_SET, 'preview'),
    previewRequiredMessage: generateTestId(TestId.PREVIEW_REQUIRED_MESSAGE)
  },
  ... Grid.getCommonGridTestIds(resourceName)
} as const

const texts = {
  labelMenuPage: 'Boosts',
  gridHeaders: {
    name: 'Name',
    model: 'Model',
    requestType: 'Request type',
    isActive: 'Enable',
    localizedCatalogs: 'Localized catalog(s)',
    actions: 'Actions'
  },
  filtersToApply: {
    name: 'Boost "Tank dress"',
    model: [
      'Constant score',
      'Proportional to an attribute value',
    ],
    requestType: [
      'Category listing',
    ],
    isActive: true,
    localizedCatalogs: ['COM French Catalog']
  },
  createValues: {
    localizedCatalogs: [
      'COM French Catalog',
      'COM English Catalog',
      'FR French Catalog',
      'EN French Catalog',
    ],
    requestType: [
      'Category listing',
      'Search result',
    ],
    model: 'Constant score'
  },
  editValues: {
    localizedCatalogs: ['COM French Catalog'],
    editedLocalizedCatalogDisplay: 'COM Catalog - COM French Catalog',
  },
} as const

const urls = {
  grid: '/admin/merchandize/boost/grid',
  create: '/admin/merchandize/boost/create',
  edit: /\/admin\/merchandize\/boost\/edit\?id=\d+$/
}

test('Pages > Merchandising > Boosts', {tag: ['@premium']}, async ({page}) => {
  await test.step('Login and navigate to the Boosts page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, urls.grid)
  })

  // Grid and Filters Locators:
  const grid = new Grid(page, resourceName)
  const filter = new Filter(page, resourceName, {
    [testIds.filter.name]: FilterType.TEXT,
    [testIds.filter.model]: FilterType.DROPDOWN,
    [testIds.filter.requestType]: FilterType.DROPDOWN,
    [testIds.filter.isActive]: FilterType.BOOLEAN,
    [testIds.filter.localizedCatalogs]: FilterType.DROPDOWN,
  })
  const createButton = page.getByTestId(testIds.createButton)

  // Form Locators (Edit / Create):
  const localizedCatalogs = new Dropdown(page, testIds.form.localizedCatalogs, true)
  const isActiveSwitch = new Switch(page, testIds.form.isActive)
  const previewFieldSet = page.getByTestId(testIds.form.previewFieldSet)
  const nameInput = page.getByTestId(testIds.form.name)
  const requestTypesDropdown = new Dropdown(page, testIds.form.requestType, true)
  const modelDropdown = new Dropdown(page, testIds.form.model)
  const saveButton = page.getByTestId(testIds.form.submitButton)

  // Define a name for the new created Entity.
  const newName = randomUUID()

  await test.step('Verify grid headers and pagination', async () => {
    await grid.expectHeadersAndPaginationToBe(Object.values(texts.gridHeaders))
  })

  await test.step('Add some filters and remove them', async () => {
    const defaultRowCount = await grid.getCountLines()
    const applicableFilters = {
      [testIds.filter.name]: texts.filtersToApply.name,
      [testIds.filter.model]: texts.filtersToApply.model,
      [testIds.filter.requestType]: texts.filtersToApply.requestType,
      [testIds.filter.isActive]: texts.filtersToApply.isActive,
      [testIds.filter.localizedCatalogs]: texts.filtersToApply.localizedCatalogs,
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

  await test.step('Create a Boost', async () => {
    await createButton.click()
    await expect(page).toHaveURL(urls.create)

    // isActive Switch
    await test.step('Disable and enable the "isActive" switch', async () => {
      await isActiveSwitch.expectToBeChecked()
      await isActiveSwitch.disable()
      await isActiveSwitch.enable()
    })

    // Boost Preview
    await expect(
      previewFieldSet.getByTestId(testIds.form.previewRequiredMessage)
    ).toBeVisible()

    // name InputText
    await test.step('Fill the "name" field text', async () => {
      await expect(nameInput).toBeEmpty()
      await nameInput.fill(newName)
      await expect(nameInput).toHaveValue(newName)
    })

    // Localized Catalogs Multiple Dropdown
    await test.step('Choose localized catalogs in "localized Catalogs" dropdown', async () => {
      await localizedCatalogs.selectValue(texts.createValues.localizedCatalogs)
    })

    // Request types Multiple Dropdown
    await test.step('Choose request type in the requestTypes component', async () => {
      await requestTypesDropdown.selectValue(texts.createValues.requestType)
    })

    // Model Dropdown
    await modelDropdown.selectValue(texts.createValues.model)

    // Preview Boost Required Message
    await expect(
      previewFieldSet.getByTestId(testIds.form.previewRequiredMessage)
    ).not.toBeVisible()

    // Create the Boost
    await saveButton.click()
    await expect(page).toHaveURL(urls.grid)
  })

  await test.step('Verify the boost existence in the grid', async () => {
    await grid.expectRowsAfterFiltersToBe(
      filter,
      {[testIds.filter.name]: newName},
      [{columnName: texts.gridHeaders.name, value: newName}]
    )
  })

  const editLink = page.locator(`[data-testid="${testIds.grid}"] a`)

  await test.step('Edit a Boost', async () => {
    await editLink.click()
    await expect(page).toHaveURL(urls.edit)

    await localizedCatalogs.expectToHaveValue(texts.createValues.localizedCatalogs)
    await localizedCatalogs.clear()
    await localizedCatalogs.selectValue(texts.editValues.localizedCatalogs)

    await saveButton.click()
    const alertMessage = new AlertMessage(page)
    await alertMessage.expectToHaveText('Updating of the boost with success', AlertMessageType.SUCCESS)

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
        {
          columnName: texts.gridHeaders.localizedCatalogs,
          value: texts.editValues.editedLocalizedCatalogDisplay
        },
      ]
    )
  })

  await test.step('Delete the Boost', async () => {
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
