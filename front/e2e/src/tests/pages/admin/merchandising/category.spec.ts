import { test, expect } from '@playwright/test'
import { Grid } from '../../../../helper/grid'
import { Dropdown } from '../../../../helper/dropdown'
import { login } from '../../../../helper/auth'
import { navigateTo } from '../../../../helper/menu'
import { AlertMessage } from '../../../../helper/alertMessage'
import { Switch } from '../../../../helper/switch'

const GridLabelsAndFilters = {
  code: { gridLabel: 'Code' },
  image: { gridLabel: 'Image' },
  name: {
    gridLabel: 'Name',
  },
  score: { gridLabel: 'Score' },
  stock: { gridLabel: 'Stock' },
  price: { gridLabel: 'Price' },
} as const

const catalogs = ['COM Catalog', 'FR Catalog', 'UK Catalog']
const locales = ['French (France)', 'English (United States)']

test('Page => Categories', async ({ page }) => {
  await login(page)
  await navigateTo(page, 'Categories', '/admin/merchandize/categories')

  const grid = new Grid(page, 'categoriesProductsBottomTable')
  await grid.expectHeadersToBe([
    GridLabelsAndFilters.code.gridLabel,
    GridLabelsAndFilters.image.gridLabel,
    GridLabelsAndFilters.name.gridLabel,
    GridLabelsAndFilters.score.gridLabel,
    GridLabelsAndFilters.stock.gridLabel,
    GridLabelsAndFilters.price.gridLabel,
  ])

  await grid.pagination.expectToHaveOptions(['10', '25', '50'])
  await grid.pagination.expectToHaveRowsPerPage(50)
  await grid.pagination.changeRowsPerPage(10)
  const nextPage = await grid.pagination.goToNextPage()
  await expect(nextPage).toBe(true)

  const pageTitle = page.getByTestId('categoriesProductsTitle')

  // Editable configuration fields
  const defaultSortingDropdown = new Dropdown(
    page,
    'defaultSortingMerchandising'
  )
  const useNameInProductSearchSwitch = new Switch(page, 'useNameInProductSearchMerchandising')
  const isVirtualSwitch = new Switch(page, 'isVirtualMerchandising')

  const catalogDropdown = new Dropdown(page, 'catalogSwitcherDropdown')
  const localizedCatalogDropdown = new Dropdown(
    page,
    'localizedCatalogSwitcherDropdown'
  )
  const categoriesProductsSaveButton = page.getByTestId(
    'categoriesProductsSaveButton'
  )

  await expect(categoriesProductsSaveButton).toBeDisabled()

  await catalogDropdown.expectToHaveOptions(['All catalog', ...catalogs])

  await catalogDropdown.expectToHaveValue('All catalog')
  await expect(
    page.getByTestId('localizedCatalogSwitcherDropdown')
  ).not.toBeVisible()
  await catalogDropdown.selectValue(catalogs[0])
  await expect(
    page.getByTestId('localizedCatalogSwitcherDropdown')
  ).toBeVisible()

  await localizedCatalogDropdown.expectToHaveOptions([
    'All locales',
    ...locales,
  ])
  await localizedCatalogDropdown.expectToHaveValue('All locales')
  await localizedCatalogDropdown.selectValue(locales[0])

  await catalogDropdown.selectValue('All catalog')
  await expect(
    page.getByTestId('localizedCatalogSwitcherDropdown')
  ).not.toBeVisible()

  const categoryCollapseTreeListButton = await page
    .getByTestId('categoryCollapseTreeListButton')
    .all()

  for (let i = 0; i < categoryCollapseTreeListButton.length; i++) {
    const collapseButton = categoryCollapseTreeListButton[i]
    await collapseButton.click()
  }

  const categoyBasButton = page
    .getByTestId('categoryTitleItemTreeButton')
    .filter({
      hasText: 'Bas',
    })

  await expect(categoyBasButton).toBeVisible()

  await categoyBasButton.click()

  await expect(pageTitle).toHaveText('Bas')

  const useNameInProductSearch = await useNameInProductSearchSwitch.isActive()
  await useNameInProductSearchSwitch.toggle()

  await expect(categoriesProductsSaveButton).not.toBeDisabled()
  await categoriesProductsSaveButton.click()

  const alertMessage = new AlertMessage(page)
  await alertMessage.expectToHaveText('Save data with success')
  await expect(categoriesProductsSaveButton).toBeDisabled()

  await catalogDropdown.selectValue(catalogs[0])

  await useNameInProductSearchSwitch.expectToBeChecked(useNameInProductSearch)

  await localizedCatalogDropdown.clear()
  await defaultSortingDropdown.selectValue('Price')
  await defaultSortingDropdown.expectToHaveValue('Price')

  await expect(categoriesProductsSaveButton).not.toBeDisabled()
  await categoriesProductsSaveButton.click()

  await alertMessage.expectToHaveText('Save data with success')

  await expect(categoriesProductsSaveButton).toBeDisabled()
  await localizedCatalogDropdown.selectValue(locales[0])
  await defaultSortingDropdown.expectToHaveValue('Price')

  await defaultSortingDropdown.selectValue('Position')
  await defaultSortingDropdown.expectToHaveValue('Position')
  await expect(categoriesProductsSaveButton).not.toBeDisabled()
  await categoriesProductsSaveButton.click()

  await alertMessage.expectToHaveText('Save data with success')

  await expect(categoriesProductsSaveButton).toBeDisabled()
  await localizedCatalogDropdown.selectValue('All locales')
  await defaultSortingDropdown.expectToHaveValue('Price')

  // await localizedCatalogDropdown.selectValue(locales[0])
  // await expect(useNameInProductSearchSwitchCheckbox).toBeChecked({
  //   checked: !useNameInProductSearchSwitchValue,
  // })
  // await useNameInProductSearchSwitch.click()
  // await categoriesProductsSaveButton.click()
  // await expect(await page.getByTestId('alertMessage')).toBeVisible()
  // await expect(alertMessage).toHaveText('Save data with success', {
  //   useInnerText: true,
  // })
  // await localizedCatalogDropdown.selectValue(locales[0])
  // await expect(useNameInProductSearchSwitchCheckbox).toBeChecked({
  //   checked: useNameInProductSearchSwitchValue,
  // })
})
