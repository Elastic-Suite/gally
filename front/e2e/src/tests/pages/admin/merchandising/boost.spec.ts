import {expect, test} from '@playwright/test'
import {randomUUID} from 'crypto'
import {login} from '../../../../helper/auth'
import {navigateTo} from '../../../../helper/menu'
import {Dropdown} from '../../../../helper/dropdown'
import {Switch} from '../../../../helper/switch'
import {Grid} from '../../../../helper/grid'
import {Filter, FilterType} from '../../../../helper/filter'
import {AlertMessage, AlertMessageType} from '../../../../helper/alertMessage'
import {generateTestId, TestId} from "../../../../helper/testIds";

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
    localizedCatalogs: 'localizedCatalogs',
    isActive: 'isActive',
    name: generateTestId(TestId.INPUT_TEXT, 'name'),
    requestType: 'requestTypes',
    model: 'model',
    submitButton: generateTestId(TestId.BUTTON, 'submit'),
    deleteButton: generateTestId(TestId.BUTTON, 'delete'),
    backButton: generateTestId(TestId.BUTTON, 'back'),
    deleteBoostPopin: {
      dialogConfirmButton: generateTestId(TestId.DIALOG_CONFIRM_BUTTON, resourceName),
    },
    previewFieldSet: generateTestId(TestId.FIELD_SET, 'preview'),
    previewRequiredMessage: generateTestId(TestId.PREVIEW_REQUIRED_MESSAGE)
  },
  createBoostButton: generateTestId(TestId.GRID_CREATE_BUTTON, resourceName)
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
  boostToCreateValues: {
    localizedCatalogs: [
      'COM English Catalog',
      'COM French Catalog',
      'FR French Catalog',
      'EN French Catalog',
    ],
    requestType: [
      'Category listing',
      'Search result',
    ],
    model: 'Constant score'
  },
  boostToEditValues: {
    localizedCatalogs: ['COM French Catalog'],
    editedLocalizedCatalogDisplay: 'COM Catalog - COM French Catalog',
  },
  paginationOptions: ['10', '25', '50']
} as const

test('Pages > Merchandising > Boosts', {tag: ['@premium']}, async ({page}) => {
  await test.step('Login and navigate to the Boosts page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, '/admin/merchandize/boost/grid')
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
  const createButton = page.getByTestId(testIds.createBoostButton)

  // Form Locators (Edit / Create):
  const localizedCatalogs = new Dropdown(page, testIds.form.localizedCatalogs, true)
  const isActiveSwitch = new Switch(page, testIds.form.isActive)
  const previewFieldSet = page.getByTestId(testIds.form.previewFieldSet)
  const nameInput = page.getByTestId(testIds.form.name)
  const requestTypesDropdown = new Dropdown(page, testIds.form.requestType, true)
  const modelDropdown = new Dropdown(page, testIds.form.model)
  const saveButton = page.getByTestId(testIds.form.submitButton)
  const deleteButton = page.getByTestId(testIds.form.deleteButton)

  // Define a name for the new created Boost.
  const newName = randomUUID()

  await test.step('Verify grid headers and pagination', async () => {
    await grid.expectHeadersToBe(Object.values(texts.gridHeaders))
    await grid.pagination.expectToHaveOptions(texts.paginationOptions)
    await grid.pagination.expectToHaveRowsPerPage(50)
  })

  await test.step('Add some filters and remove them', async () => {
    const defaultRowCount = await grid.getCountLines()
    await test.step('Apply all filters available', async () => {
      await filter.addFilter(
        testIds.filter.name,
        texts.filtersToApply.name
      )
      await filter.addFilter(testIds.filter.model, texts.filtersToApply.model)
      await filter.addFilter(testIds.filter.requestType, texts.filtersToApply.requestType)
      await filter.addFilter(testIds.filter.isActive, true)
      await filter.addFilter(
        testIds.filter.localizedCatalogs,
        texts.filtersToApply.localizedCatalogs
      )
    })

    await test.step('Remove applied filters one by one', async () => {
      await filter.removeFilter(
        testIds.filter.name,
        texts.filtersToApply.name
      )

      for (let i = 0; i < texts.filtersToApply.model.length; i++) {
        await filter.removeFilter(
          testIds.filter.model,
          texts.filtersToApply.model[i]
        )
      }

      for (let i = 0; i < texts.filtersToApply.requestType.length; i++) {
        await filter.removeFilter(
          testIds.filter.requestType,
          texts.filtersToApply.requestType[i]
        )
      }

      await filter.removeFilter(
        testIds.filter.isActive,
        texts.filtersToApply.isActive
      )

      for (let i = 0; i < texts.filtersToApply.localizedCatalogs.length; i++) {
        await filter.removeFilter(
          testIds.filter.localizedCatalogs,
          texts.filtersToApply.localizedCatalogs[i]
        )
      }
    })

    await test.step('Apply a filter and compare the grid to see if it works', async () => {
      await filter.addFilter(
        testIds.filter.name,
        texts.filtersToApply.name
      )

      await grid.pagination.expectToHaveCount(1)

      await grid.expectToFindLineWhere([
        {
          columnName: texts.gridHeaders.name,
          value: texts.filtersToApply.name,
        },
      ])
    })

    await test.step('Clear filter', async () => {
      await filter.clearFilters()
      await grid.pagination.expectToHaveCount(defaultRowCount)
    })
  })

  await test.step('Create a Boost', async () => {
    await createButton.click()
    await expect(page).toHaveURL('/admin/merchandize/boost/create')

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
    await test.step('Choose localize catalogs in "localized Catalogs" dropdown', async () => {
      await localizedCatalogs.selectValue(texts.boostToCreateValues.localizedCatalogs)
    })

    // Request types Multiple Dropdown
    await test.step('Choose requestypes in the requestTypes component', async () => {
      await requestTypesDropdown.selectValue(texts.boostToCreateValues.requestType)
    })

    // Model Dropdown
    await modelDropdown.selectValue(texts.boostToCreateValues.model)

    // Preview Boost Required Message
    await expect(
      previewFieldSet.getByTestId(testIds.form.previewRequiredMessage)
    ).not.toBeVisible()

    // Create the Boost
    await saveButton.click()
    await expect(page).toHaveURL('/admin/merchandize/boost/grid')
  })
  await test.step('Verify the boost existence in the grid', async () => {
    await grid.expectToFindLineWhere([
      {
        columnName: texts.gridHeaders.name,
        value: newName,
      },
    ])
    await filter.addFilter(testIds.filter.name, newName)
    await grid.pagination.expectToHaveCount(1)
  })

  const editLink = page.locator(`[data-testid="${testIds.grid}"] a`)

  await test.step('Edit a Boost', async () => {
    await editLink.click()
    await expect(page).toHaveURL(/\/admin\/merchandize\/boost\/edit\?id=\d+$/)

    await localizedCatalogs.expectToHaveValue(texts.boostToCreateValues.localizedCatalogs)
    await localizedCatalogs.clear()
    await localizedCatalogs.selectValue(texts.boostToEditValues.localizedCatalogs)

    await saveButton.click()
    const alertMessage = new AlertMessage(page)
    await alertMessage.expectToHaveText('Updating of the boost with success', AlertMessageType.SUCCESS)

    const backButton = page.getByTestId(testIds.form.backButton)
    await backButton.click()
    await expect(page).toHaveURL('/admin/merchandize/boost/grid')
  })

  await test.step('Delete the Boost', async () => {
    await filter.addFilter(testIds.filter.name, newName)
    await grid.pagination.expectToHaveCount(1)
    await grid.expectToFindLineWhere([
      {
        columnName: texts.gridHeaders.name,
        value: newName,
      },
      {
        columnName: texts.gridHeaders.localizedCatalogs,
        value: texts.boostToEditValues.editedLocalizedCatalogDisplay
      },
    ])

    await editLink.click()

    await deleteButton.click()
    await page.getByTestId(testIds.form.deleteBoostPopin.dialogConfirmButton).click()
    await expect(page).toHaveURL('/admin/merchandize/boost/grid')
    await filter.addFilter(testIds.filter.name, newName)
    await grid.pagination.expectToHaveCount(0)
  })
})
