import { ITabContentProps } from 'shared'

import ResourceTable from '../ResourceTable/ResourceTable'

const fixedFilters = { 'metadata.entity': 'product' }

function SettingsAttributes(props: ITabContentProps): JSX.Element {
  const { active } = props
  return (
    <ResourceTable
      resourceName="SourceField"
      active={active}
      filters={fixedFilters}
    />
  )
}

export default SettingsAttributes
