import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useGraphqlApi } from '~/hooks'
import {
  IGraphqlSearchProducts,
  IProductFieldFilterInput,
  ITableRow,
  defaultPageSize,
  defaultRowsPerPageOptions,
  getSearchProductsQuery,
  productTableheader,
} from 'shared'

import PagerTable from '../../organisms/PagerTable/PagerTable'

import FieldGuesser from '../FieldGuesser/FieldGuesser'

interface IProps {
  localizedCatalogId: string
  onSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  productGraphqlFilters: IProductFieldFilterInput
  selectedRows: (string | number)[]
  topProductsIds: number[]
  setNbBottomRows: (value: number) => void
}

function BottomTable(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    localizedCatalogId,
    onSelectedRows,
    productGraphqlFilters,
    selectedRows,
    topProductsIds,
    setNbBottomRows,
  } = props

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)

  const variables = useMemo(
    () => ({
      catalogId: localizedCatalogId,
      currentPage,
      pageSize: rowsPerPage,
    }),
    [currentPage, localizedCatalogId, rowsPerPage]
  )
  const [products] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery({
      boolFilter: {
        _must: [
          productGraphqlFilters,
          { boolFilter: { _not: [{ id: { in: topProductsIds } }] } },
        ],
      },
    }),
    variables
  )

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

  useEffect(() => {
    setNbBottomRows(
      products?.data?.searchProducts.paginationInfo.totalCount || 0
    )
  }, [products?.data?.searchProducts.paginationInfo.totalCount])

  return (
    <>
      {Boolean(products?.data?.searchProducts) && (
        <PagerTable
          Field={FieldGuesser}
          currentPage={
            (currentPage - 1 >= 0 ? currentPage - 1 : currentPage) ?? 0
          }
          onPageChange={onPageChange}
          ref={ref}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={defaultRowsPerPageOptions ?? []}
          onRowsPerPageChange={onRowsPerPageChange}
          tableHeaders={productTableheader}
          tableRows={
            products.data.searchProducts.collection as unknown as ITableRow[]
          }
          selectedRows={selectedRows}
          onSelectedRows={onSelectedRows}
          count={products.data.searchProducts.paginationInfo.totalCount}
        />
      )}
    </>
  )
}

export default forwardRef(BottomTable)
