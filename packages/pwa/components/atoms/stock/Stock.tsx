import { useTranslation } from 'react-i18next'

import Chip from '~/components/atoms/Chip/Chip'

interface IProps {
  stockStatus: boolean
}

function Stock(props: IProps): JSX.Element {
  const { stockStatus } = props
  const { t } = useTranslation('common')
  const label = t(stockStatus ? 'stock.inStock' : 'stock.outOfStock')

  return <Chip color={stockStatus ? 'success' : 'error'} label={label} />
}

export default Stock
