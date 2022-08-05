import Tooltip from '~/components/atoms/modals/Tooltip'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

function InfoTooltip({ text }: { text: string }): JSX.Element {
  return (
    <Tooltip title={text} placement="left">
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
