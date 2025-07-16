import { Page, expect } from '@playwright/test'

/**
 * Logs in the user with predefined credentials.
 * Navigates to the login page, fills email and password, and submits the form.
 * Then, expects to be redirected to the admin catalogs settings page.
 * @param page - The Playwright Page instance to operate on.
 */
export async function login(page: Page): Promise<void> {
  await page.goto('/login')

  // Get inputs and submit button
  const emailInput = page.getByTestId('emailInput')
  const passwordInput = page.getByTestId('passwordInput')
  const submitButton = page.getByTestId('submitButton')

  // Fill with correct credentials and submit the form
  await emailInput.fill('admin@example.com')
  await passwordInput.fill('apassword')
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
  const appBar = page.getByTestId('appBar')
  const userMenu = appBar.getByTestId('userMenu')
  const logOutButton = userMenu.getByTestId('logOutButton')

  await userMenu.click()
  await expect(logOutButton).toBeVisible()

  await logOutButton.click()

  // Assert the page redirects to the login URL after logout
  await expect(page).toHaveURL(
    `${process.env.SERVER_BASE_URL || 'https://gally.local'}/login`
  )
}
