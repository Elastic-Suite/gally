import { MouseEvent } from 'react'

import { useApiFetch } from '~/hooks/useApi'
import { IHydraResponse, ITableRow } from '~/types'
import { selectDocs, useAppSelector } from '~/store'

import CustomTable from '~/components/organisms/CustomTable/CustomTable'
import { getApiReadableProperties, getPropertyHeader } from '~/services'

interface IProps {
  api: string
  onMassiveAction?: (action: string) => void
  onPageChange: (
    event: MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void
}

function ApiTable(props: IProps): JSX.Element {
  const { api, onMassiveAction, onPageChange } = props
  const [apiData] = useApiFetch<IHydraResponse>(api)
  const docs = useAppSelector(selectDocs)

  if (apiData.error) {
    return <>{apiData.error.toString()}</>
  } else if (!apiData.data) {
    return null
  }

  const properties = getApiReadableProperties(docs, api, 'get')
  const tableHeaders = properties.map(getPropertyHeader)
  // console.log(apiData.data['hydra:member'] )

  return (
    <CustomTable
      currentPage={0}
      onMassiveAction={onMassiveAction}
      onPageChange={onPageChange}
      rowsPerPage={50}
      rowsPerPageOptions={[]}
      tableHeaders={tableHeaders}
      tableRows={apiData.data['hydra:member'] as unknown as ITableRow[]}
      totalPages={apiData.data['hydra:totalItems']}
      withSelection
    />
  )
}

export default ApiTable
