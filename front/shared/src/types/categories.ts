import { IJsonldBase } from './jsonld'

export interface ICategory {
  id: string
  isVirtual: boolean
  name: string
  path: string
  level: number
  children?: ICategory[]
  catalogName?: string
}

export interface ICategories extends IJsonldBase {
  catalogId?: number
  localizedCatalogId?: number
  categories?: ICategory[]
}

export interface IGraphqlCategories {
  getCategoryTree: Partial<ICategories>
}
