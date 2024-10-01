import { test, expect } from '@playwright/test'
import { login } from '../helper'

const expectedLinks = [
  {
    label: 'Helpdesk',
    path: 'https://elasticsuite.zendesk.com',
  },
  {
    label: 'User guide',
    path: 'https://elastic-suite.github.io/documentation/',
  },
]

test('Header', async ({ page }) => {
  await login(page)

  const tooltip = await page.getByTestId('helpToolTip')
  const tooltipOver = await page.getByTestId('helpOver')

  expect(tooltip).toBeVisible()
  expect(tooltipOver).not.toBeVisible()

  await tooltip.hover()
  await expect(tooltipOver).toBeVisible()

  const links = await tooltipOver.locator('a').all()

  for (const [index, expectedLink] of expectedLinks.entries()) {
    await expect(await links[index].innerText()).toBe(expectedLink.label)
    await expect(links[index]).toHaveAttribute('href', expectedLink.path)
    await expect(links[index]).toBeVisible()
  }

  const userMenu = await page.getByTestId('userMenu')
  const userMenuContent = await page.getByTestId('userMenuContent')

  await expect(userMenu).toHaveText("Admin@example.com",{useInnerText: true})

  await expect(userMenuContent).not.toBeVisible()
  await userMenu.click()
  await expect(userMenuContent).toBeVisible()

  await expect(await userMenuContent.getByText("Admin@example.com")).toBeVisible()

  await userMenuContent.getByText('Déconnexion').click()

  await expect(page).toHaveURL('https://localhost/fr/login')

  await login(page)
})
