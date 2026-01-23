/* eslint-disable testing-library/prefer-screen-queries */
import { Page, expect, test } from '@playwright/test'
import { login } from '../../../../helper/auth'
import { navigateTo } from '../../../../helper/menu'
import { TestId, generateTestId } from '../../../../helper/testIds'
import { Grid } from '../../../../helper/grid'
import { Dropdown } from '../../../../helper/dropdown'
import { Tabs } from '../../../../helper/tabs'

const jobResourceName = 'Job'

const texts = {
  labelMenuPage: 'Import / Export',
  jobProfileValue: 'Thesaurus export',
  profile: {
    thesaurusExport: 'Thesaurus export',
  },
  status: {
    new: 'New',
  },
  gridHeaders: {
    profile: 'Profile',
    status: 'Status',
  },
  tabs: {
    import: 'Import',
    export: 'Export',
  },
}

interface IExportResourceConfig {
  name: string
  fileName?: string
  profileDisplayName?: string
  expectedStatus?: string
  modalTitle?: string
}

const exportResourceConfigInputs: Record<string, IExportResourceConfig> = {
  thesaurus: { name: 'thesaurus' },
}

function uppercaseFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getResourceConfig(name: string): Required<IExportResourceConfig> {
  const input = exportResourceConfigInputs[name]
  if (!input) {
    throw new Error(`No configuration found for resource: ${name}`)
  }

  const displayName =
    input.profileDisplayName ?? `${uppercaseFirstLetter(name)} export`

  return {
    name,
    fileName: input.fileName ?? `${name}.csv`,
    profileDisplayName: displayName,
    expectedStatus: input.expectedStatus ?? 'New',
    modalTitle: input.modalTitle ?? displayName,
  }
}

async function testResourceExport(
  page: Page,
  resourceName: string
): Promise<void> {
  const config = getResourceConfig(resourceName)
  await test.step('Login and navigate to the Exports page', async () => {
    await login(page)
    // Default page tab is import
    await navigateTo(page, texts.labelMenuPage, '/admin/importexport/import')
    // We then navigate to the export subtab
    const tabs = new Tabs(page)
    await tabs.expectToHaveTabs(Object.values(texts.tabs))
    await tabs.navigateTo(texts.tabs.export, '/admin/importexport/export')
  })

  await test.step('Check profile list and run profile', async () => {
    const exportProfileDropdown = new Dropdown(page, generateTestId(TestId.JOBPROFILE, 'export'))
    await exportProfileDropdown.selectValue(config.profileDisplayName)

    const createExportJobButton = page.getByTestId(
      generateTestId(TestId.IMPORT_EXPORT_PROFILE_RUN, 'export')
    )
    await expect(createExportJobButton).toBeDefined()
    await createExportJobButton.click()
  })

  await test.step('Check a new job was added to the list', async () => {
    const grid = new Grid(page, jobResourceName)
    await grid.expectToBeVisible()
    await grid.expectToFindLineWhere([
      {
        columnName: texts.gridHeaders.profile,
        value: config.profileDisplayName,
      },
      {
        columnName: texts.gridHeaders.status,
        value: config.expectedStatus,
      },
    ])
    // We can't run crons that are necessary to handle downloadable file creations during e2e test
    // TODO: find a way to run them once and test that the file is generated and contains the expected content
  })
}

const exportableResources = {
  premium: ['thesaurus'],
  // standard: ['source_field']
}

test.describe('Pages > Import / Export > Export', {tag: ['@premium']}, () => {
  for (const resourceName of exportableResources.premium) {
    test(uppercaseFirstLetter(resourceName), async ({ page }) => {
      await testResourceExport(page, resourceName)
    })
  }
})
