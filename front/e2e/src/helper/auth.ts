import { Page, expect, test, TestDetails } from '@playwright/test'
import {TestId, generateTestId} from "./testIds";

const testIds = {
  email: generateTestId(TestId.INPUT_TEXT, 'email'),
  password: generateTestId(TestId.INPUT_TEXT, 'password'),
  submitButton: generateTestId(TestId.BUTTON, 'form-submit'),
  appBar: generateTestId(TestId.APP_BAR),
  userMenu: generateTestId(TestId.USER_MENU),
  logOutButton: generateTestId(TestId.LOG_OUT_BUTTON)
}

interface IUserCredentials {
  email: `${string}@${string}.${Lowercase<string>}`
  password: string
}

const rolesInfos: Record<UserRole, IUserCredentials> = {
  admin: {
    email: 'admin@example.com',
    password: 'apassword',
  },
  contributor: {
    email: 'contributor@example.com',
    password: 'apassword',
  },
}

export enum UserRole {
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor',
}

type TestDetailsWithRequiredTag = TestDetails & Required<Pick<TestDetails, 'tag'>>

export function runTestsAsRoles(
  roles: UserRole[],
  details: TestDetailsWithRequiredTag,
  callback: (page: Page, role?: UserRole) => Promise<void>
): void {
  // Adds the @multirole to the existing tag, these tests can be slower than the others
  // So it might be useful to have an easy way to include/exclude them from a run
  const detailsWithMultiroleTag: TestDetailsWithRequiredTag  = {
    ...details,
    tag: [...new Set([...details.tag, '@multiroles'])]
  }
  for (const role of roles) {
    // Instantiate an isolated test context for each role
    test(`Test as ${role} role`, detailsWithMultiroleTag, async ({ page }) => {
      await login(page, role)
      // Run callback with a page authenticated with the specified role
      await callback(page, role)
    })
  }
}


/**
 * Logs in the user with predefined credentials.
 * Navigates to the login page, fills email and password, and submits the form.
 * Then, expects to be redirected to the admin catalogs settings page.
 * @param page - The Playwright Page instance to operate on.
 * @param role - User role to log in as. Defaults to admin.
 */
export async function login(page: Page, role: UserRole = UserRole.ADMIN): Promise<void> {
  await page.goto('/login')

  // Get inputs and submit button
  const emailInput = page.getByTestId(testIds.email)
  const passwordInput = page.getByTestId(testIds.password)
  const submitButton = page.getByTestId(testIds.submitButton)

  // Fill with correct credentials and submit the form
  await emailInput.fill(rolesInfos[role].email)
  await passwordInput.fill(rolesInfos[role].password)
  await submitButton.click()

  // Assert that the URL changed to the expected admin page
  await expect(page).toHaveURL('/admin/settings/scope/catalogs', {})
}

/**
 * Logs out the currently logged-in user.
 * Opens the user menu, clicks the logout button,
 * and asserts that the user is redirected to the login page.
 * @param page - The Playwright Page instance to operate on.
 */
export async function logout(page: Page): Promise<void> {
  const appBar = page.getByTestId(testIds.appBar)
  const userMenu = appBar.getByTestId(testIds.userMenu)
  const logOutButton = userMenu.getByTestId(testIds.logOutButton)

  await userMenu.click()
  await expect(logOutButton).toBeVisible()

  await logOutButton.click()

  // Assert the page redirects to the login URL after logout
  await expect(page).toHaveURL(
    '/login'
  )
}
