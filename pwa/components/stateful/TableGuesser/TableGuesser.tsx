import { defaultPageSize } from '~/constants'
import { useApiHeaders } from '~/hooks'
import { IHydraMember, IHydraResponse, IResource, ITableRow } from '~/types'

import PagerTable from '~/components/organisms/PagerTable/PagerTable'

interface IProps<T extends IHydraMember> {
  apiData: IHydraResponse<T>
  currentPage?: number
  onPageChange: (page: number) => void
  onRowUpdate?: (
    id: string | number,
    field: string,
    value: boolean | number | string
  ) => void
  resource: IResource
  rowsPerPage?: number
  rowsPerPageOptions?: number[]
}

function TableGuesser<T extends IHydraMember>(props: IProps<T>): JSX.Element {
  const {
    apiData,
    currentPage,
    onPageChange,
    onRowUpdate,
    resource,
    rowsPerPage,
    rowsPerPageOptions,
  } = props
  const tableHeaders = useApiHeaders(resource)

  return (
    <PagerTable
      currentPage={currentPage ?? 0}
      onPageChange={onPageChange}
      onRowUpdate={onRowUpdate}
      rowsPerPage={rowsPerPage ?? defaultPageSize}
      rowsPerPageOptions={rowsPerPageOptions ?? []}
      tableHeaders={tableHeaders}
      tableRows={apiData['hydra:member'] as unknown as ITableRow[]}
      totalPages={apiData['hydra:totalItems']}
      paginated
    />
  )
}

export default TableGuesser
