import { MouseEvent } from 'react'
import { Resource } from '@api-platform/api-doc-parser'

import { IHydraMember, IHydraResponse, ITableRow } from '~/types'

import PagerTable from '~/components/organisms/PagerTable/PagerTable'
import { useApiHeaders } from '~/hooks'

interface IProps<T extends IHydraMember> {
  apiData: IHydraResponse<T>
  onPageChange: (
    event: MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void
  resource: Resource
}

function TableGuesser<T extends IHydraMember>(props: IProps<T>): JSX.Element {
  const { apiData, onPageChange, resource } = props
  const tableHeaders = useApiHeaders(resource)

  return (
    <PagerTable
      currentPage={0}
      onPageChange={onPageChange}
      rowsPerPage={50}
      rowsPerPageOptions={[]}
      tableHeaders={tableHeaders}
      tableRows={apiData['hydra:member'] as unknown as ITableRow[]}
      totalPages={apiData['hydra:totalItems']}
      withSelection
    />
  )
}

export default TableGuesser
