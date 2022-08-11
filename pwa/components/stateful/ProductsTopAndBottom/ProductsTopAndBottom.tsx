import { Box, styled } from '@mui/system'
import { Dispatch, SetStateAction } from 'react'
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
}

function ProductsTopAndBottom(props: IProps): JSX.Element {
  const {
    topSelectedRows,
    onTopSelectedRows,
    bottomSelectedRows,
    onBottomSelectedRows,
  } = props

  const { t } = useTranslation('categories')

  return (
    <Box sx={{ backgroundColor: 'colors.neutral.300' }}>
      <PreviewArea>{t('previewArea')}</PreviewArea>
      <Box sx={{ padding: '42px 16px 17px 16px' }}>
        <TopTable
          selectedRows={topSelectedRows}
          onSelectedRows={onTopSelectedRows}
          catalogId="com_fr"
        />
        <Box sx={{ marginTop: '24px' }}>
          <BottomTable
            selectedRows={bottomSelectedRows}
            onSelectedRows={onBottomSelectedRows}
            catalogId="com_fr"
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ProductsTopAndBottom
