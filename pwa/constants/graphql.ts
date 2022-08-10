export const categoriesProductsFragment = `...on Product {
  id
  sku
  name
  score
  stock {
    status
  }
  price
}
`
export const productsQuery = `query getProducts($catalogId: String!, $currentPage: Int, $pageSize: Int) {
  searchProducts(catalogId: $catalogId, currentPage: $currentPage, pageSize: $pageSize ) {
    collection {
      ${categoriesProductsFragment}
    }
    paginationInfo {
      lastPage
      itemsPerPage
      totalCount
    }
  }
}
`
