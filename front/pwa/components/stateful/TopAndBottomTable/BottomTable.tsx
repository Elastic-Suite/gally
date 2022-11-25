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
  ProductRequestType,
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
  sortValue: string
  searchValue: string
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
    sortValue,
    searchValue,
  } = props

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)

  const variables = useMemo(
    () => ({
      catalogId: localizedCatalogId,
      currentPage,
      pageSize: rowsPerPage,
      requestType: ProductRequestType.CATALOG,
      sort:
        sortValue && sortValue !== 'category__position'
          ? { [sortValue]: 'asc' }
          : {},
    }),
    [currentPage, localizedCatalogId, rowsPerPage, sortValue]
  )
  const filters = [productGraphqlFilters]
  if (topProductsIds.length > 0 && sortValue === 'category__position') {
    filters.push({
      boolFilter: { _not: [{ id: { in: topProductsIds } }] },
    })
  }

  if (searchValue) {
    filters.push({
      boolFilter: {
        _should: [
          {
            name: { match: searchValue },
          },
          { sku: { eq: searchValue } },
        ],
      },
    })
  }

  const [products] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery(filters),
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
    setNbBottomRows(products?.data?.products.paginationInfo.totalCount || 0)
  }, [products?.data?.products.paginationInfo.totalCount])

  return (
    <>
      {Boolean(products?.data?.products) && (
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
            products.data.products.collection as unknown as ITableRow[]
          }
          selectedRows={selectedRows}
          onSelectedRows={onSelectedRows}
          count={products.data.products.paginationInfo.totalCount}
        />
      )}
    </>
  )
}

export default forwardRef(BottomTable)
