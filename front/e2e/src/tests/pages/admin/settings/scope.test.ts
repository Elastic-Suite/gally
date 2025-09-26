import { Page, expect, test } from '@playwright/test'
import { UserRole, runTestsAsRoles } from '../../../../helper/auth'
import { TestId, generateTestId } from '../../../../helper/testIds'
import { navigateTo } from '../../../../helper/menu'

const existingCatalogs: Record<string, string[]> = {
  'COM': ['French (France)', 'English (United States)', 'Spanish (Spain)', 'Italian (Italy)', 'German (Germany)', 'Dutch (Netherlands)', 'Polish (Poland)'],
  'FR': ['French (France)', 'English (United States)', 'Spanish (Spain)', 'Italian (Italy)', 'German (Germany)', 'Dutch (Netherlands)', 'Polish (Poland)'],
  'UK': ['French (France)', 'English (United States)', 'Spanish (Spain)', 'Italian (Italy)', 'German (Germany)', 'Dutch (Netherlands)', 'Polish (Poland)'],
}

const expectedActiveLocales: string[] = ['French (France)', 'English (United States)', 'Spanish (Spain)', 'Italian (Italy)', 'German (Germany)', 'Dutch (Netherlands)', 'Polish (Poland)']

const expectedTestValues = {
  urls: {
    parametersPage: '/admin/settings/scope/catalogs',
  },
  texts: {
    settingsMenu: 'Settings',
    defaultTab: 'Scope',
    attributesTab: 'Searchable and filterable attributes',
    totalCatalogs: '3 catalogs',
    expectedActiveLocales: "7\nactive locales"
  },
  buttons: {
    activeLocales: 'Active locales',
  }
}

// Mock data with additional languages
const extraLocalizedCatalogs = [
  {
    locale: "es_ES",
    localName: "Spanish (Spain)",
    currency: "EUR",
    namePrefix: "Spanish"
  },
  {
    locale: "it_IT",
    localName: "Italian (Italy)",
    currency: "EUR",
    namePrefix: "Italian"
  },
  {
    locale: "de_DE",
    localName: "German (Germany)",
    currency: "EUR",
    namePrefix: "German"
  },
  {
    locale: "nl_NL",
    localName: "Dutch (Netherlands)",
    currency: "EUR",
    namePrefix: "Dutch"
  },
  {
    locale: "pl_PL",
    localName: "Polish (Poland)",
    currency: "EUR",
    namePrefix: "Polish"
  }
]

function addExtraLocalizedCatalogs(originalResponse: any): any {
  const response = JSON.parse(JSON.stringify(originalResponse))
  response["hydra:member"].forEach((catalog: any) => {
    const catalogCode = catalog.code
    let nextId = Math.max(...catalog.localizedCatalogs.map((lc: any) => lc.id)) + 1

    extraLocalizedCatalogs.forEach((extraLocale) => {
      const [localeCode] = extraLocale.locale.split('_')
      const newLocalizedCatalog = {
        "@id": `/api/localized_catalogs/${nextId}`,
        "@type": "LocalizedCatalog",
        "id": nextId,
        "name": `${catalog.name.split(' ')[0]} ${extraLocale.namePrefix} Catalog`,
        "code": `${catalogCode}_${localeCode}`,
        "locale": extraLocale.locale,
        "currency" : extraLocale.currency,
        "isDefault": false,
        "localName": extraLocale.localName
      }

      catalog.localizedCatalogs.push(newLocalizedCatalog)
      nextId++
    })
  })

  return response
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

  await test.step('Check + button shows all locales', async () => {
    const existingCatalog = page.getByTestId(generateTestId(TestId.CATALOGS, 'com'))

    // Try to find the first hidden language element
    const firstHiddenLocale = 'Dutch (Netherlands)'
    const firstHiddenLocaleElement = existingCatalog.getByTestId(generateTestId(TestId.LANGUAGE, firstHiddenLocale))

    // Check if the German element exists and is visible
    await firstHiddenLocaleElement.isVisible()
    await expect(firstHiddenLocaleElement).toBeDefined()
    await expect(firstHiddenLocaleElement).toContainText('+2')

    await firstHiddenLocaleElement.click()
    // Test id is built from all available locales, so if the popin is located the test is OK
    const otherLocalesPopin = page.getByTestId(generateTestId(TestId.POPIN_CATALOGS, existingCatalogs.COM.join('|')))
    await expect(otherLocalesPopin).toBeVisible()
  })

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

test.beforeEach(async ({ context }) => {
  // Intercept the API call and modify the real response
  await context.route('**/api/catalogs*', async route => {
    const response = await route.fetch()
    const originalData = await response.json()
    const modifiedData = addExtraLocalizedCatalogs(originalData)

    await route.fulfill({
      status: 200,
      contentType: 'application/ld+json',
      body: JSON.stringify(modifiedData)
    })
  })
});

test.describe('Parameters Page', () => {
  runTestsAsRoles([UserRole.ADMIN, UserRole.CONTRIBUTOR], async (page: Page) => {
    await testParametersPage(page)
  })
})
