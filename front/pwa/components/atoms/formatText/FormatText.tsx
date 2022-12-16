import { firstLetterUppercase } from 'shared'
import InfoTooltip from '../form/InfoTooltip'

interface IProps {
  name: string
  max?: number
  toolTip?: boolean
  firstLetterUpp?: boolean
}

function FormatText(props: IProps): JSX.Element {
  const { name, max = 28, toolTip, firstLetterUpp } = props
  let newName = ''
  if (name.length > max) {
    newName = `${name.substring(0, max)}...`
    return toolTip ? (
      <InfoTooltip title={name} noStyle>
        {firstLetterUpp ? firstLetterUppercase(newName) : newName}
      </InfoTooltip>
    ) : firstLetterUpp ? (
      <>{firstLetterUppercase(newName)}</>
    ) : (
      <>{newName}</>
    )
  }
  return <>{firstLetterUpp ? firstLetterUppercase(name) : name}</>
}

export default FormatText
