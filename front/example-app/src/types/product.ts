import {
  IFetch,
  IGraphqlProduct,
  IGraphqlSearchProducts,
} from '@elastic-suite/gally-admin-shared'

import { IEntitiesHook } from './entity'

export interface IProductsHook extends IEntitiesHook {
  loadProducts: (condition: boolean) => void
  products: IFetch<IGraphqlSearchProducts>
}

export interface IProduct extends Omit<IGraphqlProduct, 'price'> {
  price?: number
  image?: string
}

export interface IProductAutoComplete extends IProduct {
  type?: 'product'
}
