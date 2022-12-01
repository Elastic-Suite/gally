import { ITabContentProps, ITableConfig, ITableRow } from 'shared'
import { useFilters, useResource } from '~/hooks'

import ResourceTable from '../ResourceTable/ResourceTable'

const fixedFilters = { 'metadata.entity': 'product' }

function SettingsAttributes(props: ITabContentProps): JSX.Element {
  const { active } = props

  const resource = useResource('SourceField')
  const [activeFilters, setActiveFilters] = useFilters(resource)

  function getTableConfigs(rows: ITableRow[]): ITableConfig[] {
    return rows.map((row) => ({ disabled: Boolean(row.isSystem) }))
  }

  return (
    <ResourceTable
      active={active}
      activeFilters={activeFilters}
      filters={fixedFilters}
      getTableConfigs={getTableConfigs}
      resourceName="SourceField"
      setActiveFilters={setActiveFilters}
    />
  )
}

export default SettingsAttributes
