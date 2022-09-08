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
  topSelectedRows: (string | number)[]
  onTopSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  bottomSelectedRows: (string | number)[]
  onBottomSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  catalogId: string
}

function ProductsTopAndBottom(
  props: IProps,
  ref: MutableRefObject<HTMLDivElement>
): JSX.Element {
  const {
    topSelectedRows,
    onTopSelectedRows,
    bottomSelectedRows,
    onBottomSelectedRows,
    catalogId,
  } = props

  const { t } = useTranslation('categories')

  return (
    <Paper variant="outlined" sx={{ backgroundColor: 'colors.neutral.300' }}>
      <PreviewArea>{t('previewArea')}</PreviewArea>
      <Box sx={{ padding: '42px 16px 17px 16px' }}>
        <TopTable
          selectedRows={topSelectedRows}
          onSelectedRows={onTopSelectedRows}
          catalogId={catalogId}
        />
        <Box sx={{ marginTop: '24px' }}>
          <BottomTable
            ref={ref}
            selectedRows={bottomSelectedRows}
            onSelectedRows={onBottomSelectedRows}
            catalogId={catalogId}
          />
        </Box>
      </Box>
    </Paper>
  )
}

export default forwardRef(ProductsTopAndBottom)
