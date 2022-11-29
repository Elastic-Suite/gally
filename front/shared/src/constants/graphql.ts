import { VariableType, jsonToGraphQLQuery } from 'json-to-graphql-query'

import { IProductFieldFilterInput } from '../types'

export function getSearchProductsQuery(
  filter: IProductFieldFilterInput | IProductFieldFilterInput[] = null,
  withAggregations = false
): string {
  return jsonToGraphQLQuery({
    query: {
      __name: 'getProducts',
      __variables: {
        requestType: 'ProductRequestTypeEnum!',
        catalogId: 'String!',
        currentPage: 'Int',
        pageSize: 'Int',
        search: 'String',
        sort: 'ProductSortInput',
      },
      products: {
        __args: {
          requestType: new VariableType('requestType'),
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
            image: true,

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
        sortInfo: {
          current: {
            field: true,
            direction: true,
          },
        },
        ...(withAggregations && {
          aggregations: {
            field: true,
            label: true,
            type: true,
            options: {
              count: true,
              label: true,
              value: true,
            },
            has_more: true,
          },
        }),
      },
    },
  })
}

export const getProductPosition = `query getPosition( $categoryId: String!,  $localizedCatalogId : Int! ) {
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
