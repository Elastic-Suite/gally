import { test, expect } from '@playwright/test'
import { Grid } from '../../../helper/grid'
import { Filter, FilterType } from '../../../helper/filter'
import { login } from '../../../helper/auth'
import { navigateTo } from '../../../helper/menu'
import { Dropdown } from '../../../helper/dropdown'
import { randomUUID } from 'crypto'
import { Switch } from '../../../helper/switch'

const GridLabelsAndFilters = {
  name: {
    gridLabel: 'Name',
    filterTestId: 'name',
  },
  type: {
    gridLabel: 'Thesaurus type',
    filterTestId: 'type[]',
  },
  terms: { gridLabel: 'Terms', filterTestId: 'synonyms.terms.term' },
  isActive: {
    gridLabel: 'Enable',
    filterTestId: 'isActive',
  },
  context: {
    gridLabel: 'Context',
    filterTestId: 'localizedCatalogs.id[]',
  },
  actions: {
    gridLabel: 'Actions',
  },
} as const

test('Page => Thésaurus', async ({ page }) => {
  await login(page)
  await navigateTo(page, 'Thesaurus', '/admin/search/thesaurus/grid')

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

  await grid.pagination.expectToHaveOptions(['10', '25', '50'])
  await grid.pagination.expectToHaveRowsPerPage(50)

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
    'Synonym',
    'Expansion',
  ])
  await filter.addFilter(GridLabelsAndFilters.terms.filterTestId, 'robe')
  await filter.addFilter(GridLabelsAndFilters.isActive.filterTestId, true)
  await filter.addFilter(GridLabelsAndFilters.context.filterTestId, [
    'COM French Catalog',
  ])


  await filter.removeFilter(
    GridLabelsAndFilters.name.filterTestId,
    'Thesaurus #1 - Synonym'
  )
  await filter.removeFilter(GridLabelsAndFilters.type.filterTestId, 'Synonym')
  await filter.removeFilter(GridLabelsAndFilters.type.filterTestId, 'Expansion')
  await filter.removeFilter(GridLabelsAndFilters.terms.filterTestId, 'robe')
  await filter.removeFilter(GridLabelsAndFilters.isActive.filterTestId, true)
  await filter.removeFilter(
    GridLabelsAndFilters.context.filterTestId,
    'COM French Catalog'
  )


  await filter.addFilter(
    GridLabelsAndFilters.name.filterTestId,
    'Thesaurus #1 - Synonym'
  )


  await grid.pagination.expectToHaveCount(1)

  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.name.gridLabel,
      value: 'Thesaurus #1 - Synonym',
    },
  ])

  await filter.clearFilters()

  await grid.pagination.expectToHaveCount(defaultRowCount)

  const createButton = page.getByTestId('createButtonResourceGrid')
  await createButton.click()
  await expect(page).toHaveURL('/admin/search/thesaurus/create')

  const submitButtonResourceForm = page.getByTestId('submitButtonResourceForm')
  await submitButtonResourceForm.click()

  await expect(page).toHaveURL('/admin/search/thesaurus/create')

  const nameInput = page.getByTestId('name')
  const isActiveSwitch = new Switch(page, 'isActive')
  const scopeTypeDropdown = new Dropdown(page, 'scopeType')
  const typeDropdown = new Dropdown(page, 'type')
  const synonymField = page.getByTestId('synonyms')
  const synonymsTextFieldTagsInputText = synonymField.getByTestId(
    'synonymsTextFieldTagsInputText'
  )
  const synonymsAddButton = synonymField.getByTestId('synonymsAddButton')
  const localizedCatalogsDropdown = new Dropdown(
    page,
    'localizedCatalogs',
    true
  )
  const localesDropdown = new Dropdown(page, 'locales', true)
  const expansionsField = page.getByTestId('expansions')

  await expect(page.getByTestId('nameErrorMessage')).toBeVisible()
  await expect(
    await page.getByTestId('scopeTypeInputTextErrorMessage')
  ).toBeVisible()
  await expect(
    await page.getByTestId('typeInputTextErrorMessage')
  ).toBeVisible()

  await expect(nameInput).toBeVisible()
  await isActiveSwitch.expectToBeVisible()
  await expect(page.getByTestId('scopeType')).toBeVisible()
  await expect(page.getByTestId('type')).toBeVisible()

  await typeDropdown.selectValue('Synonym')
  await expect(synonymField).toBeVisible()

  const newName = randomUUID()
  await nameInput.fill(newName)

  await isActiveSwitch.expectToBeChecked()
  await isActiveSwitch.disable()
  await isActiveSwitch.enable()

  await scopeTypeDropdown.expectToHaveOptions(['Localized catalog', 'Locale'])
  await scopeTypeDropdown.selectValue('Localized catalog')

  await expect(page.getByTestId('localizedCatalogs')).toBeVisible()
  await localizedCatalogsDropdown.selectValue([
    'COM French Catalog',
    'COM English Catalog',
  ])

  await scopeTypeDropdown.selectValue('Locale')
  await expect(page.getByTestId('localizedCatalogs')).not.toBeVisible()
  await expect(page.getByTestId('locales')).toBeVisible()

  await localesDropdown.selectFirstValue()

  await synonymsTextFieldTagsInputText.fill('dress')
  await synonymsTextFieldTagsInputText.press('Enter')
  await synonymsTextFieldTagsInputText.fill('robes')
  await synonymsTextFieldTagsInputText.press('Enter')

  await synonymsAddButton.click()

  await expect(
    synonymField.getByTestId('synonymsTextFieldTagsInputText')
  ).toHaveCount(2)
  const synonymErrorMessage = await synonymField.getByTestId(
    'synonymsTextFieldTagsErrorMessage'
  )

  await expect(synonymErrorMessage).toHaveText('The value is required', {
    useInnerText: true,
  })
  await synonymField.getByTestId('synonymsTrashButton').last().click()

  await submitButtonResourceForm.click()
  await expect(page).toHaveURL('/admin/search/thesaurus/grid')
  await filter.addFilter(GridLabelsAndFilters.name.filterTestId, newName)
  await grid.pagination.expectToHaveCount(1)
  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.name.gridLabel,
      value: newName,
    },

    {
      columnName: GridLabelsAndFilters.type.gridLabel,
      value: 'Synonym',
    },
  ])

  const editLink = page.locator("[data-testid='ThesaurusTable'] a")
  await editLink.click()
  await expect(page).toHaveURL(/\/admin\/search\/thesaurus\/edit\?id=\d+$/)
  await typeDropdown.selectValue('Expansion')
  await expect(synonymField).not.toBeVisible()
  await expect(expansionsField).toBeVisible()
  const expansionsAddButton = expansionsField.getByTestId('expansionsAddButton')
  const expansionsReferenceTerm = expansionsField.getByTestId(
    'expansionsReferenceTerm'
  )
  await expansionsAddButton.click()

  await expect(expansionsReferenceTerm).toHaveCount(1)
  await expansionsReferenceTerm.fill('test')
  await expansionsAddButton.click()
  await expect(expansionsReferenceTerm).toHaveCount(2)
  const expansionsTrashButton = expansionsField.getByTestId(
    'expansionsTrashButton'
  )
  await expansionsTrashButton.last().click()
  await expect(expansionsReferenceTerm).toHaveCount(1)

  const expansionsExpansionTermsInputText = page.getByTestId(
    'expansionsExpansionTermsInputText'
  )
  await expansionsExpansionTermsInputText.fill('Test')
  expansionsExpansionTermsInputText.press('Enter')
  await submitButtonResourceForm.click()
  const backButton = page.getByTestId('backButton')
  await backButton.click()
  await expect(page).toHaveURL('/admin/search/thesaurus/grid')
  await filter.addFilter(GridLabelsAndFilters.name.filterTestId, newName)
  await grid.pagination.expectToHaveCount(1)
  await grid.expectToFindLineWhere([
    {
      columnName: GridLabelsAndFilters.name.gridLabel,
      value: newName,
    },

    {
      columnName: GridLabelsAndFilters.type.gridLabel,
      value: 'Expansion',
    },
  ])

  await editLink.click()

  const deleteButtonResourceForm = page.getByTestId('deleteButtonResourceForm')
  await deleteButtonResourceForm.click()
  await page.getByTestId('dialogConfirmButton').click()
  await expect(page).toHaveURL('/admin/search/thesaurus/grid')
  await filter.addFilter(GridLabelsAndFilters.name.filterTestId, newName)
  await grid.pagination.expectToHaveCount(0)
})
