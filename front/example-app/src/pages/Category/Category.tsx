import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ICategory, ProductRequestType } from 'shared'

import { categoryContext } from '../../contexts'
import { useProducts } from '../../hooks'

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
  const {
    loadProduts,
    page,
    pageSize,
    products,
    setPage,
    setPageSize,
    setSort,
    setSortOrder,
    sort,
    sortOptions,
    sortOrder,
  } = useProducts(ProductRequestType.CATALOG, { category__id: { eq: id } })
  const categories = useContext(categoryContext)
  const category = findCategory(categories, id)

  useEffect(() => {
    loadProduts(Boolean(category))
  }, [category, loadProduts])

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
