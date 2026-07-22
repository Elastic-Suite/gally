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

export const CURRENCIES: Record<string, string> = {
  EUR: '€',
  GBP: '£',
  USD: '$',
};

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
  // The root is usually a single "Default Category" node — return its children
  if (root.length === 1 && root[0].children) {
    return root[0].children;
  }
  return root;
}
