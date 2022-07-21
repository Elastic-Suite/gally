import { MouseEvent } from 'react'

import { useApiFetch } from '~/hooks/useApi'
import { IHydraMember, IHydraResponse, ITableRow } from '~/types'
import { selectDocs, useAppSelector } from '~/store'

import PagerTable from '~/components/organisms/PagerTable/PagerTable'
import { getApiReadableProperties, getPropertyHeader } from '~/services'

interface IProps {
  api: string
  onPageChange: (
    event: MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void
}

function ApiTable<T extends IHydraMember>(props: IProps): JSX.Element {
  const { api, onPageChange } = props
  const [apiData] = useApiFetch<IHydraResponse<T>>(api)
  const docs = useAppSelector(selectDocs)

  if (apiData.error) {
    return <>{apiData.error.toString()}</>
  } else if (!apiData.data) {
    return null
  }

  const properties = getApiReadableProperties(docs, api, 'get')
  const tableHeaders = properties.map(getPropertyHeader)

  return (
    <PagerTable
      currentPage={0}
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
