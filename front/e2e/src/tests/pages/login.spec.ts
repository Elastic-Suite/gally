import {expect, test} from '@playwright/test'
import {login} from '../../helper/auth'
import {AlertMessage, AlertMessageType} from '../../helper/alertMessage'
import {TestId, generateTestId} from "../../helper/testIds";

const testIds = {
  email: generateTestId(TestId.INPUT_TEXT, 'email'),
  password: generateTestId(TestId.INPUT_TEXT, 'password'),
  submitButton: generateTestId(TestId.BUTTON, 'form-submit'),
  emailErrorMessage: generateTestId(TestId.HELPER_TEXT, 'email'),
  passwordErrorMessage: generateTestId(TestId.HELPER_TEXT, 'password'),
}

const texts = {
  errors: {
    required: 'The value is required',
    invalidEmail: 'The email address format is invalid.',
    invalidCredentials: 'Invalid credentials.',
  },
  credentials: {
    email: {
      invalid: 'admin@',
      valid: 'admin@example.com',
    },
    password: {
      invalid: 'wrongPassword',
    }
  }
}

test('Login page', {tag: ['@premium', '@standard']}, async ({page}) => {
  await page.goto('/login')

  // Get inputs and submit button
  const emailInput = await page.getByTestId(testIds.email)
  const passwordInput = await page.getByTestId(testIds.password)
  const submitButton = await page.getByTestId(testIds.submitButton)

  // Error messages locators :
  const emailErrorMessage = page.getByTestId(testIds.emailErrorMessage)
  const passwordErrorMessage = page.getByTestId(testIds.passwordErrorMessage)

  await test.step('Check validation messages for empty fields', async () => {
    await submitButton.click()

    await expect(emailErrorMessage).toHaveText(texts.errors.required, {
      useInnerText: true,
    })
    await expect(passwordErrorMessage).toHaveText(texts.errors.required, {
      useInnerText: true,
    })
    await expect(page).toHaveURL('/login')
  })

  await test.step('Check validation messages for invalid format email', async () => {
    await emailInput.fill(texts.credentials.email.invalid)
    await submitButton.click()
    await expect(emailErrorMessage).toHaveText(texts.errors.invalidEmail, {
      useInnerText: true,
    })
  })

  await test.step('Check validation message when log in with incorrect credentials', async () => {
    await emailInput.fill(texts.credentials.email.valid)
    await passwordInput.fill(texts.credentials.password.invalid)
    await submitButton.click()

    const alertMessage = new AlertMessage(page)
    await alertMessage.expectToHaveText(texts.errors.invalidCredentials, AlertMessageType.ERROR)
  })

  await test.step('Check that there is a redirection when there is correct login credentials', async () => {
    await login(page)
  })
})
