import { Page, expect, test } from '@playwright/test'
import { UserRole, runTestsAsRoles } from '../../helper/auth'
import { TestId, generateTestId } from '../../helper/testIds'
import { navigateTo } from '../../helper/menu'

const existingCatalogs: Record<string, string[]> = {
  'COM': ['Français (France)', 'Anglais (États-Unis)'],
  'FR': ['Français (France)', 'Anglais (États-Unis)'],
  'UK': ['Français (France)', 'Anglais (États-Unis)'],
}

const expectedActiveLocales: string[] = ['Français (France)', 'Anglais (États-Unis)']

const expectedTestValues = {
  urls: {
    parametersPage: 'fr/admin/settings/scope/catalogs',
  },
  texts: {
    settingsMenu: 'Paramètres',
    defaultTab: 'Contextes',
    attributesTab: 'Attributs recherchables et filtrables',
    totalCatalogs: '3 catalogues',
    expectedActiveLocales: "2\nlangues actives"
  },
  buttons: {
    activeLocales: 'Langues actives',
  }
}


async function testParametersPage(page: Page): Promise<void> {

  await test.step('Navigate to parameters page' , async () => {
    await navigateTo(page, expectedTestValues.texts.settingsMenu, expectedTestValues.urls.parametersPage)
  })

  await test.step('Check existing tabs and default tab is scope' , async () => {
    await test.step('Check tabs', async () => {
      const defaultSelectedTabIsScope = page.getByRole('tab', { name: expectedTestValues.texts.defaultTab, selected: true })
      await expect(defaultSelectedTabIsScope).toBeDefined()
    })

    const otherTabIsAttributes = page.getByRole('tab', { name: expectedTestValues.texts.attributesTab })
    await expect(otherTabIsAttributes).toBeDefined()
  })

  test.step('Check navigation to scope tab show expected data', async () => {
    const scopeTab = page.getByRole('tab', {
      name: expectedTestValues.texts.defaultTab,
      selected: true,
    })
    await expect(scopeTab).toBeDefined()
    await scopeTab.click()

    const totalCatalogs = await page.getByText(
      expectedTestValues.texts.totalCatalogs
    )
    await expect(totalCatalogs).toBeDefined()

    for (const catalog of Object.keys(existingCatalogs)) {
      // eslint-disable-next-line no-await-in-loop
      const existingCatalog = await page.getByTestId(generateTestId(TestId.CATALOGS, catalog))
      // eslint-disable-next-line no-await-in-loop
      await expect(existingCatalog).toBeDefined()

      const associatedLocales = existingCatalogs[catalog]
      for (const locale of associatedLocales) {
        const associatedLocaleElement = existingCatalog.getByTestId(generateTestId(TestId.LANGUAGE, locale))
        // eslint-disable-next-line no-await-in-loop
        await expect(associatedLocaleElement).toBeDefined()
      }
    }
  })

  /* await test.fixme('Check + button shows all locales', async () => {
    // Not enough locales to show this button
  }) */

  await test.step('Check navigation to active locales subtab show expected data', async () => {
    const activeLocalesButton = await page.getByRole('button', { name: expectedTestValues.buttons.activeLocales })
    expect(activeLocalesButton).toBeDefined()
    await activeLocalesButton.click()

    for (const activeLocale in expectedActiveLocales) {
      const activeLocaleElement = await page.getByTestId(generateTestId(TestId.LANGUAGE, activeLocale))
      await expect(activeLocaleElement).toBeDefined()
    }

    const hasTotalLocalesShown = await page.getByTestId(generateTestId(TestId.NB_ACTIVE_LOCALES)).and(page.locator(':visible'))
    await expect(hasTotalLocalesShown).toBeDefined()
    await expect(hasTotalLocalesShown).toHaveText(expectedTestValues.texts.expectedActiveLocales, {
      useInnerText: true,
    })
  })
}

test.describe('Parameters Page', () => {
  runTestsAsRoles([UserRole.ADMIN, UserRole.CONTRIBUTOR], async (page: Page) => {
    await testParametersPage(page)
  })
})
