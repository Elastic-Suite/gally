import { ITabContentProps } from '~/types'

import CommonGridFromSourceField from '../CommonGridFromSourceField/CommonGridFromSourceField'

function SettingsAttributes(props: ITabContentProps): JSX.Element {
  const { active } = props

  return <CommonGridFromSourceField active={active} />
}

export default SettingsAttributes
