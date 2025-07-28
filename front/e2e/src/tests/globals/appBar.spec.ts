import {test, expect} from '@playwright/test'
import {login} from '../../helper/auth'
import {generateTestId, TestId} from "../../helper/testIds";

const testIds = {
  appBar: generateTestId(TestId.APP_BAR),
  userMenu: generateTestId(TestId.USER_MENU),
  logOutButton: generateTestId(TestId.LOG_OUT_BUTTON),
  breadcrumbs: generateTestId(TestId.BREADCRUMBS),
  helpTooltip: generateTestId(TestId.HELP_TOOLTIP),
  helpOver: generateTestId(TestId.HELP_OVER),
  username: generateTestId(TestId.USER_NAME),
  userEmail: generateTestId(TestId.USER_EMAIL)
}

const texts = {
  email: 'Admin@example.com',
  username: 'Admin@example.com'
}

test('Globals > Layout > App Bar', {tag: ['@premium', '@standard']}, async ({page}) => {
  await login(page)

  const appBar = page.getByTestId(testIds.appBar)
  const breadcrumbs = appBar.getByTestId(testIds.breadcrumbs)
  const tooltip = appBar.getByTestId(testIds.helpTooltip)
  const tooltipOver = tooltip.getByTestId(testIds.helpOver)
  const userMenu = appBar.getByTestId(testIds.userMenu)

  // Global Tests
  await expect(breadcrumbs).toBeVisible()
  await expect(tooltip).toBeVisible()
  await expect(tooltipOver).not.toBeVisible()
  await expect(userMenu).toBeVisible()

  // ToolTip tests
  await tooltip.hover()
  await expect(tooltipOver).toBeVisible()

  // UserMenu tests
  const username = userMenu.getByTestId(testIds.username)
  const email = userMenu.getByTestId(testIds.userEmail)
  const logOutButton = userMenu.getByTestId(testIds.logOutButton)

  await expect(username).toBeVisible()
  await expect(username).toHaveText(texts.username, {useInnerText: true})
  await expect(email).not.toBeVisible()
  await expect(logOutButton).not.toBeVisible()

  await userMenu.click()

  await expect(email).toBeVisible()
  await expect(logOutButton).toBeVisible()
  await expect(email).toHaveText(texts.email, {useInnerText: true})

  await logOutButton.click()

  await expect(page).toHaveURL(
    `/login`
  )
  await login(page)
})
