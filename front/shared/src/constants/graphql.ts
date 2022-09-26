export const searchProductsQuery = `query getProducts($catalogId: String!, $currentPage: Int, $pageSize: Int) {
  searchProducts(catalogId: $catalogId, currentPage: $currentPage, pageSize: $pageSize ) {
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
