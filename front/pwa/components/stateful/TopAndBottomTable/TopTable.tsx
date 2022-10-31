import { Dispatch, SetStateAction, useMemo } from 'react'

import { useGraphqlApi } from '~/hooks'
import {
  IGraphqlSearchProducts,
  IProductFieldFilterInput,
  ITableHeader,
  ITableRow,
  LoadStatus,
  getSearchProductsQuery,
  productTableheader,
} from 'shared'

import FieldGuesser from '../FieldGuesser/FieldGuesser'
import TopProductsTable from '../TopProductsTable/TopProductsTable'

interface IProps {
  catalogId: string
  onSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  productGraphqlFilters: IProductFieldFilterInput
  selectedRows: (string | number)[]
}

function TopTable(props: IProps): JSX.Element {
  const { catalogId, onSelectedRows, productGraphqlFilters, selectedRows } =
    props

  const variables = useMemo(() => ({ catalogId }), [catalogId])
  const [products] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery(productGraphqlFilters),
    variables
  )
  const tableRows: ITableRow[] = products?.data?.searchProducts
    ?.collection as unknown as ITableRow[]

  const tableHeaders: ITableHeader[] = productTableheader

  return (
    <>
      {products.status === LoadStatus.SUCCEEDED &&
        Boolean(products?.data?.searchProducts) && (
          <TopProductsTable
            Field={FieldGuesser}
            selectedRows={selectedRows}
            onSelectedRows={onSelectedRows}
            tableHeaders={tableHeaders}
            tableRows={tableRows}
            draggable
          />
        )}
    </>
  )
}

export default TopTable
