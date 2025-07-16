import { Page, expect, test } from '@playwright/test'

interface IUserCredentials {
  email: `${string}@${string}.${Lowercase<string>}`
  password: string
}

const rolesInfos: Record<UserRole, IUserCredentials> = {
  admin: {
    email: 'admin@example.com',
    password: 'apassword',
  },
  contributor: {
    email: 'contributor@example.com',
    password: 'apassword',
  },
}

export enum UserRole {
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor',
}

export function runTestsAsRoles(
  roles: UserRole[],
  callback: (page: Page, role?: UserRole) => Promise<void>
): void {
  for (const role of roles) {
    // Instantiate an isolated test context for each role
    test(`Test as ${role} role`, async ({ page }) => {
      await login(page, role)
      // Run callback with a page authenticated with the specified role
      await callback(page, role)
    })
  }
}


export async function login(page: Page, role: UserRole = UserRole.ADMIN): Promise<void> {
  await page.goto('/fr/login')

  // Get inputs and submit button
  const emailInput = await page.getByTestId('emailInput')
  const passwordInput = await page.getByTestId('passwordInput')
  const submitButton = await page.getByTestId('submitButton')

  // Fill with correct credentials and submit the form
  await emailInput.fill(rolesInfos[role].email)
  await passwordInput.fill(rolesInfos[role].password)
  await submitButton.click()

  await expect(page).toHaveURL('/fr/admin/settings/scope/catalogs', {})
}
