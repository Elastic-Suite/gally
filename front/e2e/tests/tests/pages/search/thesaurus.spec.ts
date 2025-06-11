import { test, expect } from '@playwright/test'
import { Grid } from '../../../helper/grid'
import { Filter, FilterType } from '../../../helper/filter'
import { login } from '../../../helper/auth'
import { navigateTo } from '../../../helper/menu'
import { Dropdown } from '../../../helper/dropdown'
import { randomUUID } from 'crypto'

const GridLabelsAndFilters = {
  name: {
    gridLabel: 'Nom',
    filterTestId: 'name',
  },
  type: {
    gridLabel: 'Type de thésaurus',
    filterTestId: 'type[]',
  },
  terms: { gridLabel: 'Termes', filterTestId: 'synonyms.terms.term' },
  isActive: {
    gridLabel: 'Actif',
    filterTestId: 'isActive',
  },
  context: {
    gridLabel: 'Contexte',
    filterTestId: 'localizedCatalogs.id[]',
  },
  actions: {
    gridLabel: 'Actions',
  },
} as const

test('Page => Thésaurus', async ({ page }) => {
  await login(page)
  await navigateTo(page, 'Thésaurus', '/fr/admin/search/thesaurus/grid')

  const grid = new Grid(page, 'ThesaurusTable')
  await grid.expectHeadersToBe([
    GridLabelsAndFilters.name.gridLabel,
    GridLabelsAndFilters.type.gridLabel,
    GridLabelsAndFilters.terms.gridLabel,
    GridLabelsAndFilters.isActive.gridLabel,
    GridLabelsAndFilters.context.gridLabel,
    GridLabelsAndFilters.actions.gridLabel,
  ])

  const defaultRowCount = await grid.getCountLines()

  await grid.pagination.expectOptionsToBe(['10', '25', '50'])
  await grid.pagination.expectRowsPerPageToBe(50)

  const filter = new Filter(page, 'ThesaurusFilter', {
    [GridLabelsAndFilters.name.filterTestId]: FilterType.TEXT,
    [GridLabelsAndFilters.type.filterTestId]: FilterType.DROPDOWN,
    [GridLabelsAndFilters.terms.filterTestId]: FilterType.TEXT,
    [GridLabelsAndFilters.isActive.filterTestId]: FilterType.BOOLEAN,
    [GridLabelsAndFilters.context.filterTestId]: FilterType.DROPDOWN,
  })

  await filter.addFilter(
    GridLabelsAndFilters.name.filterTestId,
    'Thesaurus #1 - Synonym'
  )
  await filter.addFilter(GridLabelsAndFilters.type.filterTestId, [
    'Synonyme',
    'Expansion',
  ])
  await filter.addFilter(GridLabelsAndFilters.terms.filterTestId, 'robe')
  await filter.addFilter(GridLabelsAndFilters.isActive.filterTestId, true)
  await filter.addFilter(GridLabelsAndFilters.context.filterTestId, [
    'COM French Catalog',
  ])

  await filter.expectFiltersCountToBe(6)

  await filter.removeFilter(
    GridLabelsAndFilters.name.filterTestId,
    'Thesaurus #1 - Synonym'
  )
  await filter.removeFilter(GridLabelsAndFilters.type.filterTestId, 'Synonyme')
  await filter.removeFilter(GridLabelsAndFilters.type.filterTestId, 'Expansion')
  await filter.removeFilter(GridLabelsAndFilters.terms.filterTestId, 'robe')
  await filter.removeFilter(GridLabelsAndFilters.isActive.filterTestId, true)
  await filter.removeFilter(
    GridLabelsAndFilters.context.filterTestId,
    'COM French Catalog'
  )

  await filter.expectFiltersCountToBe(0)

  await filter.addFilter(
    GridLabelsAndFilters.name.filterTestId,
    'Thesaurus #1 - Synonym'
  )

  await filter.expectFiltersCountToBe(1)

  await grid.pagination.expectCountToBe(1)
  await grid.expectToFindLineWhere(
    GridLabelsAndFilters.name.gridLabel,
    'Thesaurus #1 - Synonym'
  )

  await filter.clearFilters()
  await filter.expectFiltersCountToBe(0)

  await grid.pagination.expectCountToBe(defaultRowCount)

  const createButton = await page.getByTestId('createButtonResourceGrid')
  await createButton.click()
  await expect(page).toHaveURL('/fr/admin/search/thesaurus/create')

  const submitButtonResourceForm = await page.getByTestId(
    'submitButtonResourceForm'
  )
  await submitButtonResourceForm.click()

  await expect(page).toHaveURL('/fr/admin/search/thesaurus/create')

  const nameInput = await page.getByTestId('name')
  const isActiveSwitch = await page.getByTestId('isActive')
  const scopeTypeDropdown = new Dropdown(page, 'scopeType')
  const typeDropdown = new Dropdown(page, 'type')
  const synonymField = await page.getByTestId('synonyms')
  const synonymsTextFieldTagsInputText = await synonymField.getByTestId(
    'synonymsTextFieldTagsInputText'
  )
  const synonymsAddButton = await synonymField.getByTestId('synonymsAddButton')
  const localizedCatalogsDropdown = new Dropdown(
    page,
    'localizedCatalogs',
    true
  )
  const localesDropdown = new Dropdown(page, 'locales', true)
  const expansionsField = await page.getByTestId('expansions')

  await expect(await page.getByTestId('nameErrorMessage')).toBeVisible()
  await expect(
    await page.getByTestId('scopeTypeInputTextErrorMessage')
  ).toBeVisible()
  await expect(
    await page.getByTestId('typeInputTextErrorMessage')
  ).toBeVisible()

  await expect(nameInput).toBeVisible()
  await expect(isActiveSwitch).toBeVisible()
  await expect(await page.getByTestId('scopeType')).toBeVisible()
  await expect(await page.getByTestId('type')).toBeVisible()

  await typeDropdown.selectValue('Synonyme')
  await expect(synonymField).toBeVisible()

  const newName = randomUUID()
  await nameInput.fill(newName)

  const isActiveCheckbox = await isActiveSwitch.locator(
    "input[type='checkbox']"
  )

  await expect(isActiveCheckbox).toBeChecked()
  await isActiveSwitch.click()
  await expect(isActiveCheckbox).not.toBeChecked()
  await isActiveSwitch.click()
  await expect(isActiveCheckbox).toBeChecked()

  await scopeTypeDropdown.expectOptionsToBe(['Catalog localisé', 'Langue'])
  await scopeTypeDropdown.selectValue('Catalog localisé')
  await scopeTypeDropdown.expectToHaveValue('Catalog localisé')

  await expect(await page.getByTestId('localizedCatalogs')).toBeVisible()
  await localizedCatalogsDropdown.selectValue([
    'COM French Catalog',
    'COM English Catalog',
  ])

  await scopeTypeDropdown.selectValue('Langue')
  await expect(await page.getByTestId('localizedCatalogs')).not.toBeVisible()
  await expect(await page.getByTestId('locales')).toBeVisible()

  await localesDropdown.selectFirstValue()

  await synonymsTextFieldTagsInputText.fill('dress')
  await synonymsTextFieldTagsInputText.press('Enter')
  await synonymsTextFieldTagsInputText.fill('robes')
  await synonymsTextFieldTagsInputText.press('Enter')

  await synonymsAddButton.click()

  await expect(
    await synonymField.getByTestId('synonymsTextFieldTagsInputText')
  ).toHaveCount(2)
  const synonymErrorMessage = await synonymField.getByTestId(
    'synonymsTextFieldTagsErrorMessage'
  )

  await expect(synonymErrorMessage).toHaveText('La valeur est requise', {
    useInnerText: true,
  })
  await (await synonymField.getByTestId('synonymsTrashButton').last()).click()

  await submitButtonResourceForm.click()
  await expect(page).toHaveURL('/fr/admin/search/thesaurus/grid')
  await filter.addFilter(GridLabelsAndFilters.name.filterTestId, newName)
  await grid.pagination.expectCountToBe(1)
  await grid.expectToFindLineWhere(GridLabelsAndFilters.name.gridLabel, newName)
  await grid.expectToFindLineWhere(
    GridLabelsAndFilters.type.gridLabel,
    'Synonyme'
  )

  const editLink = await page.locator("[data-testid='ThesaurusTable'] a")
  await editLink.click()
  await expect(page).toHaveURL(/\/fr\/admin\/search\/thesaurus\/edit\?id=\d+$/)
  typeDropdown.selectValue('Expansion')
  await expect(synonymField).not.toBeVisible()
  await expect(expansionsField).toBeVisible()
  const expansionsAddButton = await expansionsField.getByTestId(
    'expansionsAddButton'
  )
  const expansionsReferenceTerm = expansionsField.getByTestId(
    'expansionsReferenceTerm'
  )
  await expansionsAddButton.click()

  await expect(expansionsReferenceTerm).toHaveCount(1)
  await expansionsReferenceTerm.fill('test')
  await expansionsAddButton.click()
  await expect(expansionsReferenceTerm).toHaveCount(2)
  const expansionsTrashButton = await expansionsField.getByTestId(
    'expansionsTrashButton'
  )
  await (await expansionsTrashButton.last()).click()
  await expect(expansionsReferenceTerm).toHaveCount(1)

  const expansionsExpansionTermsInputText = await page.getByTestId(
    'expansionsExpansionTermsInputText'
  )
  await expansionsExpansionTermsInputText.fill('Test')
  expansionsExpansionTermsInputText.press('Enter')
  await submitButtonResourceForm.click()
  const backButton = await page.getByTestId('backButton')
  await backButton.click()
  await expect(page).toHaveURL('/fr/admin/search/thesaurus/grid')
  await filter.addFilter(GridLabelsAndFilters.name.filterTestId, newName)
  await grid.pagination.expectCountToBe(1)
  await grid.expectToFindLineWhere(GridLabelsAndFilters.name.gridLabel, newName)
  await grid.expectToFindLineWhere(
    GridLabelsAndFilters.type.gridLabel,
    'Expansion'
  )
  await editLink.click()

  const deleteButtonResourceForm = await page.getByTestId(
    'deleteButtonResourceForm'
  )
  await deleteButtonResourceForm.click()
  await (await page.getByTestId('confirmButton')).click()
  await expect(page).toHaveURL('/fr/admin/search/thesaurus/grid')
  await filter.addFilter(GridLabelsAndFilters.name.filterTestId, newName)
  await grid.pagination.expectCountToBe(0)
})
