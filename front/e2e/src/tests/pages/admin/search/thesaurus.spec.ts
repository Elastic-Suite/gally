import {expect, test} from '@playwright/test'
import {Grid} from '../../../../helper/grid'
import {Filter, FilterType} from '../../../../helper/filter'
import {login} from '../../../../utils/auth'
import {navigateTo} from '../../../../utils/menu'
import {Dropdown} from '../../../../helper/dropdown'
import {randomUUID} from 'crypto'
import {Switch} from '../../../../helper/switch'
import {generateTestId, TestId} from "../../../../utils/testIds";
import {AlertMessage, AlertMessageType} from "../../../../helper/alertMessage";
import {deleteEntity, getCommonFormTestIds} from "../../../../utils/form";

const resourceName = 'Thesaurus'

const testIds = {
  grid: generateTestId(TestId.TABLE, resourceName),
  filter: {
    name: 'name',
    type: 'type[]',
    terms: 'synonyms.terms.term',
    isActive: 'isActive',
    context: 'localizedCatalogs.id[]',
  },
  form: {
    ... getCommonFormTestIds(resourceName),
    name: generateTestId(TestId.INPUT_TEXT, 'name'),
    isActive: 'isActive',
    scopeType: 'scopeType',
    type: 'type',
    synonyms: generateTestId(TestId.SYNONYM, 'synonyms'),
    synonymsInput: generateTestId(TestId.INPUT_TEXT, generateTestId(TestId.TEXT_FIELD_TAGS, 'synonyms')),
    synonymsAddButton: generateTestId(TestId.SYNONYM_ADD_BUTTON, "synonyms"),
    synonymsErrorMessage: generateTestId(TestId.HELPER_TEXT, "synonyms"),
    synonymsTrashButton: generateTestId(TestId.SYNONYM_REMOVE_BUTTON, "synonyms"),
    localizedCatalogs: 'localizedCatalogs',
    locales: 'locales',
    expansions: generateTestId(TestId.EXPANSION, 'expansions'),
    expansionsAddButton: generateTestId(TestId.EXPANSION_ADD_BUTTON, "expansions"),
    expansionsReferenceTerm: generateTestId(TestId.INPUT_TEXT, generateTestId(TestId.EXPANSION_REFERENCE_TERM, "expansions")),
    expansionsTrashButton: generateTestId(TestId.EXPANSION_TRASH_BUTTON, "expansions"),
    expansionsTermsInput: generateTestId(TestId.INPUT_TEXT, generateTestId(TestId.TEXT_FIELD_TAGS, generateTestId(TestId.EXPANSION_TERMS, "expansions"))),
    nameError: generateTestId(TestId.HELPER_TEXT, 'name'),
    scopeTypeError: generateTestId(TestId.HELPER_TEXT, generateTestId(TestId.DROPDOWN, 'scopeType')),
    typeError: generateTestId(TestId.HELPER_TEXT, generateTestId(TestId.DROPDOWN, 'type')),
  },
  ... Grid.getCommonGridTestIds(resourceName)
} as const

const texts = {
  labelMenuPage: 'Thesaurus',
  gridHeaders: {
    name: 'Name',
    type: 'Thesaurus type',
    terms: 'Terms',
    isActive: 'Enable',
    context: 'Context',
    actions: 'Actions',
  },
  filtersToApply: {
    name: 'Thesaurus #1 - Synonym',
    type: [
      'Synonym',
      'Expansion',
    ],
    terms: 'robe',
    isActive: true,
    context: [
      'COM French Catalog',
    ],
  }
} as const

const urls = {
  grid: '/admin/search/thesaurus/grid',
  create: '/admin/search/thesaurus/create',
  edit: /\/admin\/search\/thesaurus\/edit\?id=\d+$/
}

test('Pages > Search > Thésaurus', {tag: ['@premium']}, async ({page}) => {
  await test.step('Login and navigate to the Thesaurus page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, '/admin/search/thesaurus/grid')
  })

  // Grid and Filters Locators:
  const grid = new Grid(page, resourceName)
  const filter = new Filter(page, resourceName, {
    [testIds.filter.name]: FilterType.TEXT,
    [testIds.filter.type]: FilterType.DROPDOWN,
    [testIds.filter.terms]: FilterType.TEXT,
    [testIds.filter.isActive]: FilterType.BOOLEAN,
    [testIds.filter.context]: FilterType.DROPDOWN,
  })
  const createButton = page.getByTestId(testIds.createButton)

  // Form Locators (Edit / Create):
  const nameInput = page.getByTestId(testIds.form.name)
  const isActiveSwitch = new Switch(page, testIds.form.isActive)
  const scopeTypeDropdown = new Dropdown(page, testIds.form.scopeType)
  const typeDropdown = new Dropdown(page, testIds.form.type)
  const synonymField = page.getByTestId(testIds.form.synonyms)
  const synonymsTextFieldTagsInputText = synonymField.getByTestId(
    testIds.form.synonymsInput
  )
  const synonymsAddButton = synonymField.getByTestId(testIds.form.synonymsAddButton)
  const localizedCatalogsDropdown = new Dropdown(
    page,
    testIds.form.localizedCatalogs,
    true
  )
  const localesDropdown = new Dropdown(page, testIds.form.locales, true)
  const expansionsField = page.getByTestId(testIds.form.expansions)
  const submitButtonResourceForm = page.getByTestId(testIds.form.submitButton)
  const newName = randomUUID()

  const alertMessage = new AlertMessage(page)

  await test.step('Verify grid headers and pagination', async () => {
    await grid.expectHeadersAndPaginationToBe(Object.values(texts.gridHeaders))
  })

  await test.step('Add some filters and remove them', async () => {
    const defaultRowCount = await grid.getCountLines()
    const applicableFilters = {
      [testIds.filter.name]: texts.filtersToApply.name,
      [testIds.filter.type]: texts.filtersToApply.type,
      [testIds.filter.terms]: texts.filtersToApply.terms,
      [testIds.filter.isActive]: texts.filtersToApply.isActive,
      [testIds.filter.context]: texts.filtersToApply.context,
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
        {[testIds.filter.name]: texts.filtersToApply.name},
        [{columnName: texts.gridHeaders.name, value: texts.filtersToApply.name}]
      )
    })

    await test.step('Clear filter', async () => {
      await grid.expectAllFiltersRemoved(filter, defaultRowCount)
    })
  })

  await test.step('Create a thesaurus', async () => {
    await createButton.click()
    await expect(page).toHaveURL(urls.create)

    await submitButtonResourceForm.click()
    await expect(page).toHaveURL(urls.create)
    await expect(page.getByTestId(testIds.form.nameError)).toBeVisible()
    await expect(
      await page.getByTestId(testIds.form.scopeTypeError)
    ).toBeVisible()
    await expect(
      await page.getByTestId(testIds.form.typeError)
    ).toBeVisible()

    await expect(nameInput).toBeVisible()
    await isActiveSwitch.expectToBeVisible()
    await scopeTypeDropdown.expectToBeVisible()
    await typeDropdown.expectToBeVisible()

    await typeDropdown.selectValue('Synonym')
    await expect(synonymField).toBeVisible()

    await nameInput.fill(newName)

    await isActiveSwitch.expectToBeChecked()
    await isActiveSwitch.disable()
    await isActiveSwitch.enable()

    await scopeTypeDropdown.expectToHaveOptions(['Localized catalog', 'Locale'])
    await scopeTypeDropdown.selectValue('Localized catalog')

    await localizedCatalogsDropdown.expectToBeVisible()
    await localizedCatalogsDropdown.selectValue([
      'COM French Catalog',
      'COM English Catalog',
    ])

    await scopeTypeDropdown.selectValue('Locale')
    await localizedCatalogsDropdown.expectToBeVisible(false)
    await localesDropdown.expectToBeVisible()

    await localesDropdown.selectFirstValue()

    await synonymsTextFieldTagsInputText.fill('dress')
    await synonymsTextFieldTagsInputText.press('Enter')
    await synonymsTextFieldTagsInputText.fill('robes')
    await synonymsTextFieldTagsInputText.press('Enter')

    await synonymsAddButton.click()

    await expect(
      synonymField.getByTestId(testIds.form.synonymsInput)
    ).toHaveCount(2)
    const synonymErrorMessage = await synonymField.getByTestId(
      testIds.form.synonymsErrorMessage
    )

    await expect(synonymErrorMessage).toHaveText('The value is required', {
      useInnerText: true,
    })
    await synonymField.getByTestId(testIds.form.synonymsTrashButton).last().click()

    await submitButtonResourceForm.click()
    await alertMessage.expectToHaveText('Creating of the thesaurus with success', AlertMessageType.SUCCESS)
    await expect(page).toHaveURL(urls.grid)

  })

  await test.step('Verify the thesaurus existence in the grid', async () => {
    await grid.expectRowsAfterFiltersToBe(
      filter,
      {[testIds.filter.name]: newName},
      [
        {columnName: texts.gridHeaders.name, value: newName},
        {columnName: texts.gridHeaders.type, value: 'Synonym'},
      ]
    )
  })

  const editLink = page.locator(`[data-testid='${testIds.grid}'] a`)

  await test.step('Edit the thesaurus', async () => {
    await editLink.click()
    await expect(page).toHaveURL(urls.edit)

    await typeDropdown.selectValue('Expansion')
    await expect(synonymField).not.toBeVisible()
    await expect(expansionsField).toBeVisible()
    const expansionsAddButton = expansionsField.getByTestId(
      testIds.form.expansionsAddButton
    )
    const expansionsReferenceTerm = expansionsField.getByTestId(
      testIds.form.expansionsReferenceTerm
    )
    await expansionsAddButton.click()

    await expect(expansionsReferenceTerm).toHaveCount(1)
    await expansionsReferenceTerm.fill('test')
    await expansionsAddButton.click()
    await expect(expansionsReferenceTerm).toHaveCount(2)
    const expansionsTrashButton = expansionsField.getByTestId(
      testIds.form.expansionsTrashButton
    )
    await expansionsTrashButton.last().click()
    await expect(expansionsReferenceTerm).toHaveCount(1)

    const expansionsExpansionTermsInputText = page.getByTestId(
      testIds.form.expansionsTermsInput
    )
    await expansionsExpansionTermsInputText.fill('Test')
    await expansionsExpansionTermsInputText.press('Enter')
    await submitButtonResourceForm.click()
    const backButton = page.getByTestId(testIds.form.backButton)

    await alertMessage.expectToHaveText('Updating of the thesaurus with success', AlertMessageType.SUCCESS)
    await backButton.click()
    await expect(page).toHaveURL(urls.grid)

    await grid.expectRowsAfterFiltersToBe(
      filter,
      {[testIds.filter.name]: newName},
      [
        {columnName: texts.gridHeaders.name, value: newName},
        {columnName: texts.gridHeaders.type, value: 'Expansion'},
      ]
    )
  })

  await test.step('Delete the Thesaurus', async () => {
    await editLink.click()

    await deleteEntity(
      page,
      testIds.form.deleteButton,
      testIds.form.deletePopin.dialogConfirmButton,
      urls.grid
    )
    await grid.expectRowsAfterFiltersToBe(filter, {[testIds.filter.name]: newName}, [], 0)
  })
})
