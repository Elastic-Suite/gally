import { Paper } from '@mui/material'
import { Box, styled } from '@mui/system'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  ICategory,
  IProductFieldFilterInput,
  LoadStatus,
  defaultPageSize,
  getProductPosition,
  storageGet,
  tokenStorageKey,
} from 'shared'

import BottomTable from '~/components/stateful/TopAndBottomTable/BottomTable'
import TopTable from '~/components/stateful/TopAndBottomTable/TopTable'
import { useGraphqlApi } from '~/hooks'

const PreviewArea = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  fontFamily: 'inter',
  lineHeight: '18px',
  padding: '16px 0  0 16px',
  color: theme.palette.colors.neutral['600'],
}))

interface IProps {
  bottomSelectedRows: (string | number)[]
  catalogId: number
  category: ICategory
  listproductsPinedHooks: any
  listproductsUnPinedHooks: any
  localizedCatalogId: string
  onBottomSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  onTopSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  productGraphqlFilters: IProductFieldFilterInput
  topSelectedRows: (string | number)[]
  setListproductsPinedHooks: any
  setListproductsUnPinedHooks: any
}

function ProductsTopAndBottom(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    bottomSelectedRows,
    catalogId,
    category,
    listproductsPinedHooks,
    listproductsUnPinedHooks,
    localizedCatalogId,
    onBottomSelectedRows,
    onTopSelectedRows,
    productGraphqlFilters,
    topSelectedRows,
    setListproductsPinedHooks,
    setListproductsUnPinedHooks,
  } = props

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)

  const { t } = useTranslation('categories')

  const variables = useMemo(
    () => ({
      localizedCatalogId,
      categoryId: category.id,
    }),
    [localizedCatalogId, category]
  )

  const options = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${storageGet(tokenStorageKey)}` },
    }),
    [storageGet(tokenStorageKey)]
  )

  const [listProductsIdPined] = useGraphqlApi<any>(
    getProductPosition,
    variables,
    options
  )

  function converteToArrayId(dataUncoded: any): any {
    let result = JSON.parse(dataUncoded)
    result = result.map((item: any) => {
      return { id: item.productId, position: item.position }
    })
    return result
  }

  const [productsIdPined, setProductsIdPined] = useState([])

  useEffect(() => {
    if (listProductsIdPined.status === LoadStatus.SUCCEEDED) {
      setProductsIdPined(
        converteToArrayId(
          listProductsIdPined.data.getPositionsCategoryProductMerchandising
            .result
        )
      )
    }
  }, [listProductsIdPined.status])

  return (
    <Paper variant="outlined" sx={{ backgroundColor: 'colors.neutral.300' }}>
      <PreviewArea>{t('previewArea')}</PreviewArea>
      {listProductsIdPined.status === LoadStatus.SUCCEEDED && (
        <Box sx={{ padding: '42px 16px 17px 16px' }}>
          <TopTable
            selectedRows={topSelectedRows}
            onSelectedRows={onTopSelectedRows}
            localizedCatalogId={localizedCatalogId}
            listproductsIdPined={productsIdPined}
            categoryId={category.id}
            setListproductsPinedHooks={setListproductsPinedHooks}
            listproductsPinedHooks={listproductsPinedHooks}
          />
          <Box
            sx={
              listproductsPinedHooks.length !== 0 ? { marginTop: '24px' } : {}
            }
          >
            <BottomTable
              ref={ref}
              catalogId={catalogId}
              selectedRows={bottomSelectedRows}
              onSelectedRows={onBottomSelectedRows}
              localizedCatalogId={localizedCatalogId}
              listProductsIdPined={productsIdPined}
              categoryId={category.id}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              listproductsUnPinedHooks={listproductsUnPinedHooks}
              setListproductsUnPinedHooks={setListproductsUnPinedHooks}
              productGraphqlFilters={productGraphqlFilters}
              listproductsPinedHooks={listproductsPinedHooks}
            />
          </Box>
        </Box>
      )}
    </Paper>
  )
}

export default forwardRef(ProductsTopAndBottom)
