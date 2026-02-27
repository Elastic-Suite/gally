import { Locator, Page, expect, test } from '@playwright/test'
import { login } from '../../../../utils/auth'
import { navigateTo } from '../../../../utils/menu'
import { TestId, generateTestId } from '../../../../utils/testIds'
import { Dropdown } from '../../../../helper/dropdown'

const kpis = [
  'searchCount',
  'categoryViewCount',
  'productViewCount',
  'addToCartCount',
  'orderCount',
  'sessionCount',
  'visitorCount',
]

const kpisTestIds = kpis.reduce((acc: Record<string, string>, v) => {
  acc[v] = generateTestId(TestId.KPI, v)
  return acc
}, {})

const testIds = {
  filtersContainer: generateTestId(TestId.KPI_FILTERS),
  filters: {
    catalogSwitcher: 'catalogSwitcher',
    localizedCatalogSwitcher: 'localizedCatalogSwitcher',
    datePickerFrom: generateTestId(
      TestId.INPUT_TEXT,
      TestId.RANGE_DATE_FROM,
      'period'
    ),
    datePickerTo: generateTestId(
      TestId.INPUT_TEXT,
      TestId.RANGE_DATE_TO,
      'period'
    ),
    submitButton: generateTestId(TestId.FILTER_APPLY_BUTTON, 'searchUsage'),
    resetButton: generateTestId(TestId.FILTER_CLEAR_BUTTON, 'searchUsage'),
  },
  kpiGroup: generateTestId(TestId.KPI_GROUP),
  kpis: kpisTestIds,
} as const

const texts = {
  labelMenuPage: 'Search usage',
  filtersToApply: {
    localizedCatalogs: ['COM French Catalog'],
    noResultsDateFrom: '02/02/2099',
    noResultsDateTo: '02/02/2099',
    someResultsDateFrom: '12/02/2025',
    someResultsDateTo: '12/03/2025',
  },
  kpis: {
    searchCount: {
      label: 'Searches',
      value: 21,
    },
    categoryViewCount: {
      label: 'Category views',
      value: 16,
    },
    productViewCount: {
      label: 'Product views',
      value: 52,
    },
    addToCartCount: {
      label: 'Products added to cart',
      value: 27,
    },
    orderCount: {
      label: 'Sales',
      value: 6,
    },
    sessionCount: {
      label: 'Page views',
      value: 30,
    },
    visitorCount: {
      label: 'Visitors',
      value: 15,
    },
  },
  catalogComFrFilteredKpis: {
    searchCount: {
      label: 'Searches',
      value: 4,
    },
    categoryViewCount: {
      label: 'Category views',
      value: 3,
    },
  },
  futureDateFilteredKpis: {
    searchCount: {
      label: 'Searches',
      value: 0,
    },
    categoryViewCount: {
      label: 'Category views',
      value: 0,
    },
  },
  validDateIntervalFilteredKpis: {
    searchCount: {
      label: 'Searches',
      value: 9,
    },
    categoryViewCount: {
      label: 'Category views',
      value: 2,
    },
  },
  catalogCom: 'COM Catalog',
  localizedCatalogFr: 'French (France)',
} as const

let catalogDropdown: Dropdown
function getCatalogDropdown(page: Page): Dropdown {
  if (!catalogDropdown) {
    catalogDropdown = new Dropdown(page, testIds.filters.catalogSwitcher)
  }
  return catalogDropdown
}

let localizedCatalogDropdown: Dropdown
function getLocalizedCatalogDropdown(page: Page): Dropdown {
  if (!localizedCatalogDropdown) {
    localizedCatalogDropdown = new Dropdown(
      page,
      testIds.filters.localizedCatalogSwitcher
    )
  }
  return localizedCatalogDropdown
}

function getDoubleDatePicker(page: Page): {
  from: Locator
  to: Locator
} {
  return {
    from: page.getByTestId(testIds.filters.datePickerFrom),
    to: page.getByTestId(testIds.filters.datePickerTo),
  }
}

async function checkKpi(
  page: Page,
  kpiTestId: string,
  { label, value }: { label: string; value: number }
): Promise<void> {
  const kpi = page.getByTestId(kpiTestId)
  // eslint-disable-next-line no-await-in-loop
  await expect(kpi).toContainText(`${label}${value}`)
}

async function submitFilters(page): Promise<void> {
  const submitButton = page.getByTestId(testIds.filters.submitButton)
  const kpisResponse = page.waitForResponse('**/api/kpis**')
  await submitButton.click()
  await kpisResponse
}

async function resetFilters(page): Promise<void> {
  const submitButton = page.getByTestId(testIds.filters.resetButton)
  const kpisResponse = page.waitForResponse('**/api/kpis**')
  await submitButton.click()
  await kpisResponse
}

test('Pages > Analyze > Search usage page', {tag: ['@premium']}, async ({page}) => {
  await test.step('Login and navigate to the search usage page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, '/admin/analyze/search_usage')
  })

  await test.step('Check filters, KPI group, and KPIS existence', async () => {
    expect(page.getByTestId(testIds.filtersContainer)).toBeTruthy()
    const catalogSwitcher = getCatalogDropdown(page)
    expect(catalogSwitcher).toBeTruthy()
    const doubleDatePicker = getDoubleDatePicker(page)
    expect(doubleDatePicker).toBeTruthy()
    const submitButton = page.getByTestId(testIds.filters.submitButton)
    expect(submitButton).toBeTruthy()
    await expect(page.getByTestId(testIds.kpiGroup)).toBeTruthy()

    // wait for kpi animations to be completed
    await page.waitForTimeout(200)

    for (let i = 0; i < kpis.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await checkKpi(page, testIds.kpis[kpis[i]], texts.kpis[kpis[i]])
    }
  })

  await test.step('Add catalog COM FR filter and check KPIs update', async () => {
    const catalogSwitcher = getCatalogDropdown(page)
    await catalogSwitcher.selectValue(texts.catalogCom)
    const localizedCatalogSwitcher = getLocalizedCatalogDropdown(page)
    await localizedCatalogSwitcher.selectValue(texts.localizedCatalogFr)

    await submitFilters(page)
    // wait for kpi animations to be completed
    await page.waitForTimeout(200)

    for (let i = 0; i <= 1; i++) {
      // eslint-disable-next-line no-await-in-loop
      await checkKpi(
        page,
        testIds.kpis[kpis[i]],
        texts.catalogComFrFilteredKpis[kpis[i]]
      )
    }
  })

  await test.step('Add valid date interval filter and check KPIs have values', async () => {
    const catalogSwitcher = getCatalogDropdown(page)
    await catalogSwitcher.clear()
    const doubleDatePicker = getDoubleDatePicker(page)
    await doubleDatePicker.from.fill(texts.filtersToApply.someResultsDateFrom)
    await doubleDatePicker.to.fill(texts.filtersToApply.someResultsDateTo)

    await submitFilters(page)
    // wait for kpi animations to be completed
    await page.waitForTimeout(200)

    for (let i = 0; i <= 1; i++) {
      // eslint-disable-next-line no-await-in-loop
      await checkKpi(
        page,
        testIds.kpis[kpis[i]],
        texts.validDateIntervalFilteredKpis[kpis[i]]
      )
    }
  })

  await test.step('Add future date filter and check KPIs have 0 value', async () => {
    const doubleDatePicker = getDoubleDatePicker(page)
    await doubleDatePicker.from.fill(texts.filtersToApply.noResultsDateFrom)
    await doubleDatePicker.to.fill(texts.filtersToApply.noResultsDateTo)

    await submitFilters(page)
    // wait for kpi animations to be completed
    await page.waitForTimeout(200)

    for (let i = 0; i <= 1; i++) {
      // eslint-disable-next-line no-await-in-loop
      await checkKpi(
        page,
        testIds.kpis[kpis[i]],
        texts.futureDateFilteredKpis[kpis[i]]
      )
    }
  })

  await test.step('Reset all filters and check KPIs have the starting value', async () => {
    await resetFilters(page)
    // wait for kpi animations to be completed
    await page.waitForTimeout(200)
    for (let i = 0; i < kpis.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await checkKpi(page, testIds.kpis[kpis[i]], texts.kpis[kpis[i]])
    }
  })
})
