import { Page, expect } from '@playwright/test'

export async function login(page: Page) {
  await page.goto('/fr/login')

  await page.getByTestId('emailInput').fill('admin@example.com')
  await page.getByTestId('passwordInput').fill('apassword')
  await page.getByTestId('submitButton').click()
  await expect(page).toHaveURL('/fr/admin/settings/scope/catalogs')
}
