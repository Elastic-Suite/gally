import { ITabContentProps } from 'shared'
import { useFilters, useResource } from '~/hooks'

import ResourceTable from '../ResourceTable/ResourceTable'

const fixedFilters = { 'metadata.entity': 'product' }

function SettingsAttributes(props: ITabContentProps): JSX.Element {
  const { active } = props

  const resource = useResource('SourceField')
  const [activeFilters, setActiveFilters] = useFilters(resource)

  return (
    <ResourceTable
      activeFilters={activeFilters}
      setActiveFilters={setActiveFilters}
      resourceName="SourceField"
      active={active}
      filters={fixedFilters}
    />
  )
}

export default SettingsAttributes
