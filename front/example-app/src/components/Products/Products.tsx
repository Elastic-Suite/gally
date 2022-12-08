import { Dispatch, SetStateAction, useId, useMemo } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
} from '@mui/material'
import {
  IFetch,
  IGraphqlSearchProducts,
  IOptions,
  LoadStatus,
  SortOrder,
} from 'shared'

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const SelectFormControl = styled(FormControl)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  minWidth: '200px',
}))

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
  setSort: Dispatch<SetStateAction<string>>
  setSortOrder: Dispatch<SetStateAction<SortOrder>>
  sort: string
  sortOptions: IOptions<string>
  sortOrder: SortOrder
}

function Products(props: IProps): JSX.Element {
  const {
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
  } = props
  const total = products.data?.products.paginationInfo.totalCount
  const sortLabelId = useId()
  const sortSelectId = useId()
  const sortOrderLabelId = useId()
  const sortOrderSelectId = useId()

  const rows = useMemo(
    () =>
      products.data?.products.collection.map((product) => {
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

  function handleSortChange(event: SelectChangeEvent): void {
    setSort(event.target.value)
  }

  function handleSortOrderChange(event: SelectChangeEvent): void {
    setSortOrder(event.target.value as SortOrder)
  }

  return (
    <>
      <Container>
        <div>{total !== undefined && `${total} Result(s)`}</div>
        <div>
          <SelectFormControl margin="normal" variant="outlined">
            <InputLabel id={sortLabelId}>Sort by</InputLabel>
            <Select
              id={sortSelectId}
              label="Sort by"
              labelId={sortLabelId}
              onChange={handleSortChange}
              value={sort}
            >
              {sortOptions.map((sortOption) => (
                <MenuItem key={sortOption.value} value={sortOption.value}>
                  {sortOption.label}
                </MenuItem>
              ))}
            </Select>
          </SelectFormControl>
          <SelectFormControl margin="normal" variant="outlined">
            <InputLabel id={sortOrderLabelId}>Sort order</InputLabel>
            <Select
              id={sortOrderSelectId}
              label="Sort order"
              labelId={sortOrderLabelId}
              onChange={handleSortOrderChange}
              value={sortOrder}
            >
              {Object.values(SortOrder).map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </SelectFormControl>
        </div>
      </Container>
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
        rowCount={products.data?.products.paginationInfo.totalCount || 0}
        rowsPerPageOptions={[10, 20, 30]}
        rows={rows}
      />
    </>
  )
}

export default Products
