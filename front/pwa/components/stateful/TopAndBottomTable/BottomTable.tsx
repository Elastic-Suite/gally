import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  forwardRef,
  useEffect,
  useMemo,
} from 'react'

import { useApiGraphql, useGraphqlApi } from '~/hooks'
import {
  IGraphqlSearchProducts,
  IProductFieldFilterInput,
  ITableHeader,
  LoadStatus,
  defaultRowsPerPageOptions,
  getSearchProductsQuery,
  isError,
  productTableheader,
  storageGet,
  tokenStorageKey,
} from 'shared'

import PagerTable from '../../organisms/PagerTable/PagerTable'

import FieldGuesser from '../FieldGuesser/FieldGuesser'

interface IProps {
  catalogId: number
  categoryId: string
  currentPage: number
  listProductsPinedHooks: any
  listProductsUnPinedHooks: any
  localizedCatalogId: string
  onSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  productGraphqlFilters: IProductFieldFilterInput
  rowsPerPage: number
  selectedRows: (string | number)[]
  setCurrentPage: any
  setListProductsUnPinedHooks: any
  setRowsPerPage: any
}

function BottomTable(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    catalogId,
    categoryId,
    currentPage,
    listProductsPinedHooks,
    listProductsUnPinedHooks,
    localizedCatalogId,
    onSelectedRows,
    productGraphqlFilters,
    rowsPerPage,
    selectedRows,
    setCurrentPage,
    setListProductsUnPinedHooks,
    setRowsPerPage,
  } = props

  const rowsPerPageOptions = defaultRowsPerPageOptions

  // todo : when api product will be finalize, factorize code and exports this into a products service with top and bottom distinguish.

  const variables = useMemo(
    () => ({ catalogId, currentPage, pageSize: rowsPerPage }),
    [catalogId, currentPage, rowsPerPage]
  )
  const token = storageGet(tokenStorageKey)
  const options = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  )
  const [products] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery(productGraphqlFilters),
    variables,
    options
  )

  useEffect(() => {
    if (products.status === LoadStatus.SUCCEEDED) {
      setListProductsUnPinedHooks(products?.data?.searchProducts?.collection)
    }
  }, [products])

  // const tableRows: ITableRow[] = products?.data?.searchProducts
  //   ?.collection as unknown as ITableRow[]

  const tableHeaders: ITableHeader[] = productTableheader

  function onPageChange(page: number): void {
    setCurrentPage(page + 1)
    onSelectedRows([])
  }

  const onRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setRowsPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  const variablesUnPined = useMemo(
    () => ({
      listProductsIdPined: listProductsPinedHooks.map((item: any) =>
        Number(item.id.split('/')[2])
      ),
      localizedCatalogId: localizedCatalogId.toString(),
      categoryId,
      currentPage,
      pageSize: rowsPerPage,
    }),
    [listProductsPinedHooks, currentPage, categoryId, rowsPerPage]
  )

  const graphqlApi = useApiGraphql()
  async function handleClick(): Promise<void> {
    await graphqlApi(
      getSearchProductsQuery(productGraphqlFilters),
      variablesUnPined,
      options
    ).then((json: any) => {
      if (isError(json)) {
        // setResponseSavePositions({
        //   error: json.error,
        //   status: LoadStatus.FAILED,
        // })
        console.log('errr')
      } else {
        // if (products.status === LoadStatus.SUCCEEDED) {
        console.log(json)

        setListProductsUnPinedHooks(json.searchProducts.collection)
      }

      console.log('good')
      // }
    })
  }
  // console.log(
  //   listProductsPinedHooks.map((item: any) => parseInt(item.id.split('/')[2]))
  // )

  useEffect(() => {
    handleClick()
  }, [listProductsPinedHooks])

  return (
    <>
      {products.status === LoadStatus.SUCCEEDED &&
        Boolean(products?.data?.searchProducts) && (
          <PagerTable
            Field={FieldGuesser}
            currentPage={
              (currentPage - 1 >= 0 ? currentPage - 1 : currentPage) ?? 0
            }
            onPageChange={onPageChange}
            ref={ref}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions ?? []}
            onRowsPerPageChange={onRowsPerPageChange}
            tableHeaders={tableHeaders}
            tableRows={listProductsUnPinedHooks}
            selectedRows={selectedRows}
            onSelectedRows={onSelectedRows}
            count={products.data.searchProducts.paginationInfo.totalCount}
          />
        )}
    </>
  )
}

export default forwardRef(BottomTable)
