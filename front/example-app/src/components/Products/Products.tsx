import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { IFetch, IGraphqlSearchProducts, LoadStatus } from 'shared'

const columns: GridColDef[] = [
  { field: 'id', flex: 1, headerName: 'ID', sortable: false },
  { field: 'name', flex: 2, headerName: 'Name', sortable: false },
  { field: 'price', flex: 1, headerName: 'Price', sortable: false },
  { field: 'sku', flex: 1, headerName: 'Sku', sortable: false },
]

interface IProps {
  page: number
  pageSize: number
  products: IFetch<IGraphqlSearchProducts>
  setPage: Dispatch<SetStateAction<number>>
  setPageSize: Dispatch<SetStateAction<number>>
}

function Products(props: IProps): JSX.Element {
  const { page, pageSize, products, setPage, setPageSize } = props

  const rows = useMemo(
    () =>
      products.data?.searchProducts.collection.map((product) => {
        try {
          if (product.price) {
            return {
              ...product,
              price: product.price[0].price,
            }
          }
        } catch {
          // no price
        }
        return product
      }) ?? [],
    [products]
  )

  return (
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
      rowCount={products.data?.searchProducts.paginationInfo.totalCount || 0}
      rowsPerPageOptions={[10, 20, 30]}
      rows={rows}
    />
  )
}

export default Products
