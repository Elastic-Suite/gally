import { Box, styled } from '@mui/system'
import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import BottomTable from '~/components/organisms/TopAndBottomTable/BottomTable'
import TopTable from '~/components/organisms/TopAndBottomTable/TopTable'

const PreviewArea = styled(Box)(({ theme }) => ({
  fontSize: '12px',
  fontFamily: 'inter',
  lineHeight: '18px',
  padding: '16px 0  0 16px',
  color: theme.palette.colors.neutral['600'],
}))

interface IProps {
  topSelectedRows: (string | number)[]
  setTopSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  bottomSelectedRows: (string | number)[]
  setBottomSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
}

function ProductsTopAndBottom(props: IProps): JSX.Element {
  const {
    topSelectedRows,
    setTopSelectedRows,
    bottomSelectedRows,
    setBottomSelectedRows,
  } = props

  const { t } = useTranslation('common')

  return (
    <Box sx={{ backgroundColor: 'colors.neutral.300' }}>
      <PreviewArea>{t('categories.previewArea')}</PreviewArea>
      <Box sx={{ padding: '42px 16px 17px 16px' }}>
        <TopTable
          selectedRows={topSelectedRows}
          setSelectedRows={setTopSelectedRows}
        />
        <Box sx={{ marginTop: '24px' }}>
          <BottomTable
            selectedRows={bottomSelectedRows}
            setSelectedRows={setBottomSelectedRows}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default ProductsTopAndBottom
