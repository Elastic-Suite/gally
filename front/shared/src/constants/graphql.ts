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
        localizedCatalog: 'String!',
        currentPage: 'Int',
        pageSize: 'Int',
        search: 'String',
        sort: 'ProductSortInput',
      },
      products: {
        __args: {
          requestType: new VariableType('requestType'),
          localizedCatalog: new VariableType('localizedCatalog'),
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
            hasMore: true,
          },
        }),
      },
    },
  })
}

export function getMoreFacetOptionsQuery(
  filter: IProductFieldFilterInput | IProductFieldFilterInput[] = null
): string {
  return jsonToGraphQLQuery({
    query: {
      __name: 'viewMoreProductFacetOptions',
      __variables: {
        catalogId: 'String!',
        aggregation: 'String!',
        currentCategoryId: 'String',
        search: 'String',
      },
      viewMoreProductFacetOptions: {
        __args: {
          catalogId: new VariableType('catalogId'),
          aggregation: new VariableType('aggregation'),
          currentCategoryId: new VariableType('currentCategoryId'),
          search: new VariableType('search'),
          filter,
        },
        id: true,
        value: true,
        label: true,
        count: true,
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
