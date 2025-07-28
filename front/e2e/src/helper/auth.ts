import {expect, Page} from '@playwright/test'
import {generateTestId, TestId} from "./testIds";

const testIds = {
  email: generateTestId(TestId.INPUT_TEXT, 'email'),
  password: generateTestId(TestId.INPUT_TEXT, 'password'),
  submitButton: generateTestId(TestId.BUTTON, 'form-submit'),
  appBar: generateTestId(TestId.APP_BAR),
  userMenu: generateTestId(TestId.USER_MENU),
  logOutButton: generateTestId(TestId.LOG_OUT_BUTTON)
}

const texts = {
  email: 'admin@example.com',
  password: "apassword",
}

/**
 * Logs in the user with predefined credentials.
 * Navigates to the login page, fills email and password, and submits the form.
 * Then, expects to be redirected to the admin catalogs settings page.
 * @param page - The Playwright Page instance to operate on.
 */
export async function login(page: Page): Promise<void> {
  await page.goto('/login')

  // Get inputs and submit button
  const emailInput = page.getByTestId(testIds.email)
  const passwordInput = page.getByTestId(testIds.password)
  const submitButton = page.getByTestId(testIds.submitButton)

  // Fill with correct credentials and submit the form
  await emailInput.fill(texts.email)
  await passwordInput.fill(texts.password)
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
