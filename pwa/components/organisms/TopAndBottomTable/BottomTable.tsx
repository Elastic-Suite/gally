import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import {
  defaultPageSize,
  gqlUrl,
  productTableFields,
  productTableheader,
} from '~/constants'
import { useApiFetch } from '~/hooks'
import { removeEmptyParameters } from '~/services'
import { ISearchParameters, ITableHeader, ITableRow, LoadStatus } from '~/types'
import { IFetchParams, IFetchProducts } from '~/types/products'
import PagerTable from '../PagerTable/PagerTable'

interface IProps {
  selectedRows: (string | number)[]
  setSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
}

function BottomTable(props: IProps): JSX.Element {
  const { selectedRows, setSelectedRows } = props
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)
  const rowsPerPageOptions = [2, 25, 50]

  // todo : when api product will be finalize, factorize code and exports this into a products service with top and bottom distinguish.
  const gqlQuery = `
  query {
    searchProducts(catalogId: "com_fr", currentPage:${currentPage}, pageSize:${rowsPerPage}) {
      collection {
        ${productTableFields}
      }
      paginationInfo {
        lastPage
        totalCount
      }
    }
  }
  `

  const params: IFetchParams = useMemo(() => {
    return {
      options: {
        body: JSON.stringify({ query: gqlQuery }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      searchParameters: removeEmptyParameters({} as ISearchParameters),
    }
  }, [gqlQuery])

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
    setSelectedRows([])
  }

  const onRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(parseInt(event.target.value, 10))
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
            setSelectedRows={setSelectedRows}
            totalPages={
              products.data.data.searchProducts.paginationInfo.lastPage
            }
            paginated
          />
        )}
    </>
  )
}

export default BottomTable
