import { useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { styled } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import {
  ICategory,
  IGraphqlSearchProducts,
  LoadStatus,
  getSearchProductsQuery,
} from 'shared'

import { catalogContext, categoryContext } from '../../contexts'
import { useGraphqlApi } from '../../hooks'

import Title from '../../components/Title/Title'

const Root = styled('div')({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
})

const Content = styled('div')(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(2),
}))

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

const columns: GridColDef[] = [
  { field: 'id', flex: 1, headerName: 'ID', sortable: false },
  { field: 'name', flex: 2, headerName: 'Name', sortable: false },
  { field: 'price', flex: 1, headerName: 'Price', sortable: false },
  { field: 'sku', flex: 1, headerName: 'Sku', sortable: false },
]

function Category(): JSX.Element {
  const { id } = useParams()
  const { localizedCatalogId } = useContext(catalogContext)
  const categories = useContext(categoryContext)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // todo: add filter for categories : `filter: {category__id: { in: ["one"] }}`
  const variables = useMemo(
    () => ({
      catalogId: String(localizedCatalogId),
      currentPage: page + 1,
      pageSize,
    }),
    [localizedCatalogId, page, pageSize]
  )
  const [products, setProducts, load] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery(),
    variables
  )
  const category = findCategory(categories, id)

  useEffect(() => {
    if (localizedCatalogId && category) {
      load()
    } else {
      setProducts(null)
    }
  }, [category, load, localizedCatalogId, setProducts])

  const rows = useMemo(
    () =>
      products.data?.searchProducts.collection.map((product) => {
        let price
        try {
          if (product.price) {
            const parsedPrice = JSON.parse(product.price)
            // eslint-disable-next-line prefer-destructuring
            price = parsedPrice[0].price
          }
        } catch {
          // no price
        }
        return {
          ...product,
          price,
        }
      }) ?? [],
    [products]
  )

  return (
    <Root>
      <Title title={`Category (${id})`} />
      <Content>
        <DataGrid
          autoHeight
          columns={columns}
          disableColumnFilter
          disableColumnSelector
          disableColumnMenu
          disableDensitySelector
          disableSelectionOnClick
          loading={products.status === LoadStatus.LOADING}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          page={page}
          pageSize={pageSize}
          paginationMode="server"
          rowCount={
            products.data?.searchProducts.paginationInfo.totalCount || 0
          }
          rowsPerPageOptions={[10, 20, 30]}
          rows={rows}
        />
      </Content>
    </Root>
  )
}

export default Category
