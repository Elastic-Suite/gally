import { test, expect } from '@playwright/test'

test('Login', async ({ page }) => {
  await page.goto('/fr/login')

  const emailInput = await page.getByTestId('emailInput')
  const passwordInput = await page.getByTestId('passwordInput')
  const submitButton = await page.getByTestId('submitButton')

  // Check validation messages for empty fields
  await submitButton.click()
  const emailErrorElement = await page.getByTestId('emailInputErrorMessage')
  const passwordErrorElement = await page.getByTestId(
    'passwordInputErrorMessage'
  )
  await expect(emailErrorElement).toHaveText('La valeur est requise')
  await expect(passwordErrorElement).toHaveText('La valeur est requise')

  // Verify that the URL remains the same
  await expect(page).toHaveURL('/fr/login')

  // Test for invalid email format
  await emailInput.fill('admin@')
  await expect(emailErrorElement).toHaveText('formError.emailInput')

  // Intercept the response when incorrect credentials are used
  await page.on('response', async (response) => {
    if (
      response.url().includes('/authentication_token') &&
      response.status() === 401
    ) {
      const responseBody = await response.json()
      expect(responseBody).toEqual({
        code: 401,
        message: 'Invalid credentials.',
      })
    }
  })

  // Attempt to log in with incorrect credentials
  await emailInput.fill('admin@example.com')
  await passwordInput.fill('WrongPassword')
  await submitButton.click()

  // Correct login attempt
  await emailInput.fill('admin@example.com')
  await passwordInput.fill('apassword')
  await submitButton.click()
  await expect(page).toHaveURL('/fr/admin/settings/scope/catalogs')
})