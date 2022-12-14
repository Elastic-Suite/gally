import Tooltip from '~/components/atoms/modals/Tooltip'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { ReactNode } from 'react'

interface IProps {
  title: string
  children?: ReactNode
  noStyle?: boolean
}

function InfoTooltip({ title, children, noStyle }: IProps): JSX.Element {
  return (
    <Tooltip title={title} placement="right">
      <span
        style={{
          display: 'inline-block',
          paddingLeft: noStyle ? '' : '10px',
          marginBottom: noStyle ? '' : '-5px',
        }}
      >
        {children ? children : <IonIcon name="informationCircle" tooltip />}
      </span>
    </Tooltip>
  )
}

export default InfoTooltip
