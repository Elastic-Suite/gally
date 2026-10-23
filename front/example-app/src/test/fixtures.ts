// Shared test data. Two catalogs with two localized catalogs each, shaped like the
// demo data (com_fr, com_en, fr_fr, fr_en) so URLs in assertions read like real ones.
import type {
  ICatalog,
  ICategoryNode,
  ILocalizedCatalog,
} from '../sdk/catalogs'

function localized(
  id: number,
  code: string,
  locale: string,
  catalogId: number,
  isDefault = false
): ILocalizedCatalog {
  return {
    id,
    code,
    name: code,
    locale,
    currency: 'EUR',
    isDefault,
    catalogId,
  }
}

export const CATALOGS: ICatalog[] = [
  {
    id: 1,
    code: 'com',
    name: 'Fashion',
    localizedCatalogs: [
      localized(11, 'com_en', 'en_US', 1),
      localized(12, 'com_fr', 'fr_FR', 1, true),
    ],
  },
  {
    id: 2,
    code: 'fr',
    name: 'Paper shop',
    localizedCatalogs: [
      localized(21, 'fr_fr', 'fr_FR', 2),
      localized(22, 'fr_en', 'en_US', 2),
    ],
  },
]

export function category(
  id: string,
  name: string,
  children: ICategoryNode[] = []
): ICategoryNode {
  return {
    id,
    name,
    level: 1,
    path: id,
    isVirtual: false,
    count: 1,
    children,
  }
}

export const CATEGORY_TREE: ICategoryNode[] = [
  category('cat_1', 'Dresses', [category('cat_11', 'Long dresses')]),
  category('cat_2', 'Shoes'),
]
