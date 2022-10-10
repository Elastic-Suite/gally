import { ITabContentProps } from 'shared'

import ResourceTable from '../ResourceTable/ResourceTable'

function SettingsAttributes(props: ITabContentProps): JSX.Element {
  const { active } = props
  return <ResourceTable resourceName="SourceField" active={active} />
}

export default SettingsAttributes
