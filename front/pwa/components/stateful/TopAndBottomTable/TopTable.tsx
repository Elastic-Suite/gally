import { Dispatch, SetStateAction, useMemo } from 'react'

import { useGraphqlApi } from '~/hooks'
import {
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
  onSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  productGraphqlFilters: IProductFieldFilterInput
  selectedRows: (string | number)[]
  setProductPositions: Dispatch<SetStateAction<IGraphqlProductPosition>>
  topProducts: IProductPositions
  topProductsIds: number[]
  sortValue: string
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
  } = props

  const variables = useMemo(
    () => ({
      catalogId: localizedCatalogId,
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
  const tableRows = products.data?.products?.collection.sort(
    (a, b) =>
      topProductsMap[a.id.split('/')[2]] - topProductsMap[b.id.split('/')[2]]
  ) as unknown as ITableRow[]

  return (
    <>
      {products.status === LoadStatus.SUCCEEDED &&
        Boolean(products?.data?.searchProducts) &&
        sortValue === 'position' && (
          <div>
            <TopProductsTable
              Field={FieldGuesser}
              selectedRows={selectedRows}
              onSelectedRows={onSelectedRows}
              onReOrder={handleReorder}
              tableHeaders={productTableheader}
              tableRows={tableRows}
              draggable
              border
            />
          </div>
        )}
    </>
  )
}

export default TopTable
