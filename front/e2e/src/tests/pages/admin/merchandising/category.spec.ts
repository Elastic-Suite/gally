import {expect, test} from '@playwright/test'
import {Grid} from '../../../../helper/grid'
import {Dropdown} from '../../../../helper/dropdown'
import {login} from '../../../../helper/auth'
import {navigateTo} from '../../../../helper/menu'
import {AlertMessage, AlertMessageType} from '../../../../helper/alertMessage'
import {Switch} from '../../../../helper/switch'
import {generateTestId, TestId} from "../../../../helper/testIds";

const testIds = {
  defaultSorting: 'defaultSorting',
  useNameInProductSearch: 'useNameInProductSearch',
  isVirtual: 'isVirtual',
  catalogSwitcher: 'catalogSwitcher',
  localizedCatalogSwitcher: 'localizedCatalogSwitcher',
  categoriesProductsSaveButton: generateTestId(TestId.PRODUCTS_CONTAINER_SAVE_BUTTON, 'categoriesProducts'),
  searchBar: generateTestId(TestId.INPUT_TEXT, generateTestId(TestId.PRODUCTS_CONTAINER_SEARCH_BAR, 'categoriesProducts')),
  categoryCollapseTreeListButton: generateTestId(TestId.TREE_COLLAPSING_ITEM_LIST_BUTTON, 'category'),
  treeItemTitleButton: generateTestId(TestId.TREE_ITEM_TITLE_BUTTON, 'category'),
  combinationRules: generateTestId(TestId.COMBINATION_RULES)
}

const texts = {
  labelMenuPage: 'Categories',
  gridHeaders: {
    code: 'Code',
    image: 'Image',
    name: 'Name',
    score: 'Score',
    stock: 'Stock',
    price: 'Price',
  },
  catalogs: [
    'COM Catalog', 'FR Catalog', 'UK Catalog'
  ],
  locales: ['French (France)', 'English (United States)'],
  paginationOptions: ['10', '25', '50'],
  productToSearch: 'Gold Omni Bangle Set',
  allCatalog: "All catalog",
  allLocales: "All locales",
  saveDataMessage: 'Save data with success',
  basCategory: 'Bas',
  price: 'Price',
  position: 'Position',
  brand: 'Marque',
  stockStatus: 'Stock status'
} as const

test('Pages > Merchandising > Categories', {tag: ['@premium', '@standard']}, async ({page}) => {
  await test.step('Login and navigate to the Categories page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, '/admin/merchandize/categories')
  })

  const grid = new Grid(page, generateTestId(TestId.PRODUCTS_CONTAINER, 'categoriesProducts'))
  const pageTitle = page.getByTestId(generateTestId(TestId.PAGE_TITLE, 'categoriesProducts')).locator('h1')

  await test.step('Verify grid headers, pagination and searchBar', async () => {
    console.log('-------------------')
    console.log(await page.content())
    console.log('-------------------')
    await grid.expectHeadersToBe(Object.values(texts.gridHeaders))
    await grid.pagination.expectToHaveOptions(texts.paginationOptions)
    await grid.pagination.expectToHaveRowsPerPage(50)
    await grid.pagination.changeRowsPerPage(10)
    const nextPage = await grid.pagination.goToNextPage()
    await expect(nextPage).toBe(true)
    await grid.pagination.goToPreviousPage()
    const searchBar = page.getByTestId(testIds.searchBar)
    await searchBar.fill(texts.productToSearch)
    await searchBar.press('Enter')
    await grid.pagination.expectToHaveCount(1)
    await grid.expectToFindLineWhere([{
      columnName: texts.gridHeaders.name,
      value: texts.productToSearch
    }])
  })


  // Editable configuration fields
  const defaultSortingDropdown = new Dropdown(
    page,
    testIds.defaultSorting
  )
  const useNameInProductSearchSwitch = new Switch(
    page,
    testIds.useNameInProductSearch
  )
  const isVirtualSwitch = new Switch(page, testIds.isVirtual)

  const catalogDropdown = new Dropdown(page, testIds.catalogSwitcher)
  const localizedCatalogDropdown = new Dropdown(
    page,
    testIds.localizedCatalogSwitcher
  )
  const categoriesProductsSaveButton = page.getByTestId(testIds.categoriesProductsSaveButton)

  const alertMessage = new AlertMessage(page)

  await test.step('Expect configuration fields to be visible', async () => {
    await defaultSortingDropdown.expectToBeVisible()
    await useNameInProductSearchSwitch.expectToBeVisible()
    await isVirtualSwitch.expectToBeVisible()
    await expect(categoriesProductsSaveButton).toBeDisabled()
  })

  await test.step('Open catalog dropdown and choose a value', async () => {
    await catalogDropdown.expectToHaveOptions([texts.allCatalog, ...texts.catalogs])
    await catalogDropdown.expectToHaveValue(texts.allCatalog)
    await localizedCatalogDropdown.expectToBeVisible(false)
    await catalogDropdown.selectValue(texts.catalogs[0])
    await localizedCatalogDropdown.expectToBeVisible()
  })

  await test.step('Open localized catalog dropdown and choose a value', async () => {
    await localizedCatalogDropdown.expectToHaveOptions([
      texts.allLocales,
      ...texts.locales,
    ])
    await localizedCatalogDropdown.expectToHaveValue(texts.allLocales)
    await localizedCatalogDropdown.selectValue(texts.locales[0])
  })

  await test.step('Select "All catalogs" in catalog dropdown and modify the configuration', async () => {
    await catalogDropdown.selectValue(texts.allCatalog)
    await localizedCatalogDropdown.expectToBeVisible(false)
    await defaultSortingDropdown.selectValue(texts.brand)
    await expect(categoriesProductsSaveButton).not.toBeDisabled()
    await categoriesProductsSaveButton.click()
    await alertMessage.expectToHaveText(texts.saveDataMessage, AlertMessageType.SUCCESS)
  })

  await test.step('Select "COM catalog" in catalog dropdown', async () => {
    await catalogDropdown.selectValue(texts.catalogs[0])
    await defaultSortingDropdown.expectToHaveValue(texts.brand)
  })

  const categoryCollapseTreeListButton = await page
    .getByTestId(testIds.categoryCollapseTreeListButton)
    .all()

  await test.step('Modify a config on a category', async () => {
    for (let i = 0; i < categoryCollapseTreeListButton.length; i++) {
      const collapseButton = categoryCollapseTreeListButton[i]
      await collapseButton.click()
    }

    const categoyBasButton = page
      .getByTestId(testIds.treeItemTitleButton)
      .filter({
        hasText: texts.basCategory,
      })

    await expect(categoyBasButton).toBeVisible()

    await categoyBasButton.click()

    await expect(pageTitle).toHaveText(texts.basCategory)
    await defaultSortingDropdown.selectValue(texts.price)
    await isVirtualSwitch.enable()

    const combinationRules = page.getByTestId(testIds.combinationRules)
    await expect(combinationRules).toBeVisible()
    await isVirtualSwitch.disable()
    await expect(combinationRules).not.toBeVisible()

    await expect(categoriesProductsSaveButton).not.toBeDisabled()
    await categoriesProductsSaveButton.click()
    await alertMessage.expectToHaveText(texts.saveDataMessage, AlertMessageType.SUCCESS)
  })

  await test.step('Select a locale', async () => {
    await localizedCatalogDropdown.selectValue(texts.locales[0])
    await defaultSortingDropdown.expectToHaveValue(texts.price)
  })

  await test.step('Select "All catalogs"', async () => {
    await catalogDropdown.selectValue(texts.allCatalog)
    await defaultSortingDropdown.expectToHaveValue(texts.position)
  })

  await test.step('Select catalog and localized catalog, modify the configuration and select All locales and All catalog to verify that the configuration is not apply to them', async () => {
    await catalogDropdown.selectValue(texts.catalogs[0])
    await localizedCatalogDropdown.selectValue(texts.locales[0])
    await defaultSortingDropdown.selectValue(texts.stockStatus)
    await expect(categoriesProductsSaveButton).not.toBeDisabled()
    await categoriesProductsSaveButton.click()
    await alertMessage.expectToHaveText(texts.saveDataMessage, AlertMessageType.SUCCESS)
    await localizedCatalogDropdown.selectValue(texts.allLocales)
    await defaultSortingDropdown.expectToHaveValue(texts.price)
    await catalogDropdown.selectValue(texts.allCatalog)
    await defaultSortingDropdown.expectToHaveValue(texts.position)
  })
})

