import { Paper } from '@mui/material'
import { Box, styled } from '@mui/system'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  forwardRef,
  useEffect,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  IGraphqlProductPosition,
  IProductFieldFilterInput,
  IProductPositions,
} from 'shared'

import BottomTable from '~/components/stateful/TopAndBottomTable/BottomTable'
import TopTable from '~/components/stateful/TopAndBottomTable/TopTable'
import { selectConfiguration, useAppSelector } from '~/store'

const PreviewArea = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  fontFamily: 'inter',
  lineHeight: '18px',
  padding: '16px 0  0 16px',
  color: theme.palette.colors.neutral['600'],
}))

interface IProps {
  bottomSelectedRows: (string | number)[]
  localizedCatalogId: string
  onBottomSelectedRows: (rowIds: string[]) => void
  onTopSelectedRows: (rowIds: string[]) => void
  productGraphqlFilters: IProductFieldFilterInput
  setProductPositions: Dispatch<SetStateAction<IGraphqlProductPosition>>
  topSelectedRows: (string | number)[]
  topProducts: IProductPositions
  setNbBottomRows: (value: number) => void
  setNbTopRows: (value: number) => void
  sortValue: string
  searchValue: string
  nbTopProducts: number
}

function ProductsTopAndBottom(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    bottomSelectedRows,
    localizedCatalogId,
    onBottomSelectedRows,
    onTopSelectedRows,
    productGraphqlFilters,
    setProductPositions,
    topSelectedRows,
    topProducts,
    setNbBottomRows,
    setNbTopRows,
    sortValue,
    searchValue,
    nbTopProducts,
  } = props
  const { t } = useTranslation('categories')

  const topProductsIds = topProducts
    .map((topProduct) => topProduct.productId)
    .sort()

  const configuration = useAppSelector(selectConfiguration)

  useEffect(() => {
    if (topProducts.length === 0) {
      setNbTopRows(0)
    }
  }, [topProducts, setNbTopRows])

  return (
    configuration && (
      <Paper variant="outlined" sx={{ backgroundColor: 'colors.neutral.300' }}>
        <PreviewArea>{t('previewArea')}</PreviewArea>
        <Box sx={{ padding: '28px 16px 17px 16px' }}>
          {topProducts.length !== 0 && (
            <TopTable
              selectedRows={topSelectedRows}
              onSelectedRows={onTopSelectedRows}
              localizedCatalogId={localizedCatalogId}
              productGraphqlFilters={productGraphqlFilters}
              setProductPositions={setProductPositions}
              topProducts={topProducts}
              topProductsIds={topProductsIds}
              sortValue={sortValue}
              searchValue={searchValue}
              configuration={configuration}
              setNbTopRows={setNbTopRows}
            />
          )}
          <BottomTable
            ref={ref}
            selectedRows={bottomSelectedRows}
            onSelectedRows={onBottomSelectedRows}
            localizedCatalogId={localizedCatalogId}
            productGraphqlFilters={productGraphqlFilters}
            topProductsIds={topProductsIds}
            setNbBottomRows={setNbBottomRows}
            sortValue={sortValue}
            searchValue={searchValue}
            configuration={configuration}
            nbTopProducts={nbTopProducts}
          />
        </Box>
      </Paper>
    )
  )
}

export default forwardRef(ProductsTopAndBottom)
