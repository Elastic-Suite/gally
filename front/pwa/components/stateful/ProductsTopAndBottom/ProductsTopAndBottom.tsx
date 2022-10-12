import { Paper } from '@mui/material'
import { Box, styled } from '@mui/system'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  forwardRef,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  ICategory,
  IProductFieldFilterInput,
  defaultPageSize,
  getProductPostion,
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
  localizedCatalogId: string
  onBottomSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  onTopSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  productGraphqlFilters: IProductFieldFilterInput
  topSelectedRows: (string | number)[]
}

function ProductsTopAndBottom(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    bottomSelectedRows,
    catalogId,
    category,
    localizedCatalogId,
    onBottomSelectedRows,
    onTopSelectedRows,
    productGraphqlFilters,
    topSelectedRows,
  } = props

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultPageSize)

  const { t } = useTranslation('categories')

  const variables = useMemo(
    () => ({
      categoryId: category.id,
      localizedCatalogId,
    }),
    [localizedCatalogId, currentPage, rowsPerPage]
  )

  const options = {
    headers: { Authorization: `Bearer ${storageGet(tokenStorageKey)}` },
  }
  // console.log(variables)

  const [listProductIdPined] = useGraphqlApi<any>(getProductPostion, variables)

  return (
    <Paper variant="outlined" sx={{ backgroundColor: 'colors.neutral.300' }}>
      <PreviewArea>{t('previewArea')}</PreviewArea>
      <Box sx={{ padding: '42px 16px 17px 16px' }}>
        <TopTable
          catalogId={catalogId}
          localizedCatalogId={localizedCatalogId}
          productGraphqlFilters={productGraphqlFilters}
          onSelectedRows={onTopSelectedRows}
          selectedRows={topSelectedRows}
        />
        <Box sx={{ marginTop: '24px' }}>
          <BottomTable
            ref={ref}
            catalogId={catalogId}
            currentPage={currentPage}
            localizedCatalogId={localizedCatalogId}
            productGraphqlFilters={productGraphqlFilters}
            onSelectedRows={onBottomSelectedRows}
            rowsPerPage={rowsPerPage}
            selectedRows={bottomSelectedRows}
            setCurrentPage={setCurrentPage}
            setRowsPerPage={setRowsPerPage}
          />
        </Box>
      </Box>
    </Paper>
  )
}

export default forwardRef(ProductsTopAndBottom)
