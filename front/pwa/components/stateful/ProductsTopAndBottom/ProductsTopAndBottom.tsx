import { Paper } from '@mui/material'
import { Box, styled } from '@mui/system'
import { Dispatch, MutableRefObject, SetStateAction, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import BottomTable from '~/components/stateful/TopAndBottomTable/BottomTable'
import TopTable from '~/components/stateful/TopAndBottomTable/TopTable'

const PreviewArea = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  fontFamily: 'inter',
  lineHeight: '18px',
  padding: '16px 0  0 16px',
  color: theme.palette.colors.neutral['600'],
}))

interface IProps {
  bottomSelectedRows: (string | number)[]
  catalogId: string
  onBottomSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  onTopSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  productGraphqlFilters: unknown
  topSelectedRows: (string | number)[]
}

function ProductsTopAndBottom(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    bottomSelectedRows,
    catalogId,
    onBottomSelectedRows,
    onTopSelectedRows,
    productGraphqlFilters,
    topSelectedRows,
  } = props

  const { t } = useTranslation('categories')

  return (
    <Paper variant="outlined" sx={{ backgroundColor: 'colors.neutral.300' }}>
      <PreviewArea>{t('previewArea')}</PreviewArea>
      <Box sx={{ padding: '42px 16px 17px 16px' }}>
        <TopTable
          catalogId={catalogId}
          productGraphqlFilters={productGraphqlFilters}
          onSelectedRows={onTopSelectedRows}
          selectedRows={topSelectedRows}
        />
        <Box sx={{ marginTop: '24px' }}>
          <BottomTable
            ref={ref}
            catalogId={catalogId}
            productGraphqlFilters={productGraphqlFilters}
            onSelectedRows={onBottomSelectedRows}
            selectedRows={bottomSelectedRows}
          />
        </Box>
      </Box>
    </Paper>
  )
}

export default forwardRef(ProductsTopAndBottom)
