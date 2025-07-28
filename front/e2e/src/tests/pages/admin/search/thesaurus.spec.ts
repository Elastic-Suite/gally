import {expect, test} from '@playwright/test'
import {Grid} from '../../../../helper/grid'
import {Filter, FilterType} from '../../../../helper/filter'
import {login} from '../../../../helper/auth'
import {navigateTo} from '../../../../helper/menu'
import {Dropdown} from '../../../../helper/dropdown'
import {randomUUID} from 'crypto'
import {Switch} from '../../../../helper/switch'
import {generateTestId, TestId} from "../../../../helper/testIds";
import {AlertMessage, AlertMessageType} from "../../../../helper/alertMessage";

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
    submitButton: generateTestId(TestId.BUTTON, 'submit'),
    deleteButton: generateTestId(TestId.BUTTON, 'delete'),
    backButton: generateTestId(TestId.BUTTON, 'back'),
    confirmDeleteButton: generateTestId(TestId.DIALOG_CONFIRM_BUTTON, resourceName),
    nameError: generateTestId(TestId.HELPER_TEXT, 'name'),
    scopeTypeError: generateTestId(TestId.HELPER_TEXT, generateTestId(TestId.DROPDOWN, 'scopeType')),
    typeError: generateTestId(TestId.HELPER_TEXT, generateTestId(TestId.DROPDOWN, 'type')),
  },
  createThesaurusButton: generateTestId(TestId.GRID_CREATE_BUTTON, resourceName)
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
  paginationOptions: ['10', '25', '50'],
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

test('Pages > Search > Thésaurus', {tag: ['@premium']}, async ({page}) => {
  await test.step('Login and navigate to the Thesaurus page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, '/admin/search/thesaurus/grid')
  })

  const grid = new Grid(page, resourceName)
  const filter = new Filter(page, resourceName, {
    [testIds.filter.name]: FilterType.TEXT,
    [testIds.filter.type]: FilterType.DROPDOWN,
    [testIds.filter.terms]: FilterType.TEXT,
    [testIds.filter.isActive]: FilterType.BOOLEAN,
    [testIds.filter.context]: FilterType.DROPDOWN,
  })
  const alertMessage = new AlertMessage(page)

  await test.step('Verify grid headers and pagination', async () => {
    await grid.expectHeadersToBe(Object.values(texts.gridHeaders))
    await grid.pagination.expectToHaveOptions(texts.paginationOptions)
    await grid.pagination.expectToHaveRowsPerPage(50)
  })

  const defaultRowCount = await grid.getCountLines()

  await test.step('Add some filters and remove them', async () => {
    await filter.addFilter(
      testIds.filter.name,
      texts.filtersToApply.name
    )
    await filter.addFilter(testIds.filter.type,
      texts.filtersToApply.type
    )
    await filter.addFilter(testIds.filter.terms, texts.filtersToApply.terms)
    await filter.addFilter(testIds.filter.isActive, texts.filtersToApply.isActive)
    await filter.addFilter(testIds.filter.context, texts.filtersToApply.context)

    await filter.removeFilter(
      testIds.filter.name,
      texts.filtersToApply.name
    )

    for (let i = 0; i < texts.filtersToApply.type.length; i++) {
      await filter.removeFilter(
        testIds.filter.type,
        texts.filtersToApply.type[i]
      )
    }

    await filter.removeFilter(testIds.filter.terms, texts.filtersToApply.terms)
    await filter.removeFilter(testIds.filter.isActive, texts.filtersToApply.isActive)
    for (let i = 0; i < texts.filtersToApply.context.length; i++) {
      await filter.removeFilter(
        testIds.filter.context,
        texts.filtersToApply.context[i]
      )
    }
    await filter.addFilter(
      testIds.filter.name,
      texts.filtersToApply.name
    )

    await grid.pagination.expectToHaveCount(1)

    await grid.expectToFindLineWhere([
      {
        columnName: texts.gridHeaders.name,
        value: texts.filtersToApply.name,
      },
    ])

    await filter.clearFilters()

    await grid.pagination.expectToHaveCount(defaultRowCount)
  })

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

  await test.step('Create a thesaurus', async () => {
    const createButton = page.getByTestId(testIds.createThesaurusButton)
    await createButton.click()
    await expect(page).toHaveURL('/admin/search/thesaurus/create')

    await submitButtonResourceForm.click()
    await expect(page).toHaveURL('/admin/search/thesaurus/create')
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
    await expect(page).toHaveURL('/admin/search/thesaurus/grid')
    await filter.addFilter(testIds.filter.name, newName)
    await grid.pagination.expectToHaveCount(1)
    await grid.expectToFindLineWhere([
      {
        columnName: texts.gridHeaders.name,
        value: newName,
      },

      {
        columnName: texts.gridHeaders.type,
        value: 'Synonym',
      },
    ])
  })
  const editLink = page.locator(`[data-testid='${testIds.grid}'] a`)

  await test.step('Edit the thesaurus', async () => {
    await editLink.click()
    await expect(page).toHaveURL(/\/admin\/search\/thesaurus\/edit\?id=\d+$/)
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
    await expect(page).toHaveURL('/admin/search/thesaurus/grid')
    await filter.addFilter(testIds.filter.name, newName)
    await grid.pagination.expectToHaveCount(1)
    await grid.expectToFindLineWhere([
      {
        columnName: texts.gridHeaders.name,
        value: newName,
      },
      {
        columnName: texts.gridHeaders.type,
        value: 'Expansion',
      },
    ])
  })

  await test.step('Delete the Thesaurus', async () => {
    await editLink.click()
    const deleteButtonResourceForm = page.getByTestId(
      testIds.form.deleteButton
    )
    await deleteButtonResourceForm.click()
    await page.getByTestId(testIds.form.confirmDeleteButton).click()
    await expect(page).toHaveURL('/admin/search/thesaurus/grid')
    await filter.addFilter(testIds.filter.name, newName)
    await grid.pagination.expectToHaveCount(0)
  })
})
