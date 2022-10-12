import { VariableType, jsonToGraphQLQuery } from 'json-to-graphql-query'

import { IProductFieldFilterInput } from '../types'

export function getSearchProductsQuery(
  filter: IProductFieldFilterInput = null
): string {
  return jsonToGraphQLQuery({
    query: {
      __name: 'getProducts',
      __variables: {
        catalogId: 'String!',
        currentPage: 'Int',
        pageSize: 'Int',
        search: 'String',
        sort: 'ProductSortInput',
      },
      searchProducts: {
        __args: {
          catalogId: new VariableType('catalogId'),
          currentPage: new VariableType('currentPage'),
          pageSize: new VariableType('pageSize'),
          search: new VariableType('search'),
          sort: new VariableType('sort'),
          filter,
        },
        collection: {
          __on: {
            __typeName: 'Product',
            id: true,
            sku: true,
            name: true,
            score: true,
            stock: {
              status: true,
            },
            price: {
              price: true,
            },
          },
        },
        paginationInfo: {
          lastPage: true,
          itemsPerPage: true,
          totalCount: true,
        },
      },
    },
  })
}

export const getProductPined = `query pined($catalogId : String!,) { searchProducts(
  catalogId:"com_en" filter:[
    {id:{in:[1164,1165]}}
    {category__id:{eq:"cat_2"}}
  ]){
    collection {
      id
      data
    }
  }
}
`

export const getProductPostion = `query getPosition( $categoryId: String!,  $localizedCatalogId : Int! ) {
  getPositionsCategoryProductMerchandising(categoryId: $categoryId, localizedCatalogId : $localizedCatalogId ) {
    result
  }
}
`
