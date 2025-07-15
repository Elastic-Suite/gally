export enum ComponentTestPrefix {
  CATALOGS = 'catalogs',
  LANGUAGE = 'language',
  MENU_ITEM_ICON = 'menuItemIcon',
}

type testIdSuffix = `-${string}`| ''
export type TestId = `${ComponentTestPrefix}${testIdSuffix}`

function normalizeId(id: string): testIdSuffix {
  return `-${id?.toLowerCase().replace(/[^a-z0-9]/g, '')}`
}

export function generateTestId(prefix: ComponentTestPrefix, id?: string): TestId {
  return `${prefix}${id ? normalizeId(id) : ''}`
}
