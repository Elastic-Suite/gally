import { Dispatch, SetStateAction, useId, useMemo } from 'react'
import {
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TablePagination,
} from '@mui/material'
import {
  IFetch,
  IGraphqlSearchProducts,
  IOptions,
  // LoadStatus,
  SortOrder,
} from '@elastic-suite/gally-admin-shared'
import { Box } from '@mui/system'

import { IProduct } from '../../types/'

import {
  Container,
  CustomResultPagination,
  SelectFormControl,
} from '../Search/Search.styled'

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
  hasSortOptions?: boolean
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
    hasSortOptions = true
  } = props
  const total = products.data?.products?.paginationInfo?.totalCount ?? 0
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

  function getSummary(product: IProduct): string | null
  {
    return product.description !== null && product.description !== ''
      ? product.description
      : (product.content !== null && product.content !== '' ? product.content : 'Pas de résumé disponible')
  }

  function renderSummary(input: string): string
  {
    const maxLength = 400
    const domElement = document.createElement('textarea')
    domElement.innerHTML = input

    const formattedInput = domElement.firstChild.nodeValue.replace(/(<([^>]+)>)/gi, '')

    return formattedInput.length > maxLength
      ? formattedInput.slice(0, maxLength).concat('...')
      : formattedInput.slice(0, maxLength)
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
      {hasSortOptions === true && (
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
      )}
      <CustomResultPagination>
        <div>{total !== undefined && `${total} Result(s)`}</div>

        <TablePagination
          labelRowsPerPage="Rows per page"
          component="div"
          count={products.data?.products?.paginationInfo?.totalCount || 0}
          rowsPerPageOptions={[10, 30, 50]}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CustomResultPagination>
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', fontSize: 15 }}>
        {rows.map((item) => {
          const summary = getSummary(item)
          const documentName = item.uri !== null
            ? <a style={{color: 'rgb(26, 13, 171)'}} href={item.uri} target="_blank" rel="noreferrer">{item.name}</a>
            : item.name;

          return (
            <Box
              key={item.id}
              sx={{
                padding: 1,
                display: 'flex',
                gap: 1,
                flexDirection: 'column',
                position: 'relative',
                borderRadius: 1,
                border: '1px solid lightgrey',
                color: '#383e42',
              }}
            >
              <Box
                sx={{
                  color: 'black',
                  fontSize: 18,
                }}
              >
                {documentName}
              </Box>
              {item.document_type !== null && item.document_type !== 'File' && <Box>
                Document Type: {item.document_type}
              </Box>}
              {item.file_type !== null && <Box>
                File Type: {item.file_type.toUpperCase().concat(' File')}
              </Box>}
              {item.author !== null && <Box>
                Authors: {item.author[0] === '[' ? JSON.parse(item.author).join(', ') : item.author}
              </Box>}
              {item.year !== null && <Box>
                Publication Year: {item.year}
              </Box>}
              {item.workspace !== null && <Box>
                Workspace: {item.workspace}
              </Box>}
              {summary !== null && <Box sx={{fontSize: 12, color: 'grey'}}>
                {renderSummary(summary)}
              </Box>}
            </Box>
          )
        })}
      </Box>
    </>
  )
}

export default Products
