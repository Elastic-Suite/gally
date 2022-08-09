import { useTranslation } from 'react-i18next'
import Tag from '~/components/atoms/form/Tag'

interface IProps {
  stockStatus: boolean
}

function Stock(props: IProps): JSX.Element {
  const { stockStatus } = props
  const { t } = useTranslation('common')
  const label = t(stockStatus ? 'stock.inStock' : 'stock.outOfStock')

  return <Tag color={stockStatus ? 'success' : 'error'}>{label}</Tag>
}

export default Stock
