import { Dispatch, SetStateAction, useId, useMemo } from 'react'
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TablePagination,
  styled,
} from '@mui/material'
import {
  IFetch,
  IGraphqlSearchProducts,
  IOptions,
  // LoadStatus,
  SortOrder,
} from 'gally-admin-shared'
import { Box } from '@mui/system'

import { IProduct } from '../../types/'

import ProductCard from './ProductCard'

const Container = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const SelectFormControl = styled(FormControl)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  minWidth: '200px',
}))

const CustomResultPagination = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontFamily: 'Inter',
  color: theme.palette.common.black,
}))

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

  const rows: IProduct[] = useMemo(
    () =>
      products.data?.products.collection.map((product) => {
        return {
          ...product,
          price: product.price?.[0]?.price,
        }
      }) ?? [],
    [products]
  )

  function handleSortChange(event: SelectChangeEvent): void {
    setSort(event.target.value)
  }

  function handleSortOrderChange(event: SelectChangeEvent): void {
    setSortOrder(event.target.value as SortOrder)
  }

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ): void => {
    event.preventDefault()
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    event.preventDefault()
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <>
      <Container>
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
              {Object.values(SortOrder).map((value) => {
                return (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                )
              })}
            </Select>
          </SelectFormControl>
        </div>
      </Container>
      <CustomResultPagination>
        <div>{total !== undefined && `${total} Result(s)`}</div>

        <TablePagination
          labelRowsPerPage="Rows per page"
          component="div"
          count={products.data?.products.paginationInfo.totalCount || 0}
          rowsPerPageOptions={[10, 30, 50]}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CustomResultPagination>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ md: 3 }} columns={{ md: 12 }}>
          {rows.map((item) => {
            return (
              <Grid item md={4} key={item.id}>
                <ProductCard product={item} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </>
  )
}

export default Products
