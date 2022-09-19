import { ITabContentProps } from 'shared'

import CommonGridFromSourceField from '../CommonGridFromSourceField/CommonGridFromSourceField'

const fixedFilters = { 'metadata.entity': 'product' }

function SettingsAttributes(props: ITabContentProps): JSX.Element {
  const { active } = props
  return <CommonGridFromSourceField active={active} filters={fixedFilters} />
}

export default SettingsAttributes
