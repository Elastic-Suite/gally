import { ICatalog, IHydraResponse } from '@elastic-suite/gally-admin-shared'
import { test, expect } from '@playwright/test'
import { randomUUID } from 'crypto'
import { login } from '../helper'

test.describe('Boost Page', () => {
  test('Check redirection to boost grid page and presence of "Create a new boost" button', async ({
    page,
  }) => {
    await login(page)

    await page.getByTestId('sidebarMenu').locator('a:has-text("Boost")').click()

    await expect(page).toHaveURL('/fr/admin/merchandize/boost/grid')

    const createBoostButton = await page.getByTestId('createButtonResourceGrid')
    await expect(createBoostButton).toBeVisible()
  })

  test('Create Boost', async ({ page }) => {
    await page.route('**/*', (route) => {
      const headers = {
        ...route.request().headers(),
        'Cache-Control': 'no-cache',
      }
      route.continue({ headers })
    })

    await login(page)

    await page.getByTestId('sidebarMenu').locator('a:has-text("Boost")').click()

    const catalogs: IHydraResponse<ICatalog> = await (
      await page.waitForResponse(
        (response) =>
          response.url() === `${process.env.API_SERVER_BASE_URL}/catalogs` &&
          response.ok()
      )
    ).json()

    await expect(page).toHaveURL('/fr/admin/merchandize/boost/grid')
    await (
      await page.getByTestId('tablePagination').all()
    )[0]

    const createBoostButton = await page.getByTestId('createButtonResourceGrid')
    await createBoostButton.click()

    const switchIsActive = await page.getByTestId('isActive')

    await expect(await switchIsActive.locator('input')).toBeChecked()
    await switchIsActive.click()
    await expect(await switchIsActive.locator('input')).not.toBeChecked()
    await switchIsActive.click()
    await expect(await switchIsActive.locator('input')).toBeChecked()

    const modelInput = await page.getByTestId('modelInputText')
    await expect(await modelInput.getAttribute('placeholder')).toBe(
      'Sélectionnez un modèle'
    )

    await expect(modelInput).toBeEmpty()
    await modelInput.click()
    await page.getByText('Constante').click()
    await expect(await modelInput.inputValue()).toBe('Constante')

    const modelConfig = await page.getByTestId('modelConfig')
    await expect(modelConfig).toBeVisible()
    await expect(await modelConfig.locator('input').inputValue()).toBe('0')

    await expect(
      await page.getByText('Veuillez remplir les champs requis')
    ).toBeVisible()

    const boostName = randomUUID()
    const nameInput = await page.getByTestId('name')
    await nameInput.fill(boostName)

    await expect(await nameInput.inputValue()).toBe(boostName)
    const localizedCatalogsInput = await page.getByTestId(
      'localizedCatalogsInputText'
    )

    await expect(await localizedCatalogsInput).toBeEmpty()
    await localizedCatalogsInput.click()
    const catalogGroupTitles = await page
      .getByTestId('localizedCatalogsGroupTitle')
      .allInnerTexts()
    await expect(catalogGroupTitles).toEqual(
      catalogs['hydra:member'].map((catalog) => catalog.name)
    )

    const catalogsCheckbox = await page
      .getByTestId('localizedCatalogsCheckbox')
      .all()
    await catalogsCheckbox[0].click()
    await catalogsCheckbox[1].click()

    expect(
      await page.getByTestId('localizedCatalogsCheckbox').allInnerTexts()
    ).toEqual(
      catalogs['hydra:member']
        .map((catalog) =>
          catalog.localizedCatalogs.map(
            (localizedCatalog) => localizedCatalog.name
          )
        )
        .flat()
    )
    let catalogsTags = await page
      .getByTestId('localizedCatalogsTag')
      .allInnerTexts()

    expect(catalogsTags).toEqual([
      await catalogsCheckbox[0].innerText(),
      await catalogsCheckbox[1].innerText(),
    ])
    await catalogsCheckbox[0].click()
    catalogsTags = await page
      .getByTestId('localizedCatalogsTag')
      .allInnerTexts()
    expect(catalogsTags).toEqual([await catalogsCheckbox[1].innerText()])
    await catalogsCheckbox[0].click()

    const requestTypesDropdownInputText = await page.getByTestId(
      'requestTypesDropdownInputText'
    )
    await requestTypesDropdownInputText.click()

    const requestTypeCheckboxList = await page.getByTestId(
      'requestTypesDropdownCheckbox'
    )

    for (const tag of await requestTypeCheckboxList.all()) await tag.click()

    await expect(
      await page.getByTestId('requestTypesDropdownTag').allInnerTexts()
    ).toEqual(await requestTypeCheckboxList.allInnerTexts())

    const submitButton = await page.getByTestId('submitButtonResourceForm')
    await submitButton.click()

    await expect(page).toHaveURL(
      `${process.env.SERVER_BASE_URL}/fr/admin/merchandize/boost/grid`
    )

    const newBoostName = await page.getByText(boostName)

    await expect(newBoostName).toBeVisible()
  })
})
