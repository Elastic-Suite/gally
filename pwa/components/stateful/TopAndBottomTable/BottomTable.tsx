import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import {
  defaultPageSize,
  defaultRowsPerPageOptions,
  gqlUrl,
  productTableheader,
} from '~/constants'
import { productsQuery } from '~/constants/graphql'
import { useApiFetch } from '~/hooks'
import { ISearchParameters, ITableHeader, ITableRow, LoadStatus } from '~/types'
import { IFetchParams, IFetchProducts } from '~/types/products'
import PagerTable from '../../organisms/PagerTable/PagerTable'

interface IProps {
  selectedRows: (string | number)[]
  onSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  catalogId: string
}

function BottomTable(props: IProps): JSX.Element {
  const { selectedRows, onSelectedRows, catalogId } = props
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)
  const rowsPerPageOptions = defaultRowsPerPageOptions

  // todo : when api product will be finalize, factorize code and exports this into a products service with top and bottom distinguish.
  const query = productsQuery

  const params: IFetchParams = useMemo(() => {
    const variables = { catalogId, currentPage, pageSize: rowsPerPage }
    return {
      options: {
        body: JSON.stringify({ query, variables }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      searchParameters: {} as ISearchParameters,
    }
  }, [query, catalogId, currentPage, rowsPerPage])

  const [products] = useApiFetch<IFetchProducts>(
    gqlUrl,
    params.searchParameters,
    params.options
  )
  const tableRows: ITableRow[] = products?.data?.data?.searchProducts
    ?.collection as unknown as ITableRow[]
  const tableHeaders: ITableHeader[] = productTableheader

  function onPageChange(page: number): void {
    setCurrentPage(page + 1)
    onSelectedRows([])
  }

  const onRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  return (
    <>
      {products.status === LoadStatus.SUCCEEDED &&
        Boolean(products?.data?.data?.searchProducts) && (
          <PagerTable
            currentPage={
              (currentPage - 1 >= 0 ? currentPage - 1 : currentPage) ?? 0
            }
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions ?? []}
            onRowsPerPageChange={onRowsPerPageChange}
            tableHeaders={tableHeaders}
            tableRows={tableRows}
            selectedRows={selectedRows}
            onSelectedRows={onSelectedRows}
            count={products.data.data.searchProducts.paginationInfo.totalCount}
            paginated
          />
        )}
    </>
  )
}

export default BottomTable
