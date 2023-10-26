export const catalogsQuery = `query catalogs {
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

export const getCategoryTreeQuery = `query categories($localizedCatalogId: Int) {
  getCategoryTree (localizedCatalogId: $localizedCatalogId) {
    categories
  }
}`

export const getSortingOptionsQuery = `query getSortingOptionsQuery ($entityType: String) {
  sortingOptions (entityType: $entityType) {
    label
    code
  }
}`

export const getProductSortingOptionsQuery = `query getProductSortingOptionsQuery {
  productSortingOptions {
    label
    code
  }
}`

export const getCategoryConfigurationQuery = `query getCategoryConfiguration($categoryId: String!, $catalogId: Int $localizedCatalogId: Int) {
  getCategoryConfiguration(categoryId: $categoryId, catalogId: $catalogId, localizedCatalogId: $localizedCatalogId) {
    defaultSorting
  }
}`
