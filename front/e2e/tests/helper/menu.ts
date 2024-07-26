import { Page, expect } from '@playwright/test'

export async function navigateTo(
  page: Page,
  menuItemLabel: string,
  expectedURL?: string
) {
  const sidebarMenu = await page.getByTestId('sidebarMenu')
  const link = await sidebarMenu.getByText(menuItemLabel)
  await link.click()
  if (expectedURL) {
    await expect(page).toHaveURL(expectedURL)
  }
}
