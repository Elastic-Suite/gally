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
      listproductsIdPined: listproductsIdPined.map((item: any) => item.id),
      localizedCatalogId: localizedCatalogId.toString(),
      categoryId,
    }),
    [listproductsIdPined, categoryId, localizedCatalogId]
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

  function reOrder(listProduct: any): any[] {
    const b = listproductsIdPined
      .sort((a: any, b: any) => a.position - b.position)
      .map((item: any) => {
        const a = listProduct.find(
          (element: any) => element.id === `/products/${item.id}`
        )
        if (a) {
          return { ...a, position: item.position }
        }
      })
    return b
  }

  useEffect(() => {
    if (products.status === LoadStatus.SUCCEEDED) {
      if (products.data.searchProducts.collection.length > 0) {
        setListproductsPinedHooks(
          reOrder(products?.data?.searchProducts?.collection)
        )
      }
    }
  }, [products])

  // NE PAS SUPPRIMER
  // const tableRows: ITableRow[] = products?.data?.searchProducts
  //   ?.collection as unknown as ITableRow[]

  const tableHeaders: ITableHeader[] = productTableheader

  return (
    <>
      {products.status === LoadStatus.SUCCEEDED &&
        listproductsPinedHooks.length > 0 &&
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
