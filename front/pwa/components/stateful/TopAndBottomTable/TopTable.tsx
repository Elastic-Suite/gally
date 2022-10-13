import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'

import { useGraphqlApi } from '~/hooks'
import {
  IGraphqlSearchProducts,
  IProductFieldFilterInput,
  ITableHeader,
  ITableRow,
  LoadStatus,
  getProductPined,
  getSearchProductsQuery,
  productTableheader,
  storageGet,
  tokenStorageKey,
} from 'shared'

import FieldGuesser from '../FieldGuesser/FieldGuesser'
import TopProductsTable from '../TopProductsTable/TopProductsTable'

interface IProps {
  categoryId: string
  localizedCatalogId: string
  listproductsIdPined: Array<number>
  listproductsPinedHooks: any
  onSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  selectedRows: (string | number)[]
  setListproductsPinedHooks: any
}

function TopTable(props: IProps): JSX.Element {
  const {
    selectedRows,
    onSelectedRows,
    localizedCatalogId,
    listproductsIdPined,
    categoryId,
    setListproductsPinedHooks,
    listproductsPinedHooks,
  } = props

  const variables = useMemo(
    () => ({
      listproductsIdPined,
      localizedCatalogId: localizedCatalogId.toString(),
      categoryId,
    }),
    [listproductsIdPined, categoryId]
  )

  const options = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${storageGet(tokenStorageKey)}` },
    }),
    [storageGet(tokenStorageKey)]
  )

  const [products] = useGraphqlApi<IGraphqlSearchProducts>(
    getProductPined,
    variables,
    options
  )

  useEffect(() => {
    if (products.status === LoadStatus.SUCCEEDED) {
      setListproductsPinedHooks(products?.data?.searchProducts?.collection)
    }
  }, [products])

  // NE PAS SUPPRIMER
  // const tableRows: ITableRow[] = products?.data?.searchProducts
  //   ?.collection as unknown as ITableRow[]

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
            tableRows={listproductsPinedHooks}
            setListproductsPinedHooks={setListproductsPinedHooks}
            draggable
          />
        )}
    </>
  )
}

export default TopTable
