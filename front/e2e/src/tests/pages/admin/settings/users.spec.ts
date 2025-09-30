/* eslint-disable testing-library/prefer-screen-queries */
import {expect, test} from '@playwright/test'
import {login, UserRole} from '../../../../helper/auth'
import {navigateTo} from '../../../../helper/menu'
import {Dropdown} from '../../../../helper/dropdown'
import {Tabs} from '../../../../helper/tabs'
import {generateTestId, TestId} from '../../../../helper/testIds'
import {Switch} from '../../../../helper/switch'
import {Grid} from "../../../../helper/grid";
import {Filter, FilterType} from "../../../../helper/filter";
import {randomUUID} from "crypto";
import {AlertMessage, AlertMessageType} from "../../../../helper/alertMessage";

const resourceName = 'User'

const testIds = {
  grid: generateTestId(TestId.TABLE, resourceName),
  filter: {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    isActive: 'isActive',
    roles: 'roles[]',
  },
  form: {
    isActive: 'isActive',
    firstName: generateTestId(TestId.INPUT_TEXT, 'firstName'),
    lastName: generateTestId(TestId.INPUT_TEXT, 'lastName'),
    email: generateTestId(TestId.INPUT_TEXT, 'email'),
    roles: 'roles',
    dummyPassword: generateTestId(TestId.INPUT_TEXT, 'dummyPassword'),
    submitButton: generateTestId(TestId.BUTTON, 'submit'),
    deleteButton: generateTestId(TestId.BUTTON, 'delete'),
    backButton: generateTestId(TestId.BUTTON, 'back'),
    deleteBoostPopin: {
      dialogConfirmButton: generateTestId(TestId.DIALOG_CONFIRM_BUTTON, resourceName),
    },
  },
  createButton: generateTestId(TestId.GRID_CREATE_BUTTON, resourceName),
} as const

const texts = {
  labelMenuPage: 'Configuration',
  gridHeaders: {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'E-mail',
    roles: 'Role(s)',
    isActive: 'Enable',
    actions: 'Actions',
  },
  filtersToApply: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin',
    roles: [
      'Administrator',
    ],
    isActive: true,
  },
  createValues: {
    roles: [
      'Administrator',
    ],
    expectedRolesAfterSave: [
      'Administrator',
      'Contributor',
    ],
  },
  editValues: {
    roles: ['Contributor'],
    editedRoleDisplay: 'Contributor',
  },
  paginationOptions: ['10', '25', '50'],
  tabs: {
    scope: 'Scope',
    attributes: 'Attributes',
    configurations: 'Configurations',
    users: 'Users',
  },
} as const

test('Pages > Configuration > Users', { tag: ['@premium', '@standard'] }, async ({ page }) => {
  await test.step('Login as CONTRIBUTOR', async () => {
    await login(page, UserRole.CONTRIBUTOR)

    const gridDataTestId = generateTestId(TestId.TABLE, resourceName)

    await navigateTo(
      page,
      texts.labelMenuPage,
      '/admin/settings/scope/catalogs'
    )

    await test.step('Verify if tab "Users" is not present', async () => {
      const tabs = new Tabs(page)
      await tabs.expectToHaveTabs([texts.tabs.scope, texts.tabs.attributes, texts.tabs.configurations])
    })

    await test.step('Verify if contributor user has no access to user user gird page', async () => {
      await page.goto('/admin/settings/user/grid')
      await expect(page.locator(`[data-testId="${gridDataTestId}"]`)).toHaveCount(0)
    })

    await test.step('Verify if contributor user has no access to user create page', async () => {
      await page.goto('/admin/settings/user/create')
      await expect(page).toHaveURL('admin/settings/scope/catalogs')
    })

    await test.step('Verify if contributor user has no access to user update page', async () => {
      await page.goto('/admin/settings/user/edit?id=1')
      await expect(page).toHaveURL('admin/settings/scope/catalogs')
    })
  })

  await test.step('Login and navigate to the users page as ADMIN', async () => {
    await login(page)
    await navigateTo(
      page,
      texts.labelMenuPage,
      '/admin/settings/scope/catalogs'
    )

    const tabs = new Tabs(page)
    await tabs.expectToHaveTabs(Object.values(texts.tabs))
    await tabs.navigateTo(texts.tabs.users, '/admin/settings/user/grid')
  })

  // Grid and Filters Locators:
  const grid = new Grid(page, resourceName)
  const filter = new Filter(page, resourceName, {
    [testIds.filter.firstName]: FilterType.TEXT,
    [testIds.filter.lastName]: FilterType.TEXT,
    [testIds.filter.email]: FilterType.TEXT,
    [testIds.filter.roles]: FilterType.DROPDOWN,
    [testIds.filter.isActive]: FilterType.BOOLEAN,
  })
  const createButton = page.getByTestId(testIds.createButton)

  // Form Locators (Edit / Create):
  const isActiveSwitch = new Switch(page, testIds.form.isActive)
  const firstNameInput = page.getByTestId(testIds.form.firstName)
  const lastNameInput = page.getByTestId(testIds.form.lastName)
  const emailInput = page.getByTestId(testIds.form.email)
  const dummyPasswordInput = page.getByTestId(testIds.form.dummyPassword)
  const rolesDropdown = new Dropdown(page, testIds.form.roles, true)
  const saveButton = page.getByTestId(testIds.form.submitButton)
  const deleteButton = page.getByTestId(testIds.form.deleteButton)

  // Define an email for the new user.
  const newUserFirstName = 'Tony'
  const newUserLastName = 'Dark'
  const newUserEmail = `${randomUUID()}@example.com`


  await test.step('Verify grid headers and pagination', async () => {
    await grid.expectHeadersToBe(Object.values(texts.gridHeaders))
    await grid.pagination.expectToHaveOptions(texts.paginationOptions)
    await grid.pagination.expectToHaveRowsPerPage(50)
  })

  await test.step('Add some filters and remove them', async () => {
    const defaultRowCount = await grid.getCountLines()
    await test.step('Apply all filters available', async () => {
      await filter.addFilter(testIds.filter.firstName, texts.filtersToApply.firstName)
      await filter.addFilter(testIds.filter.lastName, texts.filtersToApply.lastName)
      await filter.addFilter(testIds.filter.email, texts.filtersToApply.email)
      await filter.addFilter(testIds.filter.roles, texts.filtersToApply.roles)
      await filter.addFilter(testIds.filter.isActive, true)
    })

    await test.step('Remove applied filters one by one', async () => {
      await filter.removeFilter(
        testIds.filter.firstName,
        texts.filtersToApply.firstName
      )

      await filter.removeFilter(
        testIds.filter.lastName,
        texts.filtersToApply.lastName
      )

      await filter.removeFilter(
        testIds.filter.email,
        texts.filtersToApply.email
      )

      for (let i = 0; i < texts.filtersToApply.roles.length; i++) {
        await filter.removeFilter(
          testIds.filter.roles,
          texts.filtersToApply.roles[i]
        )
      }

      await filter.removeFilter(
        testIds.filter.isActive,
        texts.filtersToApply.isActive
      )
    })

    await test.step('Apply a filter and compare the grid to see if it works', async () => {
      await filter.addFilter(
        testIds.filter.firstName,
        texts.filtersToApply.firstName
      )

      await grid.pagination.expectToHaveCount(1)

      await grid.expectToFindLineWhere([
        {
          columnName: texts.gridHeaders.firstName,
          value: texts.filtersToApply.firstName,
        },
      ])
    })

    await test.step('Clear filter', async () => {
      await filter.clearFilters()
      await grid.pagination.expectToHaveCount(defaultRowCount)
    })
  })

  await test.step('Create a User', async () => {
    await createButton.click()
    await expect(page).toHaveURL('/admin/settings/user/create')

    // isActive Switch
    await test.step('Disable and enable the "isActive" switch', async () => {
      await isActiveSwitch.expectToBeChecked()
      await isActiveSwitch.disable()
      await isActiveSwitch.enable()
    })

    // firstName InputText
    await test.step('Fill the "first name" field text', async () => {
      await expect(firstNameInput).toBeEmpty()
      await firstNameInput.fill(newUserFirstName)
      await expect(firstNameInput).toHaveValue(newUserFirstName)
    })

    // lastName InputText
    await test.step('Fill the "last name" field text', async () => {
      await expect(lastNameInput).toBeEmpty()
      await lastNameInput.fill(newUserLastName)
      await expect(lastNameInput).toHaveValue(newUserLastName)
    })

    // email InputText
    await test.step('Fill the "email" field text', async () => {
      await expect(emailInput).toBeEmpty()
      await emailInput.fill(newUserEmail)
      await expect(emailInput).toHaveValue(newUserEmail)
    })

    // Roles Multiple Dropdown
    await test.step('Choose role in "roles" dropdown', async () => {
      await rolesDropdown.selectValue(texts.createValues.roles)
    })

    // dummyPassword InputText
    await test.step('Check password field text is disabled', async () => {
      await dummyPasswordInput.isDisabled()
    })

    // Create the User
    await saveButton.click()
    await expect(page).toHaveURL('/admin/settings/user/grid')
  })

  await test.step('Verify the user existence in the grid', async () => {
    await grid.expectToFindLineWhere([
      {
        columnName: texts.gridHeaders.email,
        value: newUserEmail,
      },
    ])
    await filter.addFilter(testIds.filter.email, newUserEmail)
    await grid.pagination.expectToHaveCount(1)
  })

  const editLink = page.locator(`[data-testid="${testIds.grid}"] a`)

  await test.step('Edit a User', async () => {
    await editLink.click()
    await expect(page).toHaveURL(/\/admin\/settings\/user\/edit\?id=\d+$/)

    await test.step('Check password field text is disabled', async () => {
      await dummyPasswordInput.isDisabled()
    })

    await test.step('Check email field text is disabled', async () => {
      await emailInput.isDisabled()
    })

    await rolesDropdown.expectToHaveValue(texts.createValues.expectedRolesAfterSave)
    await rolesDropdown.clear()
    await rolesDropdown.selectValue(texts.editValues.roles)

    await saveButton.click()
    const alertMessage = new AlertMessage(page)
    await alertMessage.expectToHaveText('Updating of the user with success', AlertMessageType.SUCCESS)

    const backButton = page.getByTestId(testIds.form.backButton)
    await backButton.click()
    await expect(page).toHaveURL('/admin/settings/user/grid')
  })

  await test.step('Delete the User', async () => {
    await filter.addFilter(testIds.filter.email, newUserEmail)
    await grid.pagination.expectToHaveCount(1)
    await grid.expectToFindLineWhere([
      {
        columnName: texts.gridHeaders.email,
        value: newUserEmail,
      },
      {
        columnName: texts.gridHeaders.roles,
        value: texts.editValues.editedRoleDisplay
      },
    ])

    await editLink.click()

    await deleteButton.click()
    await page.getByTestId(testIds.form.deleteBoostPopin.dialogConfirmButton).click()
    await expect(page).toHaveURL('/admin/settings/user/grid')
    await filter.addFilter(testIds.filter.email, newUserEmail)
    await grid.pagination.expectToHaveCount(0)
  })
})
