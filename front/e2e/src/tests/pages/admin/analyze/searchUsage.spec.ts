import { Locator, Page, expect, test } from '@playwright/test'
import { login } from '../../../../utils/auth'
import { navigateTo } from '../../../../utils/menu'
import {
  TestId,
  generateTestId,
  joinItemIds,
} from '../../../../utils/testIds'
import { Dropdown } from '../../../../helper/dropdown'

const kpis = [
  'searchCount',
  'categoryViewCount',
  'productViewCount',
  'addToCartCount',
  'orderCount',
  'sessionCount',
  'visitorCount',
  'sessionsWithSearchPercentage',
  'averageSearchesPerSession'
]

const kpisTestIds = kpis.reduce((acc: Record<string, string>, v) => {
  acc[v] = generateTestId(TestId.KPI, v)
  return acc
}, {})

// Each widget's test ids end with its kind and its place in the dashboard
// layout (the ids of its layout nodes, from the top), as SearchUsage.tsx
// builds them. The same widget placed twice gets different ids.
const widgetIds = {
  popularSearchTerms: joinItemIds('popularSearchTerms', 'popularSearchTerms'),
  zeroResult: joinItemIds('zeroResult', 'zeroResult'),
  sessions: joinItemIds('sessions', 'charts', 'sessions'),
  conversionRate: joinItemIds('conversionRate', 'charts', 'conversionRate'),
}

interface TermsTableTestIds {
  container: string
  table: string
  seeAllButton: string
  allTermsTable: string
  allTermsCloseButton: string
  noData: string
}

function getTermsTableTestIds(widgetId: string): TermsTableTestIds {
  return {
    container: generateTestId(TestId.KPI_TERMS_TABLE, widgetId),
    table: generateTestId(TestId.READ_ONLY_TABLE, widgetId),
    seeAllButton: generateTestId(TestId.KPI_SEE_ALL_BUTTON, widgetId),
    // The "see all" popup adds "all" to the widget's ids.
    allTermsTable: generateTestId(TestId.READ_ONLY_TABLE, widgetId, 'all'),
    allTermsCloseButton: generateTestId(
      TestId.DIALOG_CLOSE_BUTTON,
      widgetId,
      'all'
    ),
    noData: generateTestId(TestId.NO_DATA, widgetId),
  }
}

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
  layoutCards: [
    generateTestId(TestId.KPI_LAYOUT_CARD, 'popularSearchTerms'),
    generateTestId(TestId.KPI_LAYOUT_CARD, 'zeroResult'),
    generateTestId(TestId.KPI_LAYOUT_CARD, 'charts', 'sessions'),
    generateTestId(TestId.KPI_LAYOUT_CARD, 'charts', 'conversionRate'),
  ],
  charts: {
    sessions: generateTestId(TestId.CHART, widgetIds.sessions),
    conversionRate: generateTestId(TestId.CHART, widgetIds.conversionRate),
  },
  termsTables: {
    zeroResult: getTermsTableTestIds(widgetIds.zeroResult),
    popularSearchTerms: getTermsTableTestIds(widgetIds.popularSearchTerms),
  },
  createThesaurusButton: generateTestId(
    TestId.KPI_CREATE_THESAURUS_BUTTON,
    widgetIds.zeroResult
  ),
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
      value: 74,
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
      label: 'Sessions',
      value: 48,
    },
    visitorCount: {
      label: 'Unique visitors',
      value: 32,
    },
    sessionsWithSearchPercentage: {
      label: 'Sessions with search',
      value: '72.92%',
    },
    averageSearchesPerSession: {
      label: 'Searches per session',
      value: 2.11,
    },
  },
  catalogComFrFilteredKpis: {
    searchCount: {
      label: 'Searches',
      value: 8,
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
      value: 18,
    },
    categoryViewCount: {
      label: 'Category views',
      value: 2,
    },
  },
  charts: {
    sessions: {
      title: 'Sessions with and without search',
      // Same data as the "Sessions with search" KPI above.
      values: ['72.92 %', '27.08 %'],
      legend: ['Sessions with search', 'Sessions without search'],
    },
    conversionRate: {
      // The bar chart shows no value as text, only its axis and legend.
      title: 'Conversion rate',
      values: [],
      legend: ['Global', 'With search', 'Without search'],
    },
  },
  // Row counts with no filter: the page shows the first 10 terms, the popup
  // shows them all. Terms are sorted by sessions, highest first, then by term.
  termsTables: {
    zeroResult: {
      title: '0 result search terms',
      columns: ['Term', 'Sessions', 'Unique visitors'],
      rowCount: 6,
      allTermsRowCount: 6,
      // Term, sessions, unique visitors.
      rows: [
        ['walkman', '5', '4'],
        ['baladeur', '2', '2'],
        ['chromecast', '2', '2'],
        ['hoverboard', '2', '2'],
        ['smartwatch', '2', '2'],
        ['tablette', '1', '1'],
      ],
      noData: 'No data yet for these filters.',
    },
    popularSearchTerms: {
      title: 'Popular search terms',
      columns: [
        'Term',
        'Sessions',
        'Unique visitors',
        'Nb results (avg.)',
        'Conv. rate',
      ],
      rowCount: 10,
      allTermsRowCount: 52,
    },
  },
  thesaurusUrl: '/admin/search/thesaurus/grid',
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

function resetDropdowns(): void {
  catalogDropdown = null
  localizedCatalogDropdown = null
}

test.beforeEach(() => {
  resetDropdowns()
})

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

async function checkChart(
  page: Page,
  chartTestId: string,
  {
    title,
    values,
    legend,
  }: { title: string; values: readonly string[]; legend: readonly string[] }
): Promise<void> {
  const chart = page.getByTestId(chartTestId)
  await expect(chart).toBeVisible()
  await expect(chart).toContainText(title)
  const texts = [...values, ...legend]
  for (let i = 0; i < texts.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await expect(chart).toContainText(texts[i])
  }
}

async function checkTermsTable(
  page: Page,
  tableTestIds: TermsTableTestIds,
  {
    title,
    columns,
    rowCount,
  }: { title: string; columns: readonly string[]; rowCount: number }
): Promise<void> {
  await expect(page.getByTestId(tableTestIds.container)).toContainText(title)
  const table = page.getByTestId(tableTestIds.table)
  for (let i = 0; i < columns.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await expect(table).toContainText(columns[i])
  }
  await expect(table.locator('tbody tr')).toHaveCount(rowCount)
  await expect(page.getByTestId(tableTestIds.seeAllButton)).toBeVisible()
}

async function checkTermsRows(
  page: Page,
  tableTestIds: TermsTableTestIds,
  rows: readonly (readonly string[])[]
): Promise<void> {
  const tableRows = page.getByTestId(tableTestIds.table).locator('tbody tr')
  for (let i = 0; i < rows.length; i++) {
    const cells = tableRows.nth(i).locator('td')
    for (let j = 0; j < rows[i].length; j++) {
      // eslint-disable-next-line no-await-in-loop
      await expect(cells.nth(j)).toHaveText(rows[i][j])
    }
  }
}

async function checkEmptyTermsTable(
  page: Page,
  tableTestIds: TermsTableTestIds,
  { title, noData }: { title: string; noData: string }
): Promise<void> {
  await expect(page.getByTestId(tableTestIds.container)).toContainText(title)
  await expect(page.getByTestId(tableTestIds.noData)).toHaveText(noData)
  await expect(page.getByTestId(tableTestIds.table)).toBeHidden()
  await expect(page.getByTestId(tableTestIds.seeAllButton)).toBeHidden()
}

async function checkAllTermsPopIn(
  page: Page,
  tableTestIds: TermsTableTestIds,
  allTermsRowCount: number
): Promise<void> {
  await page.getByTestId(tableTestIds.seeAllButton).click()
  const allTermsTable = page.getByTestId(tableTestIds.allTermsTable)
  await expect(allTermsTable.locator('tbody tr')).toHaveCount(
    allTermsRowCount
  )
  await page.getByTestId(tableTestIds.allTermsCloseButton).click()
  await expect(allTermsTable).toBeHidden()
}

async function submitFilters(page: Page): Promise<void> {
  const submitButton = page.getByTestId(testIds.filters.submitButton)
  const kpisResponse = page.waitForResponse('**/api/kpis**')
  await submitButton.click()
  await kpisResponse
}

async function resetFilters(page: Page): Promise<void> {
  const submitButton = page.getByTestId(testIds.filters.resetButton)
  const kpisResponse = page.waitForResponse('**/api/kpis**')
  await submitButton.click()
  await kpisResponse
}

test(
  'Pages > Analyze > Search usage page',
  { tag: ['@premium'] },
  async ({ page }) => {
    await test.step('Login and navigate to the search usage page', async () => {
      await login(page)
      await navigateTo(page, texts.labelMenuPage, '/admin/analyze/search_usage')
    })

    await test.step('Check filters, KPI group, and KPIS existence', async () => {
      expect(page.getByTestId(testIds.filtersContainer)).toBeTruthy()
      const catalogSwitcher = getCatalogDropdown(page)
      await catalogSwitcher.expectToBeVisible()
      const doubleDatePicker = getDoubleDatePicker(page)
      await expect(doubleDatePicker.from).toBeVisible()
      await expect(doubleDatePicker.to).toBeVisible()
      const submitButton = page.getByTestId(testIds.filters.submitButton)
      await expect(submitButton).toBeVisible()
      await expect(page.getByTestId(testIds.kpiGroup)).toBeVisible()

      // wait for kpi animations to be completed
      await page.waitForTimeout(200)

      for (let i = 0; i < kpis.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await checkKpi(page, testIds.kpis[kpis[i]], texts.kpis[kpis[i]])
      }
    })

    await test.step('Check the sessions and conversion rate charts', async () => {
      for (let i = 0; i < testIds.layoutCards.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        await expect(page.getByTestId(testIds.layoutCards[i])).toBeVisible()
      }
      await checkChart(page, testIds.charts.sessions, texts.charts.sessions)
      await checkChart(
        page,
        testIds.charts.conversionRate,
        texts.charts.conversionRate
      )
    })

    await test.step('Check the 0 result and popular search terms tables', async () => {
      await checkTermsTable(
        page,
        testIds.termsTables.zeroResult,
        texts.termsTables.zeroResult
      )
      await checkTermsRows(
        page,
        testIds.termsTables.zeroResult,
        texts.termsTables.zeroResult.rows
      )
      await checkTermsTable(
        page,
        testIds.termsTables.popularSearchTerms,
        texts.termsTables.popularSearchTerms
      )
      await expect(page.getByTestId(testIds.createThesaurusButton)).toBeVisible()
    })

    await test.step('Open and close the full lists of search terms', async () => {
      await checkAllTermsPopIn(
        page,
        testIds.termsTables.zeroResult,
        texts.termsTables.zeroResult.allTermsRowCount
      )
      await checkAllTermsPopIn(
        page,
        testIds.termsTables.popularSearchTerms,
        texts.termsTables.popularSearchTerms.allTermsRowCount
      )
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
      await checkEmptyTermsTable(
        page,
        testIds.termsTables.zeroResult,
        texts.termsTables.zeroResult
      )
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

    // Last step: the button leaves the page.
    await test.step('Create thesaurus button opens the thesaurus list', async () => {
      await page.getByTestId(testIds.createThesaurusButton).click()
      await expect(page).toHaveURL(new RegExp(`${texts.thesaurusUrl}$`))
    })
  }
)
