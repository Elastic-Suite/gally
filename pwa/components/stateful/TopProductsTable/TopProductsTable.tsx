import { useTranslation } from 'next-i18next'
import TopProductsBanner from '~/components/molecules/CustomTable/TopProductsBanner/TopProductsBanner'
import CustomTable, {
  ICustomTableProps,
} from '../../organisms/CustomTable/CustomTable'

function TopProductsTable(props: ICustomTableProps): JSX.Element {
  const { t } = useTranslation('common')

  return (
    <>
      <TopProductsBanner bannerText={t('searchResults.topProducts')} />
      <CustomTable {...props} />
    </>
  )
}

export default TopProductsTable
