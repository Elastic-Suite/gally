import { Resource } from '@api-platform/api-doc-parser'

import { defaultPageSize } from '~/constants'
import { useApiHeaders } from '~/hooks'
import { IHydraMember, IHydraResponse, ITableRow } from '~/types'

import PagerTable from '~/components/organisms/PagerTable/PagerTable'

interface IProps<T extends IHydraMember> {
  apiData: IHydraResponse<T>
  currentPage?: number
  onPageChange: (page: number) => void
  resource: Resource
  rowsPerPage?: number
  rowsPerPageOptions?: number[]
}

function TableGuesser<T extends IHydraMember>(props: IProps<T>): JSX.Element {
  const {
    apiData,
    currentPage,
    onPageChange,
    resource,
    rowsPerPage,
    rowsPerPageOptions,
  } = props
  const tableHeaders = useApiHeaders(resource)

  return (
    <PagerTable
      currentPage={currentPage ?? 0}
      onPageChange={onPageChange}
      rowsPerPage={rowsPerPage ?? defaultPageSize}
      rowsPerPageOptions={rowsPerPageOptions ?? []}
      tableHeaders={tableHeaders}
      tableRows={apiData['hydra:member'] as unknown as ITableRow[]}
      totalPages={apiData['hydra:totalItems']}
      withSelection
    />
  )
}

export default TableGuesser
