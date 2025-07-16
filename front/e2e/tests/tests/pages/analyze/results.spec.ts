import { login } from '../../../helper/auth'
import { Dropdown } from '../../../helper/dropdown'
import { Grid } from '../../../helper/grid'
import { navigateTo } from '../../../helper/menu'
import { test, expect } from '@playwright/test'

const gridLabels = ['Code', 'Image', 'Name', 'Score', 'Stock', 'Price']

test('Search Configuration attributes', async ({ page }) => {
  await login(page)
  await navigateTo(page, 'Results', '/admin/analyze/results')

  const localizedCatalogDropdown = new Dropdown(
    page,
    'localizedCatalogDropdown'
  )
  const requestTypeDropdown = new Dropdown(page, 'requestTypeDropdown')
  const searchTermInput = page.getByTestId('searchTermsInputText')
  const categoryDropdown = new Dropdown(page, 'categoryTreeSelector')

  const explainButton = page.getByTestId('explainButton')

  const productsPreviewGrid = new Grid(page, 'productsPreviewBottomTable')

  await expect(page.getByTestId('productsPreviewBottomTable')).not.toBeVisible()
  await requestTypeDropdown.expectToHaveOptions([
    'Category listing',
    'Search result',
  ])

  await requestTypeDropdown.expectToHaveValue('Search result')
  await expect(searchTermInput).toBeVisible()
  await expect(page.getByTestId('categoryTreeSelector')).not.toBeVisible()

  await requestTypeDropdown.selectValue('Category listing')
  await expect(searchTermInput).not.toBeVisible()
  await expect(page.getByTestId('categoryTreeSelector')).toBeVisible()

  await requestTypeDropdown.selectValue('Search result')
  await expect(searchTermInput).toBeVisible()
  await expect(page.getByTestId('categoryTreeSelector')).not.toBeVisible()
  await expect(explainButton).toBeVisible()
  await explainButton.click()
  await expect(page.getByTestId('searchTermsInputTextErrorMessage')).toHaveText(
    'The value is required',
    { useInnerText: true }
  )
  await searchTermInput.fill('Dress')
  await explainButton.click()

  const request = await (
    await page.waitForResponse(
      (response) =>
        response.url() ===
          `${
            process.env.API_SERVER_BASE_URL || 'https://gally.local'
          }/graphql` && response.status() === 200
    )
  ).json()

  await expect(page.getByTestId('productsPreviewBottomTable')).toBeVisible()
  await productsPreviewGrid.expectHeadersToBe(gridLabels)
  const firstScoreProduct = page.getByTestId('scoreValue').first()
  const lastScoreProduct = page.getByTestId('scoreValue').last()
  await expect(
    Number(await firstScoreProduct.innerText())
  ).toBeGreaterThanOrEqual(Number(await lastScoreProduct.innerText()))

  const firstProduct = page
    .locator("[data-testid='productsPreviewBottomTable'] tbody tr")
    .first()
  await firstProduct.click()

  const selectedProductName = await (
    await firstProduct.getByTestId('name')
  ).innerText()
  const selectedProductCode = await (
    await firstProduct.getByTestId('sku')
  ).innerText()

  const selectedProductPrice = await (
    await firstProduct.getByTestId('price')
  ).innerText()

  const selectedProductStock = await (
    await firstProduct.getByTestId('stock')
  ).innerText()

  const tableRowPopInDialogContent = page.getByTestId(
    'tableRowPopInDialogContent'
  )
  await expect(tableRowPopInDialogContent).toBeVisible()

  const explainDetailsProductName =
    tableRowPopInDialogContent.getByTestId('explainDetailsName')
  const explainDetailsProductCode =
    tableRowPopInDialogContent.getByTestId('explainDetailsCode')
  const explainDetailsProductPrice = tableRowPopInDialogContent.getByTestId(
    'explainDetailsPrice'
  )
  const explainDetailsProductStock = tableRowPopInDialogContent.getByTestId(
    'explainDetailsStock'
  )

  await expect(explainDetailsProductName).toHaveText(selectedProductName)
  await expect(explainDetailsProductCode).toHaveText(
    `Code: ${selectedProductCode}`
  )
  await expect(explainDetailsProductPrice).toHaveText(
    `Price: ${selectedProductPrice}`
  )
  await expect(explainDetailsProductStock).toHaveText(
    `Stock: ${selectedProductStock}`
  )

  const matchTable = tableRowPopInDialogContent.getByTestId(
    'matchesReadOnlyTable'
  )
  const indexedContentReadOnlyTable = tableRowPopInDialogContent.getByTestId(
    'indexedContentReadOnlyTable'
  )

  const indexedContentCollapseButton = tableRowPopInDialogContent.getByTestId(
    'indexedContentCollapseButton'
  )
  await expect(
    matchTable.locator('thead tr > td').filter({ hasText: /\S/ })
  ).toHaveText(['Field', 'Term', 'Weight', 'Score'], {
    useInnerText: true,
  })

  await indexedContentCollapseButton.click()
  await expect(indexedContentReadOnlyTable).toBeVisible()

  await expect(
    indexedContentReadOnlyTable
      .locator('thead tr > td')
      .filter({ hasText: /\S/ })
  ).toHaveText(['Field', 'Source'], {
    useInnerText: true,
  })

  const closeExplainDetailsButton = page.getByTestId(
    'tableRowPopInDialogCloseButton'
  )
  await closeExplainDetailsButton.click()
  await expect(tableRowPopInDialogContent).not.toBeVisible()
  const explainQueryDetailsOpenPopinButton = page.getByTestId(
    'exmplainQueryDetailsOpenPopinButton'
  )

  await explainQueryDetailsOpenPopinButton.click()
  await expect(
    page.getByTestId('explainQueryDetailsDialogContent')
  ).toBeVisible()

  const matchesReadOnlyTableCollapseSubRowButtons = await matchTable
    .getByTestId('matchesReadOnlyTableCollapseSubRowButton')
    .all()
  matchesReadOnlyTableCollapseSubRowButtons.forEach(
    async (collapseButton) => await collapseButton.click()
  )

  const clipboardText = await page.evaluate(async () => {
    return await navigator.clipboard.readText()
  })

  const explainQueryDetailsCopyToClipBoardButton = page.getByTestId(
    'explainQueryDetailsCopyToClipBoardButton'
  )
  await expect(clipboardText).toBe('')
  await explainQueryDetailsCopyToClipBoardButton.click()

  const newClipboardText = await page.evaluate(async () => {
    return await navigator.clipboard.readText()
  })

  await expect(
    request.data.explain.explainData.elasticSearchQuery.query
  ).toEqual(newClipboardText)

  const explainQueryDetailsDialogCloseButton = page.getByTestId(
    'explainQueryDetailsDialogCloseButton'
  )
  await explainQueryDetailsDialogCloseButton.click()
  await expect(
    page.getByTestId('explainQueryDetailsDialogContent')
  ).not.toBeVisible()
})
