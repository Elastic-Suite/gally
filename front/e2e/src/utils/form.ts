import {TestId, generateTestId} from "./testIds";
import {expect, Page} from "@playwright/test";

export function getCommonFormTestIds(
  resourceName: string,
) {
  return {
      submitButton: generateTestId(TestId.BUTTON, 'submit'),
      deleteButton: generateTestId(TestId.BUTTON, 'delete'),
      backButton: generateTestId(TestId.BUTTON, 'back'),
      deletePopin: {
        dialogConfirmButton: generateTestId(TestId.DIALOG_CONFIRM_BUTTON, resourceName),
      },
  } as const
}

export async function deleteEntity(page: Page, deleteButton: string, poinConfirmButton: string, gridUrl: string): Promise<void> {
  await page.getByTestId(deleteButton).click()
  await page.getByTestId(poinConfirmButton).click()
  await expect(page).toHaveURL(gridUrl)
}
