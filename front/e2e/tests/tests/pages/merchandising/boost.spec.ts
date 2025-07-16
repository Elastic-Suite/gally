import { test, expect } from '@playwright/test'
import { randomUUID } from 'crypto'
import { login } from '../../../helper/auth'
import { navigateTo } from '../../../helper/menu'
import { Dropdown } from '../../../helper/dropdown'
import { Switch } from '../../../helper/switch'
import { Grid } from '../../../helper/grid'
import { Filter, FilterType } from '../../../helper/filter'
import { AlertMessage } from '../../../helper/alertMessage'

const GridLabelsAndFilters = {
  name: {
    gridLabel: 'Name',
    filterTestId: 'name',
  },
  model: {
    gridLabel: 'Model',
    filterTestId: 'model[]',
  },
  requestType: {
    gridLabel: 'Request type',
    filterTestId: 'requestTypes.requestType[]',
  },
  isActive: {
    gridLabel: 'Enable',
    filterTestId: 'isActive',
  },
  localizedCatalogs: {
    gridLabel: 'Localized catalog(s)',
    filterTestId: 'localizedCatalogs.id[]',
  },
  actions: {
    gridLabel: 'Actions',
  },
} as const

test('Boosts', async ({ page }) => {
  await login(page)
  await navigateTo(page, 'Boosts', '/admin/merchandize/boost/grid')

  const grid = new Grid(page, 'BoostTable')
  await grid.expectHeadersToBe([
    GridLabelsAndFilters.name.gridLabel,
    GridLabelsAndFilters.model.gridLabel,
    GridLabelsAndFilters.requestType.gridLabel,
    GridLabelsAndFilters.isActive.gridLabel,
    GridLabelsAndFilters.localizedCatalogs.gridLabel,
    GridLabelsAndFilters.actions.gridLabel,
  ])

  await grid.pagination.expectToHaveOptions(['10', '25', '50'])
  await grid.pagination.expectToHaveRowsPerPage(50)

  const defaultRowCount = await grid.getCountLines()

  const filter = new Filter(page, 'BoostFilter', {
    [GridLabelsAndFilters.name.filterTestId]: FilterType.TEXT,
    [GridLabelsAndFilters.model.filterTestId]: FilterType.DROPDOWN,
    [GridLabelsAndFilters.requestType.filterTestId]: FilterType.DROPDOWN,
    [GridLabelsAndFilters.isActive.filterTestId]: FilterType.BOOLEAN,
    [GridLabelsAndFilters.localizedCatalogs.filterTestId]: FilterType.DROPDOWN,
  })

  await filter.addFilter(
    GridLabelsAndFilters.name.filterTestId,
    'Boost "Tank dress"'
  )
  await filter.addFilter(GridLabelsAndFilters.model.filterTestId, [
    'Constant score',
    'Proportional to an attribute value',
  ])
  await filter.addFilter(GridLabelsAndFilters.requestType.filterTestId, [
    'Category listing',
  ])
  await filter.addFilter(GridLabelsAndFilters.isActive.filterTestId, true)
  await filter.addFilter(GridLabelsAndFilters.localizedCatalogs.filterTestId, [
    'COM French Catalog',
  ])

  await filter.removeFilter(
    GridLabelsAndFilters.name.filterTestId,
    'Boost "Tank dress"'
  )
  await filter.removeFilter(
    GridLabelsAndFilters.model.filterTestId,
    'Constant score'
  )
  await filter.removeFilter(
    GridLabelsAndFilters.model.filterTestId,
    'Proportional to an attribute value'
  )

  await filter.removeFilter(
    GridLabelsAndFilters.requestType.filterTestId,
    'Category listing'
  )
  await filter.removeFilter(GridLabelsAndFilters.isActive.filterTestId, true)
  await filter.removeFilter(
    GridLabelsAndFilters.localizedCatalogs.filterTestId,
    'COM French Catalog'
  )


  await filter.addFilter(
    GridLabelsAndFilters.name.filterTestId,
    'Boost "Tank dress"'
  )

  await grid.pagination.expectToHaveCount(1)

  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.name.gridLabel,
      value: 'Boost "Tank dress"',
    },
  ])

  await filter.clearFilters()
  await grid.pagination.expectToHaveCount(defaultRowCount)

  const createButton = page.getByTestId('createButtonResourceGrid')

  /*
      Create Boost
  */
  await createButton.click()
  await expect(page).toHaveURL('/admin/merchandize/boost/create')

  // isActive Switch
  const isActiveSwitch = new Switch(page, 'isActive')
  await isActiveSwitch.expectToBeChecked()
  await isActiveSwitch.disable()
  await isActiveSwitch.enable()

  // Boost Preview
  const previewFieldSet = page.getByTestId('previewFieldSet')
  await expect(
    previewFieldSet.getByTestId('previewRequiredMessage')
  ).toBeVisible()

  // name InputText
  const nameInput = page.getByTestId('name')
  const newName = randomUUID()

  await expect(nameInput).toBeEmpty()
  await nameInput.fill(newName)
  await expect(nameInput).toHaveValue(newName)

  // // Localized Catalogs Multiple Dropdown
  const localizedCatalogs = new Dropdown(page, 'localizedCatalogs', true)
  await localizedCatalogs.selectValue([
    'COM French Catalog',
    'COM English Catalog',
    'FR French Catalog',
    'EN French Catalog',
  ])

  // Request types Multiple Dropdown
  const requestTypesDropdown = new Dropdown(page, 'requestTypesDropdown', true)
  await requestTypesDropdown.selectValue(['Category listing', 'Search result'])

  // Model Dropdown
  const modelDropdown = new Dropdown(page, 'model')
  await modelDropdown.selectValue('Constant score')

  // Preview Boost Required Message
  await expect(
    previewFieldSet.getByTestId('previewRequiredMessage')
  ).not.toBeVisible()

  // Create the Boost and verify his existence
  const saveButton = page.getByTestId('submitButtonResourceForm')
  await saveButton.click()
  await expect(page).toHaveURL('/admin/merchandize/boost/grid')
  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.name.gridLabel,
      value: newName,
    },
  ])
  await filter.addFilter(GridLabelsAndFilters.name.filterTestId, newName)
  await grid.pagination.expectToHaveCount(1)

  /*
      Edit Boost
  */

  const editLink = page.locator("[data-testid='BoostTable'] a")
  await editLink.click()
  await expect(page).toHaveURL(/\/admin\/merchandize\/boost\/edit\?id=\d+$/)

  await localizedCatalogs.expectToHaveValue([
    'COM French Catalog',
    'COM English Catalog',
    'FR French Catalog',
    'EN French Catalog',
  ])
  await localizedCatalogs.clear()
  await localizedCatalogs.selectValue(['COM French Catalog'])

  await saveButton.click()
  const alertMessage = new AlertMessage(page)
  await alertMessage.expectToHaveText('Updating of the boost with success')

  const backButton = page.getByTestId('backButton')
  await backButton.click()
  await expect(page).toHaveURL('/admin/merchandize/boost/grid')
  /*
      Delete Boost
  */

  await filter.addFilter(GridLabelsAndFilters.name.filterTestId, newName)
  await grid.pagination.expectToHaveCount(1)
  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.name.gridLabel,
      value: newName,
    },
    {
      columnName: GridLabelsAndFilters.localizedCatalogs.gridLabel,
      value: 'COM French Catalog',
    },
  ])

  await editLink.click()

  const deleteButtonResourceForm = page.getByTestId('deleteButtonResourceForm')
  await deleteButtonResourceForm.click()
  await page.getByTestId('dialogConfirmButton').click()
  await expect(page).toHaveURL('/admin/merchandize/boost/grid')
  await filter.addFilter(GridLabelsAndFilters.name.filterTestId, newName)
  await grid.pagination.expectToHaveCount(0)
})
