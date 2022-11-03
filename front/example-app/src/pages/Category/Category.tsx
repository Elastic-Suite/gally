import { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ICategory,
  IGraphqlSearchProducts,
  ProductRequestType,
  getSearchProductsQuery,
} from 'shared'

import { catalogContext, categoryContext } from '../../contexts'
import { useGraphqlApi, useProductSort } from '../../hooks'

import PageLayout from '../../components/PageLayout/PageLayout'
import Products from '../../components/Products/Products'

function findCategory(categories: ICategory[], id: string): ICategory {
  let category: ICategory
  let i = 0
  while (!category && i < categories.length) {
    if (categories[i].id === id) {
      category = categories[i]
    } else if (categories[i].children) {
      category = findCategory(categories[i].children, id)
    }
    i++
  }
  return category
}

function Category(): JSX.Element {
  const { id } = useParams()
  const { localizedCatalogId } = useContext(catalogContext)
  const categories = useContext(categoryContext)
  const category = findCategory(categories, id)

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sort, sortOrder, sortOptions, setSort, setSortOrder] = useProductSort()

  const variables = useMemo(
    () => ({
      catalogId: String(localizedCatalogId),
      currentPage: page + 1,
      pageSize,
      requestType: ProductRequestType.CATALOG,
    }),
    [localizedCatalogId, page, pageSize]
  )
  const [products, setProducts, load] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery({ category__id: { eq: id } }),
    variables
  )

  useEffect(() => {
    if (localizedCatalogId && category) {
      load()
    } else {
      setProducts(null)
    }
  }, [category, load, localizedCatalogId, setProducts])

  return (
    <PageLayout title={category.name}>
      <Products
        page={page}
        pageSize={pageSize}
        products={products}
        setPage={setPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setSortOrder={setSortOrder}
        sort={sort}
        sortOptions={sortOptions}
        sortOrder={sortOrder}
      />
    </PageLayout>
  )
}

export default Category
