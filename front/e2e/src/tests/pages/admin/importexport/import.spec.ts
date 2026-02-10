/* eslint-disable testing-library/prefer-screen-queries */
import { Page, expect, test } from '@playwright/test'
import { login } from '../../../../utils/auth'
import { navigateTo } from '../../../../utils/menu'
import { TEST_ID_SEPARATOR, TestId, generateTestId } from '../../../../utils/testIds'
import { Grid } from '../../../../helper/grid'
import { Dropdown } from '../../../../helper/dropdown'
import { FileUpload } from '../../../../helper/fileUpload'
import { getTestFilePath } from '../../../../helper/files'

const jobResourceName = 'Job'

const testIds = {
  grid: generateTestId(TestId.TABLE, jobResourceName),
  createImportJobButton: 'importExportProfileRun',
  downloadJobFileButton: generateTestId(
    TestId.BUTTON,
    [TestId.FILE_DOWNLOADER, TestId.JOBFILE, 'file'].join(TEST_ID_SEPARATOR)
  ),
}

const texts = {
  labelMenuPage: 'Import / Export',
  jobProfileValue: 'Thesaurus',
  profile: {
    thesaurusImport: 'Thesaurus'
  },
  status: {
    new: 'New'
  },
  gridHeaders: {
    profile: 'Profile',
    status: 'Status',
  }
}

interface IImportResourceConfig {
  name: string
  fileName?: string
  profileDisplayName?: string
  expectedStatus?: string
  modalTitle?: string
}

const importResourceConfigInputs: Record<string, IImportResourceConfig> = {
  thesaurus: { name: 'thesaurus' },
}

function uppercaseFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function getResourceConfig(name: string): Required<IImportResourceConfig> {
  const input = importResourceConfigInputs[name]
  if (!input) {
    throw new Error(`No configuration found for resource: ${name}`)
  }

  const displayName =
    input.profileDisplayName ?? uppercaseFirstLetter(name)

  return {
    name,
    fileName: input.fileName ?? `${name}.csv`,
    profileDisplayName: displayName,
    expectedStatus: input.expectedStatus ?? 'New',
    modalTitle: input.modalTitle ?? displayName,
  }
}

async function testResourceImport(
  page: Page,
  resourceName: string
): Promise<void> {
  const config = getResourceConfig(resourceName)
  await test.step('Login and navigate to the Imports page', async () => {
    await login(page)
    await navigateTo(page, texts.labelMenuPage, '/admin/importexport/import')
  })

  await test.step(`Upload a ${config.name} import file`, async () => {
    await uploadImportFile(page, config)
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
  })

  await test.step('Check that the job file is downloadable and matches the uploaded file', async () => {
    const downloadJobFileButton = page.getByTestId(
      testIds.downloadJobFileButton
    )
    expect(downloadJobFileButton).toBeDefined()

    const downloadPromise = page.waitForEvent('download')
    await downloadJobFileButton.click()
    const download = await downloadPromise

    // Get the original file path
    const originalFilePath = getTestFilePath(`job/import/${config.fileName}`)

    // Read the original file content
    const fs = await import('node:fs/promises')
    const originalContent = await fs.readFile(originalFilePath, 'utf-8')

    // Save the downloaded file to a temporary location
    const downloadPath = await download.path()

    // Read the downloaded file content
    const downloadedContent = await fs.readFile(downloadPath, 'utf-8')

    // Compare the contents
    expect(downloadedContent).toBe(originalContent)

    // Optionally verify the filename
    expect(download.suggestedFilename()).toContain(resourceName)
  })
}

async function uploadImportFile(
  page: Page,
  config: Required<IImportResourceConfig>
): Promise<void> {
  await test.step('Check profile list and run profile', async () => {
    const importProfileDropdown = new Dropdown(
      page,
      generateTestId(TestId.JOBPROFILE, 'import')
    )
    await importProfileDropdown.selectValue(config.profileDisplayName)

    const createImportJobButton = page.getByTestId(
      generateTestId(TestId.IMPORT_EXPORT_PROFILE_RUN, 'import')
    )
    await expect(createImportJobButton).toBeDefined()
    await createImportJobButton.click()
  })

  await test.step('Check job file modal and upload a file', async () => {
    const uploadJobFileModal = page.getByTestId(
      generateTestId(TestId.UPLOAD_JOB_FILE_MODAL)
    )
    await expect(uploadJobFileModal).toBeVisible()

    const uploadJobFileModalTitle = page.getByTestId(
      generateTestId(TestId.UPLOAD_JOB_FILE_MODAL_TITLE)
    )
    await expect(uploadJobFileModalTitle).toContainText(config.modalTitle)

    const fileUpload = new FileUpload(page, 'job_file')

    await fileUpload.expectDropzoneToExist()
    await fileUpload.uploadFile(
      getTestFilePath(`job/import/${config.fileName}`)
    )

    await fileUpload.clickUploadAndWaitForSuccess(async () => {
      await expect(uploadJobFileModal).not.toBeVisible()
    })
  })
}

const importableResources = {
  premium: ['thesaurus'],
  // standard: ['source_field']
}

test.describe('Pages > Import / Export > Import', {tag: ['@premium']}, () => {
  for (const resourceName of importableResources.premium) {
    test(uppercaseFirstLetter(resourceName), async ({ page }) => {
      await testResourceImport(page, resourceName)
    })
  }
})
