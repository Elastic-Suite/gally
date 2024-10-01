import { test, expect } from '@playwright/test'

const authentificationURL = 'https://localhost/authentication_token'

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

  // Attempt to log in with incorrect credentials
  await emailInput.fill('admin@example.com')
  await passwordInput.fill('WrongPassword')
  await submitButton.click()

  const unsuccessResponse = await (
    await page.waitForResponse(
      (response) =>
        response.url() === authentificationURL && response.status() === 401
    )
  ).json()

  await expect(unsuccessResponse).toEqual({
    code: 401,
    message: 'Invalid credentials.',
  })

  // Correct login attempt
  await emailInput.fill('admin@example.com')
  await passwordInput.fill('apassword')
  await submitButton.click()

  const successResponse = await (
    await page.waitForResponse(
      (response) => response.url() === authentificationURL && response.ok()
    )
  ).json()

  await expect(successResponse).toHaveProperty('token')

  await expect(page).toHaveURL('/fr/admin/settings/scope/catalogs')
})
