import { Dispatch, SetStateAction, useMemo } from 'react'

import { gqlUrl, productTableheader } from '~/constants'
import { productsQuery } from '~/constants/graphql'
import { useFetchApi } from '~/hooks'
import { ISearchParameters, ITableHeader, ITableRow, LoadStatus } from '~/types'
import { IFetchParams, IFetchProducts } from '~/types/products'

import TopProductsTable from '../TopProductsTable/TopProductsTable'

interface IProps {
  selectedRows: (string | number)[]
  onSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  catalogId: string
}

function TopTable(props: IProps): JSX.Element {
  const { selectedRows, onSelectedRows, catalogId } = props

  // todo : when api product will be finalize, factorize code and exports this into a products service with top and bottom distinguish.
  const query = productsQuery

  const params: IFetchParams = useMemo(() => {
    const variables = { catalogId }
    return {
      options: {
        body: JSON.stringify({ query, variables }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      searchParameters: {} as ISearchParameters,
    }
  }, [query, catalogId])

  const [products] = useFetchApi<IFetchProducts>(
    gqlUrl,
    params.searchParameters,
    params.options
  )
  const tableRows: ITableRow[] = products?.data?.data?.searchProducts
    ?.collection as unknown as ITableRow[]

  const tableHeaders: ITableHeader[] = productTableheader

  return (
    <>
      {products.status === LoadStatus.SUCCEEDED &&
        Boolean(products?.data?.data?.searchProducts) && (
          <TopProductsTable
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
