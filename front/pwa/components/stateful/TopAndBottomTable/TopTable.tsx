import { Dispatch, SetStateAction, useMemo } from 'react'

import { useGraphqlApi } from '~/hooks'
import {
  IGraphqlSearchProducts,
  ITableHeader,
  ITableRow,
  LoadStatus,
  productTableheader,
  searchProductsQuery,
} from 'shared'

import FieldGuesser from '../FieldGuesser/FieldGuesser'
import TopProductsTable from '../TopProductsTable/TopProductsTable'

interface IProps {
  selectedRows: (string | number)[]
  onSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  catalogId: string
}

function TopTable(props: IProps): JSX.Element {
  const { selectedRows, onSelectedRows, catalogId } = props

  const variables = useMemo(() => ({ catalogId }), [catalogId])
  const [products] = useGraphqlApi<IGraphqlSearchProducts>(
    searchProductsQuery,
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
