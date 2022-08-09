import { Dispatch, SetStateAction, useMemo } from 'react'
import { gqlUrl, productTableFields, productTableheader } from '~/constants'
import { useApiFetch } from '~/hooks'
import { removeEmptyParameters } from '~/services'
import { ISearchParameters, ITableHeader, ITableRow, LoadStatus } from '~/types'
import { IFetchParams, IFetchProducts } from '~/types/products'
import TopProductsTable from '../TopProductsTable/TopProductsTable'

interface IProps {
  selectedRows: (string | number)[]
  setSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
}

function TopTable(props: IProps): JSX.Element {
  const { selectedRows, setSelectedRows } = props

  // todo : when api product will be finalize, factorize code and exports this into a products service with top and bottom distinguish.
  const gqlQuery = `
  query {
    searchProducts(catalogId: "com_fr", currentPage:1, pageSize:2) {
      collection {
        ${productTableFields}
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

  return (
    <>
      {products.status === LoadStatus.SUCCEEDED &&
        Boolean(products?.data?.data?.searchProducts) && (
          <TopProductsTable
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            tableHeaders={tableHeaders}
            tableRows={tableRows}
            draggable
            paginated={false}
          />
        )}
    </>
  )
}

export default TopTable
