import { test, expect, Page } from '@playwright/test'

const authentificationURL = 'https://api.gally.localhost/authentication_token'

async function initLoginTest(page: Page){
  await page.goto('/fr/login')

  const emailInput = await page.getByTestId('emailInput')
  const passwordInput = await page.getByTestId('passwordInput')
  const submitButton = await page.getByTestId('submitButton')

  return {emailInput, passwordInput, submitButton}
}

test.describe("Login Page",{
  tag: "@standard"
},() => {
  test("Check validation messages for empty fields", async({page}) => {
    const {submitButton} = await initLoginTest(page)
    await submitButton.click()
    const emailErrorElement = await page.getByTestId('emailInputErrorMessage')
    const passwordErrorElement = await page.getByTestId(
      'passwordInputErrorMessage'
    )
    await expect(emailErrorElement).toHaveText('La valeur est requise')
    await expect(passwordErrorElement).toHaveText('La valeur est requise')
  
    // Verify that the URL remains the same
    await expect(page).toHaveURL('/fr/login')
  })
  
  test("Check validation messages for invalid email format", async ({page}) => {
    const {emailInput, submitButton} = await initLoginTest(page)
    await emailInput.fill('admin@')
    await submitButton.click()
    const emailErrorElement = await page.getByTestId('emailInputErrorMessage')
    await expect(emailErrorElement).toHaveText('formError.emailInput')
  })

  test("Check validation message when log in with incorrect credentials", async ({page}) => {
    const {emailInput, passwordInput, submitButton} = await initLoginTest(page)
    
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
      message: 'Identifiants invalides.',
    })
  })

  test("Check that there is a redirection when there is correct login credentials", async ({page}) => {
    const {emailInput, passwordInput, submitButton} = await initLoginTest(page)
 
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
})