import { useContext, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ICategory, ProductRequestType } from 'shared'

import { categoryContext } from '../../contexts'
import { useProducts } from '../../hooks'

import Facets from '../../components/Facets/Facets'
import PageLayout from '../../components/PageLayout/PageLayout'
import Products from '../../components/Products/Products'
import TwoColsLayout from '../../components/TwoColsLayout/TwoColsLayout'

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
  const filters = useMemo(() => ({ category__id: { eq: id } }), [id])
  const {
    activeFilters,
    loadProduts,
    page,
    pageSize,
    products,
    setActiveFilters,
    setPage,
    setPageSize,
    setSort,
    setSortOrder,
    sort,
    sortOptions,
    sortOrder,
  } = useProducts(ProductRequestType.CATALOG, filters)
  const categories = useContext(categoryContext)
  const category = findCategory(categories, id)

  useEffect(() => {
    loadProduts(Boolean(category))
  }, [category, loadProduts])

  return (
    <PageLayout title={category?.name}>
      <TwoColsLayout
        left={
          <Facets
            activeFilters={activeFilters}
            filters={products.data?.products.aggregations}
            onFilterChange={setActiveFilters}
          />
        }
      >
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
      </TwoColsLayout>
    </PageLayout>
  )
}

export default Category
