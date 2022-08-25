import {
  useFilters,
  useFiltersRedirect,
  usePage,
  useResource,
  useSearch,
} from '~/hooks'
import { ITabContentProps } from '~/types'

import CommonGridFromSourceField from '../CommonGridFromSourceField/CommonGridFromSourceField'

function SettingsAttributes(props: ITabContentProps): JSX.Element {
  const { active } = props

  const resourceName = 'SourceField'
  const resource = useResource(resourceName)
  const [page, setPage] = usePage()
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const [searchValue, setSearchValue] = useSearch()
  useFiltersRedirect(page, activeFilters, searchValue, active)

  return (
    <CommonGridFromSourceField
      page={page}
      setPage={setPage}
      activeFilters={activeFilters}
      setActiveFilters={setActiveFilters}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      resource={resource}
    />
  )
}

export default SettingsAttributes
