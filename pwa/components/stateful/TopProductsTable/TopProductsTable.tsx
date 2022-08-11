import { styled } from '@mui/system'
import { useTranslation } from 'next-i18next'
import TopProductsBanner from '~/components/molecules/CustomTable/TopProductsBanner/TopProductsBanner'
import CustomTable, {
  ICustomTableProps,
} from '../../organisms/CustomTable/CustomTable'

const Container = styled('div')(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}))

function TopProductsTable(props: ICustomTableProps): JSX.Element {
  const { t } = useTranslation('common')

  return (
    <Container>
      <TopProductsBanner bannerText={t('searchResults.topProducts')} />
      <CustomTable {...props} />
    </Container>
  )
}

export default TopProductsTable
