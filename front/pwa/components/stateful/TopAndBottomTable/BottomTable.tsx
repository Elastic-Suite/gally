import {
  MutableRefObject,
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
import NoAttributes from '~/components/atoms/noAttributes/NoAttributes'

import { useTranslation } from 'next-i18next'

interface IProps {
  localizedCatalogId: string
  onSelectedRows: (rowIds: string[]) => void
  productGraphqlFilters: IProductFieldFilterInput
  selectedRows: (string | number)[]
  topProductsIds: number[]
  setNbBottomRows: (value: number) => void
  sortValue: string
  searchValue: string
  configuration: string[]
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
    configuration,
  } = props

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)
  const { t } = useTranslation('categories')
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

  const tableRows = products?.data?.products.collection ?? []
  const withSelection = selectedRows?.length !== undefined
  const massiveSelectionState =
    withSelection && selectedRows
      ? selectedRows.length === tableRows.length
      : false
  const massiveSelectionIndeterminate =
    withSelection && selectedRows.length > 0
      ? selectedRows.length < tableRows.length
      : false

  const onRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  useEffect(() => {
    setNbBottomRows(products?.data?.products.paginationInfo.totalCount || 0)
  }, [products?.data?.products.paginationInfo.totalCount, setNbBottomRows])

  function handleSelection(rowIds: (string | number)[] | boolean): void {
    if (rowIds instanceof Array) {
      onSelectedRows(rowIds as string[])
    } else if (rowIds) {
      onSelectedRows(tableRows.map((row) => row.id))
    } else {
      onSelectedRows([])
    }
  }

  return (
    <>
      {Boolean(products?.data?.products) &&
        (products.data.products.collection.length === 0 ? (
          <NoAttributes title={t('noProductSearch')} />
        ) : (
          <PagerTable
            Field={FieldGuesser}
            count={products.data.products.paginationInfo.totalCount}
            currentPage={
              (currentPage - 1 >= 0 ? currentPage - 1 : currentPage) ?? 0
            }
            massiveSelectionIndeterminate={massiveSelectionIndeterminate}
            massiveSelectionState={massiveSelectionState}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            onSelection={handleSelection}
            ref={ref}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={defaultRowsPerPageOptions ?? []}
            selectedRows={selectedRows}
            tableHeaders={productTableheader}
            tableRows={
              products.data.products.collection as unknown as ITableRow[]
            }
            withSelection={withSelection}
            configuration={configuration}
          />
        ))}
    </>
  )
}

export default forwardRef(BottomTable)
