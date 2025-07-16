import { test, expect } from '@playwright/test'
import { login } from '../../helper/auth'

test('Header', async ({ page }) => {
  await login(page)

  const appBar = page.getByTestId('appBar')
  const breadcrumbs = appBar.getByTestId('breadcrumbs')
  const tooltip = appBar.getByTestId('helpToolTip')
  const tooltipOver = tooltip.getByTestId('helpOver')
  const userMenu = appBar.getByTestId('userMenu')

  // Global Tests
  await expect(breadcrumbs).toBeVisible()
  await expect(tooltip).toBeVisible()
  await expect(tooltipOver).not.toBeVisible()
  await expect(userMenu).toBeVisible()

  // ToolTip tests
  await tooltip.hover()
  await expect(tooltipOver).toBeVisible()

  // UserMenu tests
  const username = userMenu.getByTestId('username')
  const email = userMenu.getByTestId('userEmail')
  const logOutButton = userMenu.getByTestId('logOutButton')

  await expect(username).toBeVisible()
  await expect(await username.innerText()).toBe('Admin@example.com')
  await expect(email).not.toBeVisible()
  await expect(logOutButton).not.toBeVisible()

  await userMenu.click()

  await expect(email).toBeVisible()
  await expect(logOutButton).toBeVisible()
  await expect(await email.innerText()).toBe('Admin@example.com')

  await logOutButton.click()

  await expect(page).toHaveURL(
    `${process.env.SERVER_BASE_URL || 'https://gally.local'}/login`
  )
  await login(page)
})
