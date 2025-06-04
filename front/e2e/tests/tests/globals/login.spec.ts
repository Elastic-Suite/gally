import { test, expect } from '@playwright/test'
import { login } from '../../helper/auth'

const authentificationURL = `${
  process.env.API_SERVER_BASE_URL || 'https://gally.local'
}/authentication_token`

test('Login page', async ({ page }) => {
  await page.goto('/fr/login')

  // Get inputs and submit button
  const emailInput = await page.getByTestId('emailInput')
  const passwordInput = await page.getByTestId('passwordInput')
  const submitButton = await page.getByTestId('submitButton')

  // Check validation messages for empty fields

  await submitButton.click()
  let emailErrorElement = await page.getByTestId('emailInputErrorMessage')
  const passwordErrorElement = await page.getByTestId(
    'passwordInputErrorMessage'
  )
  await expect(emailErrorElement).toHaveText('La valeur est requise', {
    useInnerText: true,
  })
  await expect(passwordErrorElement).toHaveText('La valeur est requise', {
    useInnerText: true,
  })
  await expect(page).toHaveURL('/fr/login')

  // Check validation messages for empty fields

  await emailInput.fill('admin@')
  await submitButton.click()
  emailErrorElement = await page.getByTestId('emailInputErrorMessage')
  await expect(emailErrorElement).toHaveText(
    "Le format de l'adresse e-mail est invalide.",
    { useInnerText: true }
  )

  // Check validation message when log in with incorrect credentials

  await emailInput.fill('admin@example.com')
  await passwordInput.fill('WrongPassword')
  await submitButton.click()

  // TODO: Remplacer analyse de la requette par la détection d'un toast d'erreur
  const unsuccessResponse = await (
    await page.waitForResponse(
      (response) =>
        response.url() === authentificationURL && response.status() === 401
    )
  ).json()

  await expect(unsuccessResponse).toEqual({
    code: 401,
    message: 'Identifiants invalides.',
  })

  // Check that there is a redirection when there is correct login credentials
  await login(page)
})
