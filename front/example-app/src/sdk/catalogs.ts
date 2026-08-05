import { BASE_URI } from './index';

export interface ICatalog {
  id: number;
  code: string;
  name: string;
  localizedCatalogs: ILocalizedCatalog[];
}

export interface ILocalizedCatalog {
  id: number;
  code: string;
  name: string;
  locale: string;
  currency: string;
  isDefault: boolean;
  catalogId: number;
}

export interface ICategoryNode {
  id: string;
  name: string;
  level: number;
  path: string;
  isVirtual: boolean;
  count: number;
  children?: ICategoryNode[];
}

// Maps ILocalizedCatalog.locale (e.g. "fr_FR") to the app's i18next language code.
export const LANGUAGES: Record<string, string> = {
  fr_FR: 'fr',
  en_US: 'en',
  de_DE: 'de',
};

export const DEFAULT_LANGUAGE = 'en';

export async function fetchCatalogs(): Promise<ICatalog[]> {
  const res = await fetch(`${BASE_URI}/catalogs`, {
    headers: { Accept: 'application/ld+json' },
  });
  const data = await res.json();
  return (data['hydra:member'] || []).map((c: any) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    localizedCatalogs: (c.localizedCatalogs || []).map((lc: any) => ({
      id: lc.id,
      code: lc.code,
      name: lc.name,
      locale: lc.locale,
      currency: lc.currency,
      isDefault: lc.isDefault,
      catalogId: c.id,
    })),
  }));
}

export async function fetchCategoryTree(catalogId: number, localizedCatalogId: number): Promise<ICategoryNode[]> {
  const query = `{ getCategoryTree(catalogId: ${catalogId}, localizedCatalogId: ${localizedCatalogId}) { categories } }`;
  const res = await fetch(`${BASE_URI}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  const root = data?.data?.getCategoryTree?.categories || [];
  // The root is usually a single "Default Category" node wrapping the real top-level
  // categories as children. Keep it as its own (childless) leading entry — it's the
  // "browse everything" link the nav bar should show first — followed by its children
  // as the actual top-level categories.
  if (root.length === 1 && root[0].children) {
    const { children, ...defaultCategory } = root[0];
    return [defaultCategory, ...children];
  }
  return root;
}
