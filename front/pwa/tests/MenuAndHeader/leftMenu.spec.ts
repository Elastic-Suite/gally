import { test, expect } from '@playwright/test'

test('Left Menu', async ({ page }) => {
  await page.goto('/fr/login')

  // Correct login attempt
  await page.getByTestId('emailInput').fill('admin@example.com')
  await page.getByTestId('passwordInput').fill('apassword')
  await page.getByTestId('submitButton').click()
  await expect(page).toHaveURL('/fr/admin/settings/scope/catalogs')

})