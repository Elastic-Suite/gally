import { expect, test } from '@playwright/test'
import { login } from '../../../../helper/auth'
import { navigateTo } from '../../../../helper/menu'
import { Dropdown } from '../../../../helper/dropdown'
import { Tabs } from '../../../../helper/tabs'

const testIds = {
  form: {
    configurationForm: 'configuration-form',
    scopeDropdown: 'configurationScopeType',
    saveButton: 'submit',
  },
  fields: {
    // These would be actual configuration field test IDs - adjust based on your actual config fields
    textField: 'inputText|gally.base_url.media',
    numberField: 'configuration-number-field',
    booleanField: 'configuration-boolean-field',
  }
}

const texts = {
  labelMenuPage: 'Configuration',
  scopes: {
    general: 'General',
    catalog: 'Catalog',
    store: 'Store',
  },
  saveButton: 'Save',
  successMessage: 'Configuration updated successfully',
  tabs: {
    scope: "Scope",
    attributes: "Searchable and filterable attributes",
    configurations: "Configurations",
    user: "Users",
  }
}

// Test configuration values for different scopes
const testValues = {
  general: {
    textValue: 'General Config Value',
    numberValue: '100',
    booleanValue: true,
  },
  catalog: {
    textValue: 'Catalog Config Value',
    numberValue: '200',
    booleanValue: false,
  },
  store: {
    textValue: 'Store Config Value',
    numberValue: '300',
    booleanValue: true,
  }
}

test('Pages > Configuration > Configuration Form', { tag: ['@premium', '@standard'] }, async ({ page }) => {
  await test.step('Login and navigate to the configuration form page', async () => {
    await login(page)
    await navigateTo(
      page,
      texts.labelMenuPage,
      '/admin/settings/scope/catalogs'
    )

    const tabs = new Tabs(page)
    await tabs.expectToHaveTabs(Object.values(texts.tabs))
    await tabs.navigateTo(texts.tabs.configurations, '/admin/settings/configurations')
  })

  const scopeDropdown = new Dropdown(page, testIds.form.scopeDropdown)

  await test.step('Verify configuration form is displayed', async () => {
    // Check that the form is visible
    await expect(page.getByTestId(testIds.form.configurationForm)).toBeVisible()

    // Check that scope dropdown is present and has default value
    await scopeDropdown.expectToBeVisible()
    await scopeDropdown.expectToHaveValue(texts.scopes.general)

    // Check that save button is present
    await expect(page.getByTestId(testIds.form.saveButton)).toBeVisible()

    // Verify configuration fields are displayed
    await expect(page.getByTestId(testIds.fields.textField)).toBeVisible()
  })

  await test.step('Update configuration values and save', async () => {
    // Fill in configuration values for general scope
    await page.getByTestId(testIds.fields.textField).fill(testValues.general.textValue)

    // Save the configuration
    await page.getByTestId(testIds.form.saveButton).click()

    // Wait for success message or form to update
    await expect(page.locator('text=' + texts.successMessage)).toBeVisible({ timeout: 10000 })
  })

  await test.step('Reload page and verify values are persisted', async () => {
    // Reload the page
    await page.reload()

    // Wait for form to load
    await expect(page.getByTestId(testIds.form.configurationForm)).toBeVisible()

    // Verify that the saved values are still present
    await expect(page.getByTestId(testIds.fields.textField)).toHaveValue(testValues.general.textValue)
  })

  await test.step('Change scope and verify values update', async () => {
    // Change scope to catalog
    await scopeDropdown.selectValue(texts.scopes.catalog)

    // Wait for form to update with new scope values
    await page.waitForTimeout(1000) // Give time for API call to complete

    // Verify that values have changed (should be different from general scope or empty)
    const textFieldValue = await page.getByTestId(testIds.fields.textField).inputValue()

    // Values should be different from general scope values
    expect(textFieldValue).not.toBe(testValues.general.textValue)
  })

  await test.step('Set values for catalog scope and save', async () => {
    // Fill in configuration values for catalog scope
    await page.getByTestId(testIds.fields.textField).fill(testValues.catalog.textValue)

    // Save the configuration
    await page.getByTestId(testIds.form.saveButton).click()

    // Wait for success message
    await expect(page.locator('text=' + texts.successMessage)).toBeVisible({ timeout: 10000 })
  })

  await test.step('Switch between scopes and verify different values', async () => {
    // Switch back to general scope
    await scopeDropdown.selectValue(texts.scopes.general)
    await page.waitForTimeout(1000)

    // Verify general scope values are restored
    await expect(page.getByTestId(testIds.fields.textField)).toHaveValue(testValues.general.textValue)
    // Switch to catalog scope
    await scopeDropdown.selectValue(texts.scopes.catalog)
    await page.waitForTimeout(1000)

    // Verify catalog scope values are shown
    await expect(page.getByTestId(testIds.fields.textField)).toHaveValue(testValues.catalog.textValue)
  })

  await test.step('Verify save button is disabled when no changes are made', async () => {
    // Ensure we're on a scope with saved values
    await scopeDropdown.selectValue(texts.scopes.general)
    await page.waitForTimeout(1000)

    // Save button should be disabled when no changes are made
    await expect(page.getByTestId(testIds.form.saveButton)).toBeDisabled()

    // Make a change
    await page.getByTestId(testIds.fields.textField).fill(testValues.general.textValue + ' Modified')

    // Save button should now be enabled
    await expect(page.getByTestId(testIds.form.saveButton)).toBeEnabled()

    // Revert the change
    await page.getByTestId(testIds.fields.textField).fill(testValues.general.textValue)

    // Save button should be disabled again
    await expect(page.getByTestId(testIds.form.saveButton)).toBeDisabled()
  })

  await test.step('Test form validation', async () => {
    // Clear a required field to test validation
    await page.getByTestId(testIds.fields.textField).fill('')

    // Try to save
    await page.getByTestId(testIds.form.saveButton).click()

    // Should show validation error
    await expect(page.locator('text=Invalid configurations')).toBeVisible({ timeout: 5000 })

    // Fill the field back
    await page.getByTestId(testIds.fields.textField).fill(testValues.general.textValue)
  })
})
