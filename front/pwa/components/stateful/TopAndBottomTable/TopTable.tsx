import { Dispatch, SetStateAction, useMemo } from 'react'

import { useGraphqlApi } from '~/hooks'
import {
  IConfigurations,
  IGraphqlProductPosition,
  IGraphqlSearchProducts,
  IProductFieldFilterInput,
  IProductPositions,
  ITableRow,
  LoadStatus,
  ProductRequestType,
  getSearchProductsQuery,
  productTableheader,
} from 'shared'

import FieldGuesser from '../FieldGuesser/FieldGuesser'
import TopProductsTable from '../TopProductsTable/TopProductsTable'

interface IProps {
  localizedCatalogId: string
  onSelectedRows: (rowIds: string[]) => void
  productGraphqlFilters: IProductFieldFilterInput
  selectedRows: (string | number)[]
  setProductPositions: Dispatch<SetStateAction<IGraphqlProductPosition>>
  topProducts: IProductPositions
  topProductsIds: number[]
  sortValue: string
  configuration: IConfigurations
}

function TopTable(props: IProps): JSX.Element {
  const {
    selectedRows,
    onSelectedRows,
    productGraphqlFilters,
    localizedCatalogId,
    setProductPositions,
    topProducts,
    topProductsIds,
    sortValue,
    configuration,
  } = props

  const variables = useMemo(
    () => ({
      localizedCatalog: localizedCatalogId,
      requestType: ProductRequestType.CATALOG,
    }),
    [localizedCatalogId]
  )
  const filters = [productGraphqlFilters]
  if (topProductsIds.length > 0) {
    filters.push({ id: { in: topProductsIds } })
  }
  const [products] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery(filters),
    variables
  )

  function handleReorder(rows: ITableRow[]): void {
    let position = 0
    const positions = rows.map((row) => ({
      productId: Number(String(row.id).split('/')[2]),
      position: ++position,
    }))
    setProductPositions({
      getPositionsCategoryProductMerchandising: {
        result: JSON.stringify(positions),
      },
    })
  }

  const topProductsMap = Object.fromEntries(
    topProducts.map(({ position, productId }) => [productId, position])
  )
  const tableRows =
    (products.data?.products?.collection.sort(
      (a, b) =>
        topProductsMap[a.id.split('/')[2]] - topProductsMap[b.id.split('/')[2]]
    ) as unknown as ITableRow[]) ?? []
  const withSelection = selectedRows?.length !== undefined
  const massiveSelectionState =
    withSelection && selectedRows
      ? selectedRows.length === tableRows.length
      : false
  const massiveSelectionIndeterminate =
    withSelection && selectedRows.length > 0
      ? selectedRows.length < tableRows.length
      : false

  function handleSelection(rowIds: (string | number)[] | boolean): void {
    if (rowIds instanceof Array) {
      onSelectedRows(rowIds as string[])
    } else if (rowIds) {
      onSelectedRows(products.data.products.collection.map((row) => row.id))
    } else {
      onSelectedRows([])
    }
  }

  return (
    <>
      {products.status === LoadStatus.SUCCEEDED &&
        sortValue === 'category__position' && (
          <div>
            <TopProductsTable
              border
              draggable
              Field={FieldGuesser}
              massiveSelectionIndeterminate={massiveSelectionIndeterminate}
              massiveSelectionState={massiveSelectionState}
              onReOrder={handleReorder}
              onSelection={handleSelection}
              selectedRows={selectedRows}
              tableHeaders={productTableheader}
              tableRows={tableRows}
              withSelection={withSelection}
              configuration={configuration}
            />
          </div>
        )}
    </>
  )
}

export default TopTable
