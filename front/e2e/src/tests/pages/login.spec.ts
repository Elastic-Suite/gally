import { test, expect } from '@playwright/test'
import { login } from '../../helper/auth'
import { AlertMessage } from '../../helper/alertMessage'

test('Login page', async ({ page }) => {
  await page.goto('/login')

  // Get inputs and submit button
  const emailInput = await page.getByTestId('emailInput')
  const passwordInput = await page.getByTestId('passwordInput')
  const submitButton = await page.getByTestId('submitButton')

  // Error messages locators :
  const emailErrorMessage = page.getByTestId('emailInputErrorMessage')
  const passwordErrorMessage = page.getByTestId('passwordInputErrorMessage')

  // Check validation messages for empty fields

  await submitButton.click()

  await expect(emailErrorMessage).toHaveText('The value is required', {
    useInnerText: true,
  })
  await expect(passwordErrorMessage).toHaveText('The value is required', {
    useInnerText: true,
  })
  await expect(page).toHaveURL('/login')

  // Check validation messages for empty fields

  await emailInput.fill('admin@')
  await submitButton.click()
  await expect(emailErrorMessage).toHaveText(
    'The email address format is invalid.',
    { useInnerText: true }
  )

  // Check validation message when log in with incorrect credentials

  await emailInput.fill('admin@example.com')
  await passwordInput.fill('WrongPassword')
  await submitButton.click()

  const alertMessage = new AlertMessage(page)
  await alertMessage.expectToHaveText('Invalid credentials.')

  // Check that there is a redirection when there is correct login credentials
  await login(page)
})
