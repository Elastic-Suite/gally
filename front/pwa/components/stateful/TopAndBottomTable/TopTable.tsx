import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'

import { useGraphqlApi } from '~/hooks'
import {
  IGraphqlSearchProducts,
  ITableHeader,
  LoadStatus,
  getProductPined,
  productTableheader,
  storageGet,
  tokenStorageKey,
} from 'shared'

import FieldGuesser from '../FieldGuesser/FieldGuesser'
import TopProductsTable from '../TopProductsTable/TopProductsTable'

interface IProps {
  categoryId: string
  localizedCatalogId: string
  listProductsIdPined: Array<number>
  listProductsPinedHooks: any
  onSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  selectedRows: (string | number)[]
  setListProductsPinedHooks: any
}

function TopTable(props: IProps): JSX.Element {
  const {
    selectedRows,
    onSelectedRows,
    localizedCatalogId,
    listProductsIdPined,
    categoryId,
    setListProductsPinedHooks,
    listProductsPinedHooks,
  } = props

  const variables = useMemo(
    () => ({
      listProductsIdPined: listProductsIdPined.map((item: any) => item.id),
      localizedCatalogId: localizedCatalogId.toString(),
      categoryId,
    }),
    [listProductsIdPined, categoryId, localizedCatalogId]
  )

  const token = storageGet(tokenStorageKey)
  const options = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  )

  const [products] = useGraphqlApi<IGraphqlSearchProducts>(
    getProductPined,
    variables,
    options
  )

  function reOrder(listProduct: any): any[] {
    const b = listProductsIdPined
      .sort((a: any, b: any) => a.position - b.position)
      // eslint-disable-next-line array-callback-return
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
        setListProductsPinedHooks(
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
        listProductsPinedHooks.length > 0 &&
        Boolean(products?.data?.searchProducts) && (
          <TopProductsTable
            Field={FieldGuesser}
            selectedRows={selectedRows}
            onSelectedRows={onSelectedRows}
            tableHeaders={tableHeaders}
            tableRows={listProductsPinedHooks}
            setListProductsPinedHooks={setListProductsPinedHooks}
            draggable
          />
        )}
    </>
  )
}

export default TopTable
