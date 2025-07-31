import {login} from '../../../../helper/auth'
import {Dropdown} from '../../../../helper/dropdown'
import {Grid} from '../../../../helper/grid'
import {navigateTo} from '../../../../helper/menu'
import {expect, test} from '@playwright/test'
import {generateTestId, TestId} from "../../../../helper/testIds";

const testIds = {
  explainButton: generateTestId(TestId.BUTTON, 'explain'),
  searchTerms: generateTestId(TestId.INPUT_TEXT, 'searchTerms'),
  searchTermsHelperText: generateTestId(TestId.HELPER_TEXT, 'searchTerms'),
  localizedCatalogDropdown: generateTestId(TestId.DROPDOWN, 'localizedCatalog'),
  productsPreviewGrid: generateTestId(TestId.TABLE, 'productsPreviewBottom'),
  categoryTreeSelector: generateTestId(TestId.TREE_SELECTOR, 'category'),
  sku: generateTestId(TestId.OTHER_READABLE_FIELD, "sku"),
  name: generateTestId(TestId.OTHER_READABLE_FIELD, 'name'),
  price: generateTestId(TestId.PRICE, 'price'),
  stock: generateTestId(TestId.STOCK, 'stock'),
  score: generateTestId(TestId.SCORE, "score"),
  scoreContainer: generateTestId(TestId.SCORE_CONTAINER, "score"),
  explainDetails: {
    name: generateTestId(TestId.EXPLAIN_DETAILS_NAME),
    sku: generateTestId(
      TestId.EXPLAIN_DETAILS_GENERAL_INFORMATION,
      'sku'
    ),
    price: generateTestId(
      TestId.EXPLAIN_DETAILS_GENERAL_INFORMATION,
      'price'
    ),
    stock: generateTestId(
      TestId.EXPLAIN_DETAILS_GENERAL_INFORMATION,
      'stock'
    ),
    matchesReadOnlyTable: generateTestId(TestId.READ_ONLY_TABLE, 'matches'),
    indexedContentReadOnlyTable: generateTestId(TestId.READ_ONLY_TABLE, 'indexedContent'),
    indexedContentCollapseButton: generateTestId(TestId.IONICON, 'indexedContentCollapseButton'),
    dialogContent: generateTestId(TestId.DIALOG_CONTENT, 'tableRowPopIn'),
    dialogCloseButton: generateTestId(TestId.DIALOG_CLOSE_BUTTON, 'tableRowPopIn')
  },
  explainQueryDetails: {
    queryDetailsButton: generateTestId(TestId.BUTTON, 'queryDetails'),
    dialogContent: generateTestId(TestId.DIALOG_CONTENT, 'explainQueryDetails'),
    copyButton: generateTestId(TestId.BUTTON, 'copyExplainQueryToClipboard'),
    closeButton: generateTestId(TestId.DIALOG_CLOSE_BUTTON, 'explainQueryDetails')
  }
}

const componentIds = {
  requestTypeDropdown: 'requestType',
  categoryTreeSelector: 'category',
  productsPreview: 'productsPreviewBottom'
}

const texts = {
  termToSearch: 'Dress',
  labelMenuPage: 'Results',
  gridLabels: ['Code', 'Image', 'Name', 'Score', 'Stock', 'Price'],
  requestTypeOptions: {
    categoryListing: 'Category listing',
    searchResult: 'Search result',
  },
  errors: {
    required: 'The value is required',
  },
  explainDetails: {
    code: (code: string) => `Code: ${code}`,
    price: (price: string) => `Price: ${price}`,
    stock: (stock: string) => `Stock: ${stock}`,
    matchTableHeaders: ['Field', 'Term', 'Weight', 'Score'],
    indexedContentTableHeaders: ['Field', 'Source']
  }
}

const baseURL = process.env.API_SERVER_BASE_URL || 'https://gally.local'

test('Pages > Analyze > Results page', {tag: ['@premium']}, async ({page}) => {
  await test.step('Login and navigate to the explain page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, '/admin/analyze/results')
  })

  const localizedCatalogDropdown = new Dropdown(
    page,
    testIds.localizedCatalogDropdown,
  )
  const requestTypeDropdown = new Dropdown(page, componentIds.requestTypeDropdown)
  const searchTermInput = page.getByTestId(testIds.searchTerms)
  const categoryTreeSelector = page.getByTestId(testIds.categoryTreeSelector)
  const explainButton = page.getByTestId(testIds.explainButton)
  const productsPreviewGrid = new Grid(page, componentIds.productsPreview)

  await test.step('Verify RequestType dropdown and initial field visibilities', async () => {
    await requestTypeDropdown.expectToHaveOptions(Object.values(texts.requestTypeOptions))
    await expect(
      page.getByTestId(testIds.productsPreviewGrid)
    ).not.toBeVisible()
    await requestTypeDropdown.expectToHaveValue(texts.requestTypeOptions.searchResult)
    await expect(searchTermInput).toBeVisible()
    await expect(categoryTreeSelector).not.toBeVisible()
  })

  await test.step('Switch to "Category listing" and verify fields', async () => {
    await requestTypeDropdown.selectValue(texts.requestTypeOptions.categoryListing)
    await expect(searchTermInput).not.toBeVisible()
    await expect(categoryTreeSelector).toBeVisible()
  })

  await test.step('Switch back to "Search result" and verify fields', async () => {
    await requestTypeDropdown.selectValue(texts.requestTypeOptions.searchResult)
    await expect(searchTermInput).toBeVisible()
    await expect(categoryTreeSelector).not.toBeVisible()
    await expect(explainButton).toBeVisible()
  })

  await test.step('Trigger explain button with empty input and verify error', async () => {
    await explainButton.click()
    await expect(
      page.getByTestId(testIds.searchTermsHelperText)
    ).toHaveText(texts.errors.required, {useInnerText: true})
  })

  page.on('response', async response => {
    console.log(response.url())
    if (response.url().includes('graphql')) {
      const json = await response.json()
      console.log("RESPONSE GRAPHQL => ", await response.json())
      if (json.errors) {
        for (const error of json.errors) {
          console.error("loc", error.locations)
          console.error("path", error.path)
          console.error("ext", error.extensions)

        }
      } else {
        console.log("RESPONSE GRAPHQL => ", (await response.json()).data.explain.collection)

      }
    }
  })

  await test.step('Fill input and click explain', async () => {
    await searchTermInput.fill(texts.termToSearch)
    await explainButton.click()
  })

  const request = await test.step('Wait for GraphQL response', async () => {
    return await (
      await page.waitForResponse(
        (response) =>
          response.url() ===
          `${
            baseURL
          }/graphql` && response.status() === 200
      )
    ).json()
  })


  await test.step('Verify products grid is visible and sorted by score', async () => {
    await productsPreviewGrid.expectToBeVisible()
    await productsPreviewGrid.expectHeadersToBe(texts.gridLabels)
    const firstScoreProduct = page.getByTestId(testIds.scoreContainer).first()
    const lastScoreProduct = page.getByTestId(testIds.scoreContainer).last()
    await expect(
      Number(await firstScoreProduct.innerText())
    ).toBeGreaterThanOrEqual(Number(await lastScoreProduct.innerText()))
  })

  const firstProduct = page
    .locator(`[data-testid='${testIds.productsPreviewGrid}'] tbody tr`)
    .first()

  await test.step('Open product pop-in and capture values', async () => {
    await firstProduct.click()
  })

  const selectedProductName = await (
    await firstProduct.getByTestId(testIds.name)
  ).innerText()
  const selectedProductCode = await (
    await firstProduct.getByTestId(testIds.sku)
  ).innerText()
  const selectedProductPrice = await (
    await firstProduct.getByTestId(testIds.price)
  ).innerText()
  const selectedProductStock = await (
    await firstProduct.getByTestId(testIds.stock)
  ).innerText()

  await test.step('Check pop-in data matches selected product', async () => {
    const tableRowPopInDialogContent = page.getByTestId(
      testIds.explainDetails.dialogContent
    )
    await expect(tableRowPopInDialogContent).toBeVisible()

    await expect(
      tableRowPopInDialogContent.getByTestId(testIds.explainDetails.name)
    ).toHaveText(selectedProductName)
    await expect(
      tableRowPopInDialogContent.getByTestId(testIds.explainDetails.sku)
    ).toHaveText(texts.explainDetails.code(selectedProductCode))
    await expect(
      tableRowPopInDialogContent.getByTestId(testIds.explainDetails.price)
    ).toHaveText(texts.explainDetails.price(selectedProductPrice))
    await expect(
      tableRowPopInDialogContent.getByTestId(testIds.explainDetails.stock)
    ).toHaveText(texts.explainDetails.stock(selectedProductStock))
  })

  await test.step('Verify matches and indexed content tables', async () => {
    const tableRowPopInDialogContent = page.getByTestId(
      testIds.explainDetails.dialogContent
    )
    const matchTable = tableRowPopInDialogContent.getByTestId(
      testIds.explainDetails.matchesReadOnlyTable
    )
    const indexedContentReadOnlyTable = tableRowPopInDialogContent.getByTestId(
      testIds.explainDetails.indexedContentReadOnlyTable
    )
    const indexedContentCollapseButton = tableRowPopInDialogContent.getByTestId(
      testIds.explainDetails.indexedContentCollapseButton
    )

    await expect(
      matchTable.locator('thead tr > td').filter({hasText: /\S/})
    ).toHaveText(texts.explainDetails.matchTableHeaders, {
      useInnerText: true,
    })

    await indexedContentCollapseButton.click()
    await expect(indexedContentReadOnlyTable).toBeVisible()

    await expect(
      indexedContentReadOnlyTable
        .locator('thead tr > td')
        .filter({hasText: /\S/})
    ).toHaveText(texts.explainDetails.indexedContentTableHeaders, {
      useInnerText: true,
    })
  })

  await test.step('Close product detail dialog', async () => {
    await page.getByTestId(testIds.explainDetails.dialogCloseButton).click()
    await expect(
      page.getByTestId(
        testIds.explainDetails.dialogContent
      )
    ).not.toBeVisible()
  })

  await test.step('Open query explain dialog', async () => {
    await page.getByTestId(testIds.explainQueryDetails.queryDetailsButton).click()
    await expect(
      page.getByTestId(testIds.explainQueryDetails.dialogContent)
    ).toBeVisible()
  })

  await test.step('Copy explain query to clipboard', async () => {
    // const matchTable = page.getByTestId('matchesReadOnlyTable')
    // const collapseButtons = await matchTable
    //   .getByTestId('matchesReadOnlyTableCollapseSubRowButton')
    //   .all()

    // for (const button of collapseButtons) {
    //   await button.click()
    // }

    const clipboardText = await page.evaluate(async () => {
      return await navigator.clipboard.readText()
    })

    const copyButton = page.getByTestId(
      testIds.explainQueryDetails.copyButton
    )
    await expect(clipboardText).toBe('')
    await copyButton.click()

    const newClipboardText = await page.evaluate(async () => {
      return await navigator.clipboard.readText()
    })

    await expect(
      request.data.explain.explainData.elasticSearchQuery.query
    ).toEqual(newClipboardText)
  })

  await test.step('Close explain query dialog', async () => {
    await page.getByTestId(testIds.explainQueryDetails.closeButton).click()
    await expect(
      page.getByTestId(testIds.explainQueryDetails.dialogContent)
    ).not.toBeVisible()
  })
})
