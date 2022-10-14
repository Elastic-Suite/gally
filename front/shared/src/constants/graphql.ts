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

// TODO: check if pined product shold be filtered with categoryId or virtual product rules
export const getProductPined = `query pined($localizedCatalogId : String!, $listproductsIdPined : [Int]!, $categoryId: String!) {
  searchProducts(
    catalogId: $localizedCatalogId
  filter:[
    {id:{in: $listproductsIdPined }}
    {category__id:{eq:$categoryId}}
  ]){
    collection {
      ... on Product {
        id
        sku
        name
        score
        stock {
          status
        }
        price
      }
    }
    paginationInfo {
      lastPage
      itemsPerPage
      totalCount
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

export const savePositions = `mutation savePositionsCategoryProductMerchandising( $categoryId: String!, $savePositionsCategory : String! ){
    savePositionsCategoryProductMerchandising (
      input: {
        categoryId: $categoryId
        positions: $savePositionsCategory
      }
    )
    {categoryProductMerchandising {result}}
}
`
