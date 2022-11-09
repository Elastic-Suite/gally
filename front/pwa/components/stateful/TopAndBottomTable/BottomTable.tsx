import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  forwardRef,
  useMemo,
  useState,
} from 'react'

import { useGraphqlApi } from '~/hooks'
import {
  IGraphqlSearchProducts,
  IProductFieldFilterInput,
  ITableHeader,
  ITableRow,
  LoadStatus,
  defaultPageSize,
  defaultRowsPerPageOptions,
  getSearchProductsQuery,
  productTableheader,
} from 'shared'

import PagerTable from '../../organisms/PagerTable/PagerTable'

import FieldGuesser from '../FieldGuesser/FieldGuesser'

interface IProps {
  catalogId: string
  onSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  productGraphqlFilters: IProductFieldFilterInput
  selectedRows: (string | number)[]
}

function BottomTable(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const { catalogId, onSelectedRows, productGraphqlFilters, selectedRows } =
    props
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)
  const rowsPerPageOptions = defaultRowsPerPageOptions

  // todo : when api product will be finalize, factorize code and exports this into a products service with top and bottom distinguish.
  const variables = useMemo(
    () => ({ catalogId, currentPage, pageSize: rowsPerPage }),
    [catalogId, currentPage, rowsPerPage]
  )
  const [products] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery(productGraphqlFilters),
    variables
  )
  const tableRows: ITableRow[] = products?.data?.searchProducts
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
        Boolean(products?.data?.searchProducts) && (
          <PagerTable
            Field={FieldGuesser}
            currentPage={
              (currentPage - 1 >= 0 ? currentPage - 1 : currentPage) ?? 0
            }
            onPageChange={onPageChange}
            ref={ref}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions ?? []}
            onRowsPerPageChange={onRowsPerPageChange}
            tableHeaders={tableHeaders}
            tableRows={tableRows}
            selectedRows={selectedRows}
            onSelectedRows={onSelectedRows}
            count={products.data.searchProducts.paginationInfo.totalCount}
          />
        )}
    </>
  )
}

export default forwardRef(BottomTable)
