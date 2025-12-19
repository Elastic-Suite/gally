import {expect, test} from '@playwright/test'
import {randomUUID} from 'crypto'
import {login} from '../../../../../utils/auth'
import {navigateTo} from '../../../../../utils/menu'
import {Dropdown} from '../../../../../helper/dropdown'
import {Switch} from '../../../../../helper/switch'
import {Grid} from '../../../../../helper/grid'
import {Filter, FilterType} from '../../../../../helper/filter'
import {AlertMessage, AlertMessageType} from '../../../../../helper/alertMessage'
import {generateTestId, TestId} from "../../../../../utils/testIds";
import {deleteEntity, getCommonFormTestIds} from "../../../../../utils/form";

const resourceName = 'Recommender'

const testIds = {
  grid: generateTestId(TestId.TABLE, resourceName),
  filter: {
    name: 'name',
    priority: 'priority[between]',
    isActive: 'isActive',
    localizedCatalogs: 'localizedCatalogs.id[]',
    recommenderTypes: 'recommenderTypes.id[]',
  },
  form: {
    ... getCommonFormTestIds(resourceName),
    isActive: 'isActive',
    name: generateTestId(TestId.INPUT_TEXT, 'name'),
    localizedCatalogs: 'localizedCatalogs',
    recommenderTypes: 'recommenderTypes',
    priority: generateTestId(TestId.INPUT_TEXT, 'priority'),
  },
  ... Grid.getCommonGridTestIds(resourceName)
} as const

const texts = {
  labelMenuPage: 'Auto recommenders',
  gridHeaders: {
    name: 'Name',
    priority: 'Priority',
    isActive: 'Enable',
    localizedCatalogs: 'Localized catalog(s)',
    recommenderTypes: 'Applied to',
    actions: 'Actions'
  },
  filtersToApply: {
    priority: [0, 1],
    isActive: true,
    localizedCatalogs: ['COM French Catalog'],
    recommenderTypes: ['Default'],
  },
  createValues: [
    {
      priority: '0',
      isActive: true,
      localizedCatalogs: [
        'COM French Catalog',
        'COM English Catalog',
      ],
      recommenderTypes: ['Default'],
    },
    {
      priority: '2',
      isActive: true,
      localizedCatalogs: [
        'FR French Catalog',
        'EN French Catalog',
      ],
      recommenderTypes: ['Default'],
    },
  ],
  editValues: {
      localizedCatalogs: ['COM French Catalog'],
      editedLocalizedCatalogDisplay: 'COM Catalog - COM French Catalog',
    }
} as const

const urls = {
  grid: '/admin/merchandize/recommender/auto_recommender/grid',
  create: '/admin/merchandize/recommender/auto_recommender/create',
  edit: /\/admin\/merchandize\/recommender\/auto_recommender\/edit\?id=\d+$/
}
test('Pages > Merchandising > Recommenders > Auto recommenders', {tag: ['@premium']}, async ({page}) => {
  await test.step('Login and navigate to the "Auto recommenders" page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, urls.grid)
  })

    // Grid and Filters Locators:
  const grid = new Grid(page, resourceName)
  const filter = new Filter(page, resourceName, {
    [testIds.filter.name]: FilterType.TEXT,
    [testIds.filter.priority]: FilterType.RANGE,
    [testIds.filter.isActive]: FilterType.BOOLEAN,
    [testIds.filter.localizedCatalogs]: FilterType.DROPDOWN,
    [testIds.filter.recommenderTypes]: FilterType.DROPDOWN,
  })
  const createButton = page.getByTestId(testIds.createButton)

  // Form Locators (Edit / Create):
  const isActiveSwitch = new Switch(page, testIds.form.isActive)
  const nameInput = page.getByTestId(testIds.form.name)
  const localizedCatalogs = new Dropdown(page, testIds.form.localizedCatalogs, true)
  const recommenderTypes = new Dropdown(page, testIds.form.recommenderTypes, true)
  const priorityInput = page.getByTestId(testIds.form.priority)
  const saveButton = page.getByTestId(testIds.form.submitButton)

  // Define a name for the new created Entity.
  const recommenderNameSuffix = '_e2e_test_recommender'
  const names =[
    randomUUID() + recommenderNameSuffix,
    randomUUID() + recommenderNameSuffix,
  ]

  await test.step('Create an auto recommenders', async () => {
    for (let i = 0; i < 2; i++) {
      await test.step('Create auto recommender #' + i, async () => {
        await createButton.click()
        await expect(page).toHaveURL(urls.create)
        await isActiveSwitch.expectToBeChecked()
        await nameInput.fill(names[i])
        await localizedCatalogs.selectValue(texts.createValues[i].localizedCatalogs)
        await recommenderTypes.selectValue(texts.createValues[i].recommenderTypes)
        await priorityInput.fill(texts.createValues[i].priority)
        await saveButton.click()
        await expect(page).toHaveURL(urls.grid)
      })
    }
  })

  await test.step('Verify the recommender #1 existence in the grid', async () => {
    await grid.expectRowsAfterFiltersToBe(
      filter,
      {[testIds.filter.name]: names[0]},
      [{columnName: texts.gridHeaders.name, value: names[0]}]
    )
  })

  const editLink = page.locator(`[data-testid="${testIds.grid}"] a`)

  await test.step('Edit an auto recommender', async () => {
    await editLink.click()
    await expect(page).toHaveURL(urls.edit)

    await localizedCatalogs.expectToHaveValue(texts.createValues[0].localizedCatalogs)
    await localizedCatalogs.clear()
    await localizedCatalogs.selectValue(texts.editValues.localizedCatalogs)

    await saveButton.click()
    const alertMessage = new AlertMessage(page)
    await alertMessage.expectToHaveText('Updating of the auto recommender with success', AlertMessageType.SUCCESS)

    await page.getByTestId(testIds.form.backButton).click()
    await expect(page).toHaveURL(urls.grid)

    await grid.expectRowsAfterFiltersToBe(
      filter,
      {[testIds.filter.name]: names[0]},
      [
        {
          columnName: texts.gridHeaders.name,
          value: names[0],
        },
        {
          columnName: texts.gridHeaders.localizedCatalogs,
          value: texts.editValues.editedLocalizedCatalogDisplay
        },
      ]
    )

    await filter.clearFilters()
  })

  await test.step('Verify grid headers and pagination', async () => {
    await grid.expectHeadersAndPaginationToBe(Object.values(texts.gridHeaders))
  })

  await test.step('Add some filters and remove them', async () => {
    const defaultRowCount = await grid.getCountLines()
    const applicableFilters = {
      [testIds.filter.name]: names[0],
      [testIds.filter.priority]: texts.filtersToApply.priority,
      [testIds.filter.isActive]: texts.filtersToApply.isActive,
      [testIds.filter.localizedCatalogs]: texts.filtersToApply.localizedCatalogs,
      [testIds.filter.recommenderTypes]: texts.filtersToApply.recommenderTypes,
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
        {[testIds.filter.name]: names[0]},
        [{columnName: texts.gridHeaders.name, value: names[0]}]
      )
    })

    await test.step('Clear filter', async () => {
      await grid.expectAllFiltersRemoved(filter, defaultRowCount)
    })
  })

  await test.step('Delete the auto recommenders', async () => {
    for (let i = 0; i < 2; i++) {
      await test.step('Delete auto recommender #' + i, async () => {
        await expect(page).toHaveURL(urls.grid)
        await page.locator(`[data-testid="${testIds.grid}"] a`).first().click()
        await deleteEntity(
          page,
          testIds.form.deleteButton,
          testIds.form.deletePopin.dialogConfirmButton,
          urls.grid
        )

        // Test only for the first recommender because when all recommenders will be removed, the grid disappear.
        if (i === 0) {
          await expect(page).toHaveURL(urls.grid)
          await grid.expectRowsAfterFiltersToBe(filter, {[testIds.filter.name]: names[i]}, [], 0)
          await filter.clearFilters()
        }
      })
    }
  })
})
