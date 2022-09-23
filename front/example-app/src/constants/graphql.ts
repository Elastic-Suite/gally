export const getCalogsQuery = `query getCalogs {
  catalogs {
    edges {
      node {
        id
        code
        name
        localizedCatalogs {
          edges {
            node {
              id
              code
              name
              locale
            }
          }
        }
      }
    }
  }
}`

export const getCategoriesQuery = `query getCategories($localizedCatalogId: Int) {
  getCategoryTree (localizedCatalogId: $localizedCatalogId) {
    categories
  }
}`

export const getProductsQuery = `query getProducts($localizedCatalogId: String) {
  searchProducts (
    catalogId: $localizedCatalogId
    filter: {
      category__id: { in: ["one"] }
    }
  ) {
    collection {
      sku
      name
      price
    }
  }
}`
