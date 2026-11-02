import { expect, test } from '@playwright/test'
import { randomUUID } from 'crypto'
import { login } from '../../../../../utils/auth'
import { navigateTo } from '../../../../../utils/menu'
import { Dropdown } from '../../../../../helper/dropdown'
import { Switch } from '../../../../../helper/switch'
import { Grid } from '../../../../../helper/grid'
import { Filter, FilterType } from '../../../../../helper/filter'
import { AlertMessage, AlertMessageType } from '../../../../../helper/alertMessage'
import { generateTestId, TestId } from "../../../../../utils/testIds"
import { deleteEntity, getCommonFormTestIds } from "../../../../../utils/form"
import { RulesManager } from '../../../../../helper/rulesManager'

const resourceName = 'Recommender'

const testIds = {
  grid: generateTestId(TestId.TABLE, resourceName),
  filter: {
    name: 'name',
    priority: 'priority[between]',
    isActive: 'isActive',
    localizedCatalogs: 'localizedCatalogs.id[]',
    recommenderTypes: 'recommenderTypes.id[]',
  },
  form: {
    ...getCommonFormTestIds(resourceName),
    isActive: 'isActive',
    name: generateTestId(TestId.INPUT_TEXT, 'name'),
    localizedCatalogs: 'localizedCatalogs',
    recommenderTypes: 'recommenderTypes',
    priority: generateTestId(TestId.INPUT_TEXT, TestId.INPUT_INTEGER, 'priority'),
    enableCoOccurrence: 'enableCoOccurrence',
    enableSimilarity: 'enableSimilarity',
    sourceRule: 'sourceRule',
    targetRule: 'targetRule',
    similarityRule: 'similarityRule',
    preview: generateTestId(TestId.RECOMMENDER_PREVIEW),
    previewLocalizedCatalog: 'previewLocalizedCatalog',
    previewProductSku: generateTestId(TestId.INPUT_TEXT, 'previewProductSku'),
    previewSubmit: generateTestId(TestId.BUTTON, 'previewSubmit'),
  },
  ...Grid.getCommonGridTestIds(resourceName)
} as const

const texts = {
  labelMenuPage: 'Auto recommenders',
  gridHeaders: {
    name: 'Name',
    priority: 'Priority',
    isActive: 'Enable',
    enableCoOccurrence: 'Enable co-occurrence',
    enableSimilarity: 'Enable similarity',
    localizedCatalogs: 'Localized catalog(s)',
    recommenderTypes: 'Applied to',
    actions: 'Actions'
  },
  filtersToApply: {
    priority: [0, 1],
    isActive: true,
    localizedCatalogs: ['COM French Catalog'],
    recommenderTypes: ['Default'],
  },
  createValues: [
    {
      priority: '0',
      isActive: true,
      localizedCatalogs: [
        'COM French Catalog',
        'COM English Catalog',
      ],
      recommenderTypes: ['Default'],
    },
    {
      priority: '2',
      isActive: true,
      localizedCatalogs: [
        'FR French Catalog',
        'EN French Catalog',
      ],
      recommenderTypes: ['Default'],
    },
  ],
  editValues: {
    localizedCatalogs: ['COM French Catalog'],
    editedLocalizedCatalogDisplay: 'COM Catalog - COM French Catalog',
  },
  rules: {
    // Field labels of the default localized catalog (com_fr), where "Category" is the category_gear select attribute
    category: 'Catégorie',
    price: 'Prix',
    categoryOperators: ['is equal', 'is not equal'],
    sameAs: 'is the same as the source product',
    notSameAs: 'is different from the source product',
    higherThan: 'is higher than the source product, by at most (optional %)',
    percentage: '20',
  },
  preview: {
    localizedCatalog: 'COM French Catalog',
    unknownSku: 'UNKNOWN-SKU',
    sourceNotFound: 'The source product does not exist in this localized catalog.',
    sku: 'VA11-GO-NA',
    recommendedSkus: ['VA17-SI-NA', 'VA18-GO-NA', 'VA06', 'VA05'],
    ruleOrigin: 'Similarity rule',
  },
} as const

const urls = {
  grid: '/admin/merchandize/recommender/auto_recommender/grid',
  create: '/admin/merchandize/recommender/auto_recommender/create',
  edit: /\/admin\/merchandize\/recommender\/auto_recommender\/edit\?id=\d+$/
}
test('Pages > Merchandising > Recommenders > Auto recommenders', { tag: ['@premium'] }, async ({ page }) => {
  await test.step('Login and navigate to the "Auto recommenders" page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, urls.grid)
  })

  // Grid and Filters Locators:
  const grid = new Grid(page, resourceName)
  const filter = new Filter(page, resourceName, {
    [testIds.filter.name]: FilterType.TEXT,
    [testIds.filter.priority]: FilterType.RANGE,
    [testIds.filter.isActive]: FilterType.BOOLEAN,
    [testIds.filter.localizedCatalogs]: FilterType.DROPDOWN,
    [testIds.filter.recommenderTypes]: FilterType.DROPDOWN,
  })
  const createButton = page.getByTestId(testIds.createButton)

  // Form Locators (Edit / Create):
  const isActiveSwitch = new Switch(page, testIds.form.isActive)
  const nameInput = page.getByTestId(testIds.form.name)
  const localizedCatalogs = new Dropdown(page, testIds.form.localizedCatalogs, true)
  const recommenderTypes = new Dropdown(page, testIds.form.recommenderTypes, true)
  const priorityInput = page.getByTestId(testIds.form.priority)
  const enableCoOccurrenceSwitch = new Switch(page, testIds.form.enableCoOccurrence)
  const enableSimilaritySwitch = new Switch(page, testIds.form.enableSimilarity)
  const sourceRule = new RulesManager(page, testIds.form.sourceRule)
  const targetRule = new RulesManager(page, testIds.form.targetRule)
  const similarityRule = new RulesManager(page, testIds.form.similarityRule)
  const saveButton = page.getByTestId(testIds.form.submitButton)

  // Define a name for the new created Entity.
  const recommenderNameSuffix = '_e2e_test_recommender'
  const names = [
    randomUUID() + recommenderNameSuffix,
    randomUUID() + recommenderNameSuffix,
  ]

  await test.step('Create an auto recommenders', async () => {
    for (let i = 0; i < 2; i++) {
      await test.step('Create auto recommender #' + i, async () => {
        await createButton.click()
        await expect(page).toHaveURL(urls.create)
        await isActiveSwitch.expectToBeChecked()
        await nameInput.fill(names[i])
        await localizedCatalogs.selectValue(texts.createValues[i].localizedCatalogs)
        await recommenderTypes.selectValue(texts.createValues[i].recommenderTypes)
        await priorityInput.fill(texts.createValues[i].priority)

        if (i === 0) {
          await test.step('The source rule has no operator relative to the source product', async () => {
            const index = await sourceRule.addAttributeRule(texts.rules.category)
            await sourceRule.expectOperatorsToBe(index, [...texts.rules.categoryOperators])
            await sourceRule.removeAttributeRule(index)
          })

          await test.step('Enable the co-occurrence and the similarity blocks', async () => {
            await enableCoOccurrenceSwitch.expectToBeChecked(false)
            await targetRule.expectToBeVisible(false)
            await enableCoOccurrenceSwitch.enable()
            await targetRule.expectToBeVisible()

            await enableSimilaritySwitch.expectToBeChecked(false)
            await similarityRule.expectToBeVisible(false)
            await enableSimilaritySwitch.enable()
            await similarityRule.expectToBeVisible()
          })

          await test.step('Add similarity conditions relative to the source product', async () => {
            const categoryIndex = await similarityRule.addAttributeRule(texts.rules.category)
            await similarityRule.expectOperatorsToBe(categoryIndex, [
              ...texts.rules.categoryOperators,
              texts.rules.sameAs,
              texts.rules.notSameAs,
            ])
            await similarityRule.selectOperator(categoryIndex, texts.rules.sameAs)
            await similarityRule.expectAttributeRuleToBe(categoryIndex, texts.rules.category, texts.rules.sameAs, null)

            const priceIndex = await similarityRule.addAttributeRule(texts.rules.price)
            await similarityRule.selectOperator(priceIndex, texts.rules.higherThan)
            await similarityRule.fillValue(priceIndex, texts.rules.percentage)
          })
        }

        await saveButton.click()
        await expect(page).toHaveURL(urls.grid)
      })
    }
  })

  await test.step('Verify the recommender #1 existence in the grid', async () => {
    await grid.expectRowsAfterFiltersToBe(
      filter,
      { [testIds.filter.name]: names[0] },
      [{ columnName: texts.gridHeaders.name, value: names[0] }]
    )
  })

  const editLink = page.locator(`[data-testid="${testIds.grid}"] a`)

  await test.step('Edit an auto recommender', async () => {
    await editLink.click()
    await expect(page).toHaveURL(urls.edit)

    await test.step('The similarity conditions relative to the source product are saved', async () => {
      await enableSimilaritySwitch.expectToBeChecked()
      await similarityRule.expectAttributeRuleToBe(0, texts.rules.category, texts.rules.sameAs, null)
      await similarityRule.expectAttributeRuleToBe(1, texts.rules.price, texts.rules.higherThan, texts.rules.percentage)
    })

    await test.step('Preview the recommendations of a source product', async () => {
      const preview = page.getByTestId(testIds.form.preview)
      await new Dropdown(page, testIds.form.previewLocalizedCatalog, false, preview).selectValue(texts.preview.localizedCatalog)

      await preview.getByTestId(testIds.form.previewProductSku).fill(texts.preview.unknownSku)
      await preview.getByTestId(testIds.form.previewSubmit).click()
      await expect(preview).toContainText(texts.preview.sourceNotFound)

      // Same direct category (cat_3 or cat_5) and a price between 58 and 69.60 (+20%).
      await preview.getByTestId(testIds.form.previewProductSku).fill(texts.preview.sku)
      await preview.getByTestId(testIds.form.previewSubmit).click()
      const rows = preview.locator('tbody tr')
      await expect(rows).toHaveCount(texts.preview.recommendedSkus.length)
      for (const sku of texts.preview.recommendedSkus) {
        await expect(rows.filter({ hasText: sku })).toContainText(texts.preview.ruleOrigin)
      }
    })

    await localizedCatalogs.expectToHaveValue(texts.createValues[0].localizedCatalogs)
    await localizedCatalogs.clear()
    await localizedCatalogs.selectValue(texts.editValues.localizedCatalogs)

    await saveButton.click()
    const alertMessage = new AlertMessage(page)
    await alertMessage.expectToHaveText('The auto recommender has been updated successfully', AlertMessageType.SUCCESS)

    await page.getByTestId(testIds.form.backButton).click()
    await expect(page).toHaveURL(urls.grid)

    await grid.expectRowsAfterFiltersToBe(
      filter,
      { [testIds.filter.name]: names[0] },
      [
        {
          columnName: texts.gridHeaders.name,
          value: names[0],
        },
        {
          columnName: texts.gridHeaders.localizedCatalogs,
          value: texts.editValues.editedLocalizedCatalogDisplay
        },
      ]
    )

    await filter.clearFilters()
  })

  await test.step('Verify grid headers and pagination', async () => {
    await grid.expectHeadersAndPaginationToBe(Object.values(texts.gridHeaders))
  })

  await test.step('Add some filters and remove them', async () => {
    const defaultRowCount = await grid.getCountLines()
    const applicableFilters = {
      [testIds.filter.name]: names[0],
      [testIds.filter.priority]: texts.filtersToApply.priority,
      [testIds.filter.isActive]: texts.filtersToApply.isActive,
      [testIds.filter.localizedCatalogs]: texts.filtersToApply.localizedCatalogs,
      [testIds.filter.recommenderTypes]: texts.filtersToApply.recommenderTypes,
    }

    await test.step('Apply all filters available', async () => {
      await filter.addFilters(applicableFilters)
    })

    await test.step('Remove applied filters one by one', async () => {
      await filter.removeFilters(applicableFilters)
    })

    await test.step('Apply a filter and compare the grid to see if it works', async () => {
      await grid.expectRowsAfterFiltersToBe(
        filter,
        { [testIds.filter.name]: names[0] },
        [{ columnName: texts.gridHeaders.name, value: names[0] }]
      )
    })

    await test.step('Clear filter', async () => {
      await grid.expectAllFiltersRemoved(filter, defaultRowCount)
    })
  })

  await test.step('Delete the auto recommenders', async () => {
    for (let i = 0; i < 2; i++) {
      await test.step('Delete auto recommender #' + i, async () => {
        await expect(page).toHaveURL(urls.grid)
        // The grid may contain other recommenders: only open the test one.
        await grid.expectRowsAfterFiltersToBe(
          filter,
          { [testIds.filter.name]: names[i] },
          [{ columnName: texts.gridHeaders.name, value: names[i] }]
        )
        await page.locator(`[data-testid="${testIds.grid}"] a`).first().click()
        await deleteEntity(
          page,
          testIds.form.deleteButton,
          testIds.form.deletePopin.dialogConfirmButton,
          urls.grid
        )

        // Test only for the first recommender because when all recommenders will be removed, the grid disappear.
        if (i === 0) {
          await expect(page).toHaveURL(urls.grid)
          await grid.expectRowsAfterFiltersToBe(filter, { [testIds.filter.name]: names[i] }, [], 0)
          await filter.clearFilters()
        }
      })
    }
  })
})
