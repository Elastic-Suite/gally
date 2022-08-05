import { defaultPageSize } from '~/constants'
import { useApiHeaders } from '~/hooks'
import { IHydraMember, IHydraResponse, IResource, ITableRow } from '~/types'

import PagerTable from '~/components/organisms/PagerTable/PagerTable'

interface IProps<T extends IHydraMember> {
  apiData: IHydraResponse<T>
  currentPage?: number
  onPageChange: (page: number) => void
  onRowUpdate?: (row: ITableRow) => void
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
  console.log(resource)
  // console.log(tableHeaders)
  console.log(apiData)

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
      withSelection
    />
  )
}

export default TableGuesser
