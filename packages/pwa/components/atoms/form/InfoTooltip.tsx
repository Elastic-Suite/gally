import Tooltip from '~/components/atoms/modals/Tooltip'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

interface IProps {
  title: string
}

function InfoTooltip({ title }: IProps): JSX.Element {
  return (
    <Tooltip title={title} placement="right">
      <span
        style={{
          display: 'inline-block',
          paddingLeft: '10px',
          marginBottom: '-5px',
        }}
      >
        <IonIcon name="informationCircle" tooltip />
      </span>
    </Tooltip>
  )
}

export default InfoTooltip
