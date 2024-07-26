import { test, expect } from '@playwright/test'
import { randomUUID } from 'crypto'
import { login } from '../helper/auth'
import { navigateTo } from '../helper/menu'
import { Dropdown } from '../helper/dropdown'

test('Boosts', async ({ page }) => {
  await login(page)
  await navigateTo(page, 'Boosts', '/fr/admin/merchandize/boost/grid')

  const createButton = await page.getByTestId('createButtonResourceGrid')

  /*
      Grid Boost
  */
  // TO DO

  /*
      Create Boost
  */
  await createButton.click()
  await expect(page).toHaveURL('/fr/admin/merchandize/boost/create')

  // isActive Switch
  const isActiveInput = await page.getByTestId('isActive')
  const isActiveCheckbox = await isActiveInput.locator("input[type='checkbox']")

  await expect(isActiveCheckbox).toBeChecked()
  await isActiveInput.click()
  await expect(isActiveCheckbox).not.toBeChecked()
  await isActiveInput.click()
  await expect(isActiveCheckbox).toBeChecked()

  // Boost Preview
  const previewFieldSet = await page.getByTestId('previewFieldSet')
  await expect(
    await previewFieldSet.getByTestId('previewRequiredMessage')
  ).toBeVisible()

  // name InputText
  const nameInput = await page.getByTestId('name')
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
  await modelDropdown.selectValue('Constante')

  // Preview Boost Required Message
  await expect(
    await previewFieldSet.getByTestId('previewRequiredMessage')
  ).not.toBeVisible()

  // Create the Boost and verify his existence
  const saveButton = await page.getByTestId('submitButtonResourceForm')
  await saveButton.click()  
  await expect(page).toHaveURL('/fr/admin/merchandize/boost/grid')
  await expect(await page.getByText(newName)).toBeDefined() // TO DO : Manipulate the grid instead of research in the page.

  /*
      Edit Boost
  */
  // TO DO

  /*
      Delete Boost
  */
  // TO DO
})
