import { Locator, Page, expect } from '@playwright/test'
import { TestId, generateTestId } from '../utils/testIds'
import path from 'node:path'

/**
 * Helper class for interacting with file upload dropzones in Playwright tests.
 */
export class FileUpload {
  private page: Page
  private resourceName: string
  private componentId: string

  private dropzone: Locator
  private uploadButton: Locator
  private selectedFileName: Locator

  /**
   * Creates a new FileUpload instance.
   *
   * @param page - The Playwright Page object
   * @param resourceName - The resource name used in the API endpoint (e.g., 'job_file')
   * @param componentId - The component ID used to generate data-testid for the dropzone
   */
  constructor(page: Page, resourceName: string, componentId?: string) {
    this.page = page
    this.resourceName = resourceName
    this.componentId = componentId
  }

  /**
   * Gets the dropzone locator (lazy initialization).
   */
  private getDropzone(): Locator {
    if (!this.dropzone) {
      this.dropzone = this.page.getByTestId(
        generateTestId(TestId.FILE_UPLOAD_DROPZONE, this.componentId)
      )
    }
    return this.dropzone
  }

  /**
   * Gets the upload button locator (lazy initialization).
   */
  private getUploadButton(): Locator {
    if (!this.uploadButton) {
      const dropzone = this.getDropzone()
      this.uploadButton = dropzone.getByTestId(
        generateTestId(TestId.BUTTON, 'upload')
      )
    }
    return this.uploadButton
  }

  /**
   * Gets the selected file name locator (lazy initialization).
   */
  private getSelectedFileName(): Locator {
    if (!this.selectedFileName) {
      const dropzone = this.getDropzone()
      this.selectedFileName = dropzone.getByTestId(
        TestId.FILE_UPLOAD_DROPZONE_SELECTED_FILE_NAME
      )
    }
    return this.selectedFileName
  }

  /**
   * Checks that the upload dropzone exists and is visible.
   */
  public async expectDropzoneToExist(): Promise<void> {
    const dropzone = this.getDropzone()
    await expect(dropzone).toBeVisible()
  }

  /**
   * Uploads a file by selecting it through the file chooser.
   *
   * @param filePath - Absolute or relative path to the file to upload
   * @param baseDir - Optional base directory (defaults to __dirname if filePath is relative)
   */
  public async uploadFile(filePath: string, baseDir?: string): Promise<void> {
    const dropzone = this.getDropzone()
    const selectedFileName = this.getSelectedFileName()

    // Resolve the full file path
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(baseDir || __dirname, filePath)

    // Extract just the filename for verification
    const fileName = path.basename(fullPath)

    // Start waiting for file chooser before clicking
    const fileChooserPromise = this.page.waitForEvent('filechooser')
    await dropzone.click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(fullPath)

    // Verify the file name is displayed
    await expect(selectedFileName).toContainText(fileName)
  }

  /**
   * Clicks the upload button and waits for the upload to complete successfully.
   *
   * @param onSuccess - Optional callback to execute after successful upload
   */
  public async clickUploadAndWaitForSuccess(
    onSuccess?: () => Promise<void> | void
  ): Promise<void> {
    const uploadButton = this.getUploadButton()

    // Verify upload button is enabled
    await expect(uploadButton).not.toBeDisabled()

    // Wait for the API response
    const uploadResponse = this.page.waitForResponse(
      `**/api/${this.resourceName}**`
    )

    await uploadButton.click()
    await uploadResponse

    // Execute the success callback if provided
    if (onSuccess) {
      await onSuccess()
    }
  }

  /**
   * Expects the upload button to be visible.
   */
  public async expectUploadButtonToBeVisible(): Promise<void> {
    const uploadButton = this.getUploadButton()
    await expect(uploadButton).toBeVisible()
  }

  /**
   * Expects the upload button to be enabled.
   */
  public async expectUploadButtonToBeEnabled(): Promise<void> {
    const uploadButton = this.getUploadButton()
    await expect(uploadButton).not.toBeDisabled()
  }

  /**
   * Expects the selected file name to contain specific text.
   *
   * @param fileName - Expected file name text
   */
  public async expectSelectedFileNameToContain(fileName: string): Promise<void> {
    const selectedFileName = this.getSelectedFileName()
    await expect(selectedFileName).toContainText(fileName)
  }
}
