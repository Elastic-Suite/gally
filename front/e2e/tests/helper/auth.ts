import { Page, expect } from '@playwright/test'

export async function login(page: Page) {
  await page.goto('/fr/login')

  // Get inputs and submit button
  const emailInput = await page.getByTestId('emailInput')
  const passwordInput = await page.getByTestId('passwordInput')
  const submitButton = await page.getByTestId('submitButton')

  // Fill with correct credentials and submit the form
  await emailInput.fill('admin@example.com')
  await passwordInput.fill('apassword')
  await submitButton.click()

  await expect(page).toHaveURL('/fr/admin/settings/scope/catalogs', {})
}
