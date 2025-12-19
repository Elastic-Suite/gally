import {Page, expect, test} from '@playwright/test'
import {Grid} from '../../../../helper/grid'
import {Dropdown} from '../../../../helper/dropdown'
import {login} from '../../../../utils/auth'
import {navigateTo} from '../../../../utils/menu'
import {AlertMessage, AlertMessageType} from '../../../../helper/alertMessage'
import {Switch} from '../../../../helper/switch'
import {generateTestId, TestId} from "../../../../utils/testIds";
import { GallyPackage } from '../../../../utils/gallyPackage'

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

let catalogDropdown: Dropdown = null
let localizedCatalogDropdown: Dropdown = null

function resetDropdowns(): void {
  catalogDropdown = null
  localizedCatalogDropdown = null
}

// Add this before your test functions
test.beforeEach(() => {
  resetDropdowns()
})

function getCatalogDropdown(page: Page): Dropdown {
  if (!catalogDropdown) {
    catalogDropdown = new Dropdown(page, testIds.catalogSwitcher)
  }
  return catalogDropdown
}

function getLocalizedCatalogDropdown(page: Page): Dropdown {
  if (!localizedCatalogDropdown) {
    localizedCatalogDropdown = new Dropdown(
      page,
      testIds.localizedCatalogSwitcher
    )
  }
  return localizedCatalogDropdown
}

async function changeScopeDropdown(page: Page, dropdown: Dropdown, value: string, waitForRequest = true): Promise<void> {
  const catalogInformationsResponse = page.waitForResponse('**/api/category_configurations/category/**')
  await dropdown.selectValue(value)
  if (waitForRequest) {
    await catalogInformationsResponse
  }
}

async function selectCatalog(page: Page, catalog: string, waitForRequest = true): Promise<void> {
  await changeScopeDropdown(page, getCatalogDropdown(page), catalog, waitForRequest)
}

async function selectLocalizedCatalog(page: Page, localizedCatalog: string, waitForRequest = true): Promise<void> {
  await changeScopeDropdown(page, getLocalizedCatalogDropdown(page), localizedCatalog, waitForRequest)
}

async function testCategoriesPage(page: Page, gallyPackage: GallyPackage): Promise<void> {
  await test.step('Login and navigate to the Categories page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, '/admin/merchandize/categories')
  })

  const grid = new Grid(page, generateTestId(TestId.PRODUCTS_CONTAINER, 'categoriesProducts'))
  const pageTitle = page.getByTestId(generateTestId(TestId.PAGE_TITLE, 'categoriesProducts')).locator('h1')

  await test.step('Verify grid headers, pagination and searchBar', async () => {
    await grid.expectHeadersAndPaginationToBe(Object.values(texts.gridHeaders))
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
  const categoriesProductsSaveButton = page.getByTestId(testIds.categoriesProductsSaveButton)

  const alertMessage = new AlertMessage(page)

  await test.step('Expect configuration fields to be visible', async () => {
    await defaultSortingDropdown.expectToBeVisible()
    await useNameInProductSearchSwitch.expectToBeVisible()
    if (gallyPackage === GallyPackage.PREMIUM) {
      await isVirtualSwitch.expectToBeVisible()
    }
    await expect(categoriesProductsSaveButton).toBeDisabled()
  })

  await test.step('Open catalog dropdown and choose a value', async () => {
    await getCatalogDropdown(page).expectToHaveOptions([texts.allCatalog, ...texts.catalogs])
    await getCatalogDropdown(page).expectToHaveValue(texts.allCatalog)
    await getLocalizedCatalogDropdown(page).expectToBeVisible(false)
    await selectCatalog(page, texts.catalogs[0])
    await getLocalizedCatalogDropdown(page).expectToBeVisible()
  })

  await test.step('Open localized catalog dropdown and choose a value', async () => {
    await getLocalizedCatalogDropdown(page).expectToHaveOptions([
      texts.allLocales,
      ...texts.locales,
    ])
    await getLocalizedCatalogDropdown(page).expectToHaveValue(texts.allLocales)
    await selectLocalizedCatalog(page, texts.locales[0])
  })

  await test.step('Select "All catalogs" in catalog dropdown and modify the configuration', async () => {
    await selectCatalog(page, texts.allCatalog)
    await getLocalizedCatalogDropdown(page).expectToBeVisible(false)
    await defaultSortingDropdown.selectValue(texts.brand)
    await expect(categoriesProductsSaveButton).not.toBeDisabled()
    await categoriesProductsSaveButton.click()
    await alertMessage.expectToHaveText(texts.saveDataMessage, AlertMessageType.SUCCESS)
  })

  await test.step('Select "COM catalog" in catalog dropdown', async () => {
    await selectCatalog(page, texts.catalogs[0])
    await defaultSortingDropdown.expectToHaveValue(texts.brand)
  })

  await test.step('Reset default sorting values for "All catalogs"', async () => {
    await selectCatalog(page, texts.allCatalog)
    await defaultSortingDropdown.selectValue(texts.position)
    await categoriesProductsSaveButton.click()
    await alertMessage.expectToHaveText(texts.saveDataMessage, AlertMessageType.SUCCESS)
    await selectCatalog(page, texts.catalogs[0])
  })

  const categoryCollapseTreeListButton = await page
    .getByTestId(testIds.categoryCollapseTreeListButton)
    .all()

  await test.step('Modify a config on a category', async () => {
    for (let i = 0; i < categoryCollapseTreeListButton.length; i++) {
      const collapseButton = categoryCollapseTreeListButton[i]
      await collapseButton.click()
    }

    const categoryBasButton = page
      .getByTestId(testIds.treeItemTitleButton)
      .filter({
        hasText: texts.basCategory,
      })

    await expect(categoryBasButton).toBeVisible()

    await categoryBasButton.click()

    await expect(pageTitle).toHaveText(texts.basCategory)
    await defaultSortingDropdown.selectValue(texts.price)

    if (gallyPackage === GallyPackage.PREMIUM) {
      await isVirtualSwitch.enable()
      const combinationRules = page.getByTestId(testIds.combinationRules)
      await expect(combinationRules).toBeVisible()
      await isVirtualSwitch.disable()
      await expect(combinationRules).not.toBeVisible()
    }

    await expect(categoriesProductsSaveButton).not.toBeDisabled()
    await categoriesProductsSaveButton.click()
    await alertMessage.expectToHaveText(texts.saveDataMessage, AlertMessageType.SUCCESS)
  })

  await test.step('Select a locale', async () => {
    await selectLocalizedCatalog(page, texts.locales[0])
    await defaultSortingDropdown.expectToHaveValue(texts.price)
  })

  await test.step('Select "All catalogs"', async () => {
    await selectCatalog(page, texts.allCatalog)
    await defaultSortingDropdown.expectToHaveValue(texts.position)
  })

  await test.step('Select catalog and localized catalog, modify the configuration and select All locales and All catalog to verify that the configuration is not applied to them', async () => {
    await selectCatalog(page, texts.catalogs[0])
    await selectLocalizedCatalog(page, texts.locales[0])
    await defaultSortingDropdown.selectValue(texts.stockStatus)
    await expect(categoriesProductsSaveButton).not.toBeDisabled()
    await categoriesProductsSaveButton.click()
    await alertMessage.expectToHaveText(texts.saveDataMessage, AlertMessageType.SUCCESS)
    await selectLocalizedCatalog(page, texts.allLocales)
    await defaultSortingDropdown.expectToHaveValue(texts.price)
    await selectCatalog(page, texts.allCatalog)
    await defaultSortingDropdown.expectToHaveValue(texts.position)
  })

  await test.step('Reset default sorting values for "COM Catalog"', async () => {
    // Reset default sorting  on com_fr for FR_fr locale
    await selectCatalog(page, texts.catalogs[0])
    await selectLocalizedCatalog(page, texts.locales[0])
    // BEWARE: we set price here because we run standard and premium back to back
    // AND we can't remove configuration values for localized catalogs once set
    await defaultSortingDropdown.selectValue(texts.price)
    await categoriesProductsSaveButton.click()
    await alertMessage.expectToHaveText(texts.saveDataMessage, AlertMessageType.SUCCESS)

    // Reset default sorting  on com_fr for all locales
    // No wait for request as the value is the same as the last one for the catalog
    // We keep this selection to be consistent with the rest of the test
    await selectCatalog(page, texts.catalogs[0], false)
    await selectLocalizedCatalog(page, texts.allLocales)
    await defaultSortingDropdown.selectValue(texts.position)
    await expect(categoriesProductsSaveButton).not.toBeDisabled()
    await categoriesProductsSaveButton.click()
    await alertMessage.expectToHaveText(texts.saveDataMessage, AlertMessageType.SUCCESS)
  })
}

test('Pages > Merchandising > Standard Categories', {tag: ['@standard']}, async ({page}) => {
  await testCategoriesPage(page, GallyPackage.STANDARD)
})

test('Pages > Merchandising > Premium Categories', {tag: ['@premium']}, async ({page}) => {
  await testCategoriesPage(page, GallyPackage.PREMIUM)
})
