/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@playwright/test'
import { login } from '../../../../helper/auth'
import { navigateTo } from '../../../../helper/menu'
import { Dropdown } from '../../../../helper/dropdown'
import { Tabs } from '../../../../helper/tabs'
import { TestId, generateTestId } from '../../../../helper/testIds'
import { Switch } from '../../../../helper/switch'

const testIds = {
  form: {
    scopeDropdown: 'configurationScopeType',
    saveButton: generateTestId(TestId.BUTTON, 'submit'),
  },
  fields: {
    baseUrlField: generateTestId(TestId.INPUT_TEXT, 'gally.base_url.media'),
    defaultSenderField: generateTestId(TestId.INPUT_TEXT, 'gally.email.default_sender'),
    highlightCollectorFieldsSwitch: generateTestId(TestId.SWITCH, 'gally_explain.highlight_collector_fields'),
  },
}

const texts = {
  labelMenuPage: 'Configuration',
  scopes: {
    general: 'All localized catalogs',
    catalog: 'COM French Catalog',
  },
  saveButton: 'Save',
  successMessageOneConfig: '1 configuration has been updated',
  errorMessageOneConfig: '1 configuration is missing or invalid',
  tabs: {
    scope: "Scope",
    attributes: "Attributes",
    configurations: "Configurations",
    user: "Users",
  },
  configurationSubtabs: {
    general: 'General',
    index: 'Index',
    search: 'Search',
    boost: 'Boost',
    thesaurus: 'Thesaurus',
    vectorSearch: 'Recherche vectorielle',
    explain: 'Explain',
  }
}

// Test configuration values for different scopes
const testValues = {
  general: {
    baseUrl: `https://example.com/media/catalog/product${Math.random()}`,
    defaultSender: `contactgeneral${Math.random()}@example.com`,
  },
  catalog: {
    baseUrl: `https://example.com/media/catalog/productcatalog${Math.random()}`,
    defaultSender: `contactcatalog${Math.random()}@example.com`,
  },
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
    await expect(page.getByTestId(TestId.CONFIGURATION_FORM)).toBeVisible()

    // Check that scope dropdown is present and has default value
    await scopeDropdown.expectToBeVisible()
    await scopeDropdown.expectToHaveValue(texts.scopes.general)

    // Check that save button is present
    await expect(page.getByTestId(testIds.form.saveButton)).toBeVisible()

    // Verify configuration fields are displayed
    await expect(page.getByTestId(testIds.fields.baseUrlField)).toBeVisible()
    await expect(page.getByTestId(testIds.fields.defaultSenderField)).toBeVisible()

    // Verify configuration fields have a value
    await expect(page.getByTestId(testIds.fields.defaultSenderField)).not.toBeEmpty()
  })


  await test.step('Verify configuration subtabs are present', async () => {
    // Expected subtabs based on the configuration groups
    const expectedSubtabs = Object.values(texts.configurationSubtabs)

    // Check presence of all subtabs
    const configurationTabs = new Tabs(page,'configurationsGroups')
    await configurationTabs.expectToHaveTabs(expectedSubtabs)
  })

  await test.step('Update configuration values and save', async () => {
    // Fill in configuration values for general scope
    await page.getByTestId(testIds.fields.defaultSenderField).fill(testValues.general.defaultSender)

    // Save the configuration
    await page.getByTestId(testIds.form.saveButton).click()

    // Wait for success message or form to update
    await expect(page.locator(`text=${texts.successMessageOneConfig}`)).toBeVisible({ timeout: 10000 })
  })

  await test.step('Reload page and verify values are persisted', async () => {
    // Reload the page
    await page.reload()

    // Wait for form to load
    await expect(page.getByTestId(TestId.CONFIGURATION_FORM)).toBeVisible()

    // Verify that the saved values are still present
    await expect(page.getByTestId(testIds.fields.defaultSenderField)).toHaveValue(testValues.general.defaultSender)
  })

  await test.step('Change scope and save scoped value', async () => {
    // Change scope to catalog
    await scopeDropdown.selectValue(texts.scopes.catalog)

    // Wait for form to update with new scope values
    await page.waitForTimeout(1000) // Give time for API call to complete

    // Fill in configuration values for general scope
    await page.getByTestId(testIds.fields.defaultSenderField).fill(testValues.catalog.defaultSender)

    // Save the configuration
    await page.getByTestId(testIds.form.saveButton).click()

    // Wait for success message or form to update
    await expect(page.locator(`text=${  texts.successMessageOneConfig}`)).toBeVisible({ timeout: 10000 })
  })

  await test.step('Switch between scopes and verify different values', async () => {
    // Switch back to general scope
    await scopeDropdown.selectValue(texts.scopes.general)
    await page.waitForTimeout(1000)

    // Verify general scope values are restored
    await expect(page.getByTestId(testIds.fields.defaultSenderField)).toHaveValue(testValues.general.defaultSender)
    // Switch to catalog scope
    await scopeDropdown.selectValue(texts.scopes.catalog)
    await page.waitForTimeout(1000)

    // Verify catalog scope values are shown
    await expect(page.getByTestId(testIds.fields.defaultSenderField)).toHaveValue(testValues.catalog.defaultSender)
  })

  await test.step('Verify save button is disabled when no changes are made', async () => {
    // Ensure we're on a scope with saved values
    await scopeDropdown.selectValue(texts.scopes.general)
    await page.waitForTimeout(1000)

    // Save button should be disabled when no changes are made
    await expect(page.getByTestId(testIds.form.saveButton)).toBeDisabled()

    // Make a change
    await page.getByTestId(testIds.fields.defaultSenderField).fill(`${testValues.general.defaultSender}2`)

    // Save button should now be enabled
    await expect(page.getByTestId(testIds.form.saveButton)).toBeEnabled()

    // Revert the change
    await page.getByTestId(testIds.fields.defaultSenderField).fill(testValues.general.defaultSender)

    // Save button should be disabled again
    await expect(page.getByTestId(testIds.form.saveButton)).toBeDisabled()
  })

  await test.step('Test form validation', async () => {
    // Clear a required field to test validation
    await page.getByTestId(testIds.fields.defaultSenderField).fill('')

    // Try to save
    await page.getByTestId(testIds.form.saveButton).click()

    // Should show validation error
    await expect(page.locator(`text=${texts.errorMessageOneConfig}`)).toBeVisible({ timeout: 5000 })

    // Fill the field back
    await page.getByTestId(testIds.fields.defaultSenderField).fill(testValues.general.defaultSender)
  })

  await test.step('Navigate to Explain tab and test switch functionality', async () => {
    // Navigate to the Explain subtab
    const configurationTabs = new Tabs(page,'configurationsGroups')
    await configurationTabs.navigateTo('Explain')

    // Wait for the Explain tab content to load
    await page.waitForTimeout(1000)

    // Check for the presence of the boolean field for highlight collector fields
    const highlightCollectorFieldsSwitch = new Switch(page, 'gally_explain.highlight_collector_fields')
    await highlightCollectorFieldsSwitch.expectToBeVisible()

    // Test the switch functionality
    await highlightCollectorFieldsSwitch.expectToBeChecked()

    // Toggle the switch
    await highlightCollectorFieldsSwitch.toggle()

    // Verify the state changed
    await highlightCollectorFieldsSwitch.expectToBeChecked(false)

    // Toggle back to original state
    await highlightCollectorFieldsSwitch.toggle()
    await highlightCollectorFieldsSwitch.expectToBeChecked(true)
  })
})
