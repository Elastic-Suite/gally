import { expect, Page, test } from '@playwright/test';
import { login } from '../../utils/auth';
import { navigateTo } from '../../utils/menu';
import { generateTestId, TestId } from '../../utils/testIds';

const texts = {
  labelMenuPageAttributes: 'Attributes',
  labelMenuPageFacets: 'Facets',
  labelMenuPageRecommenderTypes: 'Recommender types',
}

const testIds = {
  menuItemChildrenButton: generateTestId(TestId.MENU_ITEM_CHILDREN_COLLAPSING_BUTTON),
}

const urls = {
  attributesConfigurationForm: '/admin/search/configuration/attributes',
  recommanderTypeGrid: '/admin/merchandize/recommender/recommender_type/grid'
}

async function ensureCollapsibledMenuSectionsAreOpened(page: Page) {
  // Retrieve all toggle buttons for collapsible menu sections
  const menuItemChildrenButtonList = await page
    .getByTestId(testIds.menuItemChildrenButton)
    .all()

  return menuItemChildrenButtonList.every(async m => await m.getAttribute('data-collapsed') === 'true')
}

test('Menu collapsible navigation', { tag: ['@premium', '@standard'] }, async ({ page }) => {
  await test.step('Login', async () => {
    await login(page)
  })

  // First navigate to a menu section that is not inside a collapsible section
  // This first navigation should automatically open all menu collapsible sections 
  await test.step('Navigate to the facets page ', async () => {
    await navigateTo(page, texts.labelMenuPageFacets, '/admin/search/facets')
  })

  // Ensure all collapsible buttons are opened
  expect(await ensureCollapsibledMenuSectionsAreOpened(page)).toBeTruthy()

  if (page.isPremium) {
    // Then navigate to a menu section that is inside a collapsible section
    // All menu sections should already be opened
    await test.step('Navigate to the "Recommender Types" page', async () => {
      await navigateTo(page, texts.labelMenuPageRecommenderTypes, urls.recommanderTypeGrid)
    })
    // Ensure all collapsible buttons are still opened
    expect(await ensureCollapsibledMenuSectionsAreOpened(page)).toBeTruthy()
  }

  // Then navigate to another menu section that is inside a collapsible section
  // All menu sections should still already be opened
  await test.step('Navigate to the attributes page ', async () => {
    await navigateTo(
      page,
      texts.labelMenuPageAttributes,
      urls.attributesConfigurationForm
    )
  })

  // Ensure all collapsible buttons are still opened
  expect(await ensureCollapsibledMenuSectionsAreOpened(page)).toBeTruthy()
})
