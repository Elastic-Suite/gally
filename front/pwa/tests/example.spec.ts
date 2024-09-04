import { test, expect } from '@playwright/test';

test('Login', async ({page}) => {
  await page.goto('/fr/login');

  await page.getByTestId("submitButton").click()
  const emailErrorElement = await page.getByTestId("emailInputErrorMessage")
  const passwordErrorElement = await page.getByTestId("passwordInputErrorMessage")
  await expect(emailErrorElement).toHaveText("La valeur est requise")
  await expect(passwordErrorElement).toHaveText("La valeur est requise")

  await expect(page).toHaveURL("/fr/login")
  await page.getByTestId("emailInput").fill("admin@")
  await expect(emailErrorElement).toHaveText("formError.emailInput")

  await page.getByTestId("emailInput").fill("admin@example.com")
  await page.getByTestId("passwordInput").fill("WrongPassword")
  await page.getByTestId("submitButton").click()
  // page.on('response', async (response) => {
  //   const status = response.status();
  //   const path = response.url()
  //   if(status === 401){
  //     const jsonResponse = await response.json();
  //     expect(jsonResponse).toBe({ code: 401, message: 'Invalid credentials.' })
  //   }
  // })

  await page.getByTestId("emailInput").fill("admin@example.com")
  await page.getByTestId("passwordInput").fill("apassword")
  await page.getByTestId("submitButton").click()
  await expect(page).toHaveURL("/fr/admin/settings/scope/catalogs")
})


// test('gally connexion success', async ({ page }) => {
//   await page.getByTestId("emailInput").fill("admin@example.com")
//   await page.getByTestId("passwordInput").fill("apassword")
//   await page.getByTestId("submitButton").click()

//   await expect(page).toHaveURL("/fr/admin/settings/scope/catalogs")
// });

// test('gally connexion invalid email', async ({ page }) => {
//   await page.getByTestId("emailInput").fill("admin@")
//   await page.getByTestId("passwordInput").fill("apassword")
//   await page.getByTestId("submitButton").click()
//   const emailErrorElement = await page.getByTestId("emailInputErrorMessage")

//   await expect(emailErrorElement).toHaveText("formError.emailInput")
//   await expect(page).toHaveURL("/fr/login")
// });

// test('gally connexion empty email', async ({ page }) => {
//   await page.getByTestId("passwordInput").fill("apassword")
//   await page.getByTestId("submitButton").click()
//   const emailErrorElement = await page.getByTestId("emailInputErrorMessage")

//   await expect(emailErrorElement).toHaveText("La valeur est requise")
//   await expect(page).toHaveURL("/fr/login")
// });

// test('gally connexion empty password', async ({ page }) => {
//   await page.getByTestId("emailInput").fill("admin@example.com")
//   await page.getByTestId("submitButton").click()
//   const passwordErrorElement = await page.getByTestId("passwordInputErrorMessage")

//   await expect(passwordErrorElement).toHaveText("La valeur est requise")
//   await expect(page).toHaveURL("/fr/login")
// });

// test('gally connexion empty password and empty email', async ({ page }) => {
//   await page.getByTestId("submitButton").click()
//   const emailErrorElement = await page.getByTestId("emailInputErrorMessage")
//   const passwordErrorElement = await page.getByTestId("passwordInputErrorMessage")

//   await expect(emailErrorElement).toHaveText("La valeur est requise")
//   await expect(passwordErrorElement).toHaveText("La valeur est requise")
//   await expect(page).toHaveURL("/fr/login")
// });

// test('gally connexion invalid credential', async ({ page }) => {
//   await page.getByTestId("emailInput").fill("admin@example.comd")
//   await page.getByTestId("passwordInput").fill("apasswordd")
//   await page.getByTestId("submitButton").click()
//   const invalidCredentials = await page.getByText("Invalid credentials.")
//   await expect(invalidCredentials).toBeVisible()
//   await expect(page).toHaveURL("/fr/login")
// });

// test('gally redirection when the user is authenticated', async ({ page }) => {
//   await page.getByTestId("emailInput").fill("admin@example.com")
//   await page.getByTestId("passwordInput").fill("apassword")
//   await page.getByTestId("submitButton").click()

//   await expect(page).toHaveURL("/fr/admin/settings/scope/catalogs")
//   await page.goto("/fr/login")
//   await expect(page).toHaveURL("/fr/admin/settings/scope/catalogs")
// });