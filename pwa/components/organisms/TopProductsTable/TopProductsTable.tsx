import { useTranslation } from 'next-i18next'
import TopProductsBanner from '~/components/molecules/CustomTable/TopProductsBanner/TopProductsBanner'
import { ITableHeader, ITableRow } from '~/types'
import CustomTable from '../CustomTable/CustomTable'

export interface IProps {
  tableHeaders: ITableHeader[]
  tableRows: ITableRow[]
}

function TopProductsTable(props: IProps): JSX.Element {
  const { t } = useTranslation('common')

  return (
    <>
      <TopProductsBanner bannerText={t('searchResults.topProducts')} />
      <CustomTable {...props} withSelection draggable />
    </>
  )
}

export default TopProductsTable
