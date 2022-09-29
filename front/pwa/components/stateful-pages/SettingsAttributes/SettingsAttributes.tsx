import { ITabContentProps } from 'shared'

import CommonGridFromSourceField from '../ResourceTable/ResourceTable'

const fixedFilters = { 'metadata.entity': 'product' }

function SettingsAttributes(props: ITabContentProps): JSX.Element {
  const { active } = props
  return <CommonGridFromSourceField resourceName='SourceField' active={active} filters={fixedFilters} />
}

export default SettingsAttributes
