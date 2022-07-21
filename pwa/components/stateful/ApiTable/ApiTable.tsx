import { MouseEvent } from 'react'

import { IHydraMember, IHydraResponse, ITableRow } from '~/types'
import { selectDocs, useAppSelector } from '~/store'

import PagerTable from '~/components/organisms/PagerTable/PagerTable'
import { useApiHeaders } from '~/hooks'

interface IProps<T extends IHydraMember> {
  api: string
  apiData: IHydraResponse<T>
  onPageChange: (
    event: MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void
}

function ApiTable<T extends IHydraMember>(props: IProps<T>): JSX.Element {
  const { api, apiData, onPageChange } = props
  const docs = useAppSelector(selectDocs)
  const tableHeaders = useApiHeaders(docs, api)

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

export default ApiTable
