import { useTranslation } from 'next-i18next'
import { Dispatch, SetStateAction } from 'react'
import TopProductsBanner from '~/components/molecules/CustomTable/TopProductsBanner/TopProductsBanner'
import { ITableHeader, ITableRow } from '~/types'
import CustomTable from '../CustomTable/CustomTable'

export interface IProps {
  selectedRows: (string | number)[]
  setSelectedRows: Dispatch<SetStateAction<(string | number)[]>>
  tableHeaders: ITableHeader[]
  tableRows: ITableRow[]
  withSelection: boolean
  draggable: boolean
  paginated: boolean
}

function TopProductsTable(props: IProps): JSX.Element {
  const { t } = useTranslation('common')

  return (
    <>
      <TopProductsBanner bannerText={t('searchResults.topProducts')} />
      <CustomTable {...props} />
    </>
  )
}

export default TopProductsTable
