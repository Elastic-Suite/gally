// TODO: factorize this with packages/components/src/utils/testIds.ts
export enum TestId {
  CATALOGS = 'catalogs',
  NB_ACTIVE_LOCALES = 'nbActiveLocales',
  LANGUAGE = 'language',
  MENU_ITEM_ICON = 'menuItemIcon',
}

type ItemId = `|${string}` | ''
export type FullTestId = `${TestId}${ItemId}`

function normalizeItemId(itemId?: string): ItemId {
  return itemId ? `|${itemId}` : ''
}

export function generateTestId(
  testId: TestId,
  itemId?: string
): FullTestId {
  return `${testId}${normalizeItemId(itemId)}`
}
