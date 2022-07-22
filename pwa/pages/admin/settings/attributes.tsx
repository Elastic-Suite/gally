import { MouseEvent } from 'react'
import { useTranslation } from 'next-i18next'

import { useApiFetch, useResource } from '~/hooks'
import { IHydraResponse, ISourceField } from '~/types'

import PageTile from '~/components/atoms/PageTitle/PageTitle'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'

import FiltersGuesser from '~/components/stateful/FiltersGuesser/FiltersGuesser'
import TableGuesser from '~/components/stateful/TableGuesser/TableGuesser'

function Attributes(): JSX.Element | string {
  const resourceName = 'source_fields'
  const resource = useResource(resourceName)
  const [sourceFields] = useApiFetch<IHydraResponse<ISourceField>>(resource)
  const { t } = useTranslation('attributes')

  function handlePageChange(
    _: MouseEvent<HTMLButtonElement> | null,
    page: number
  ): void {
    console.log(page)
  }

  if (sourceFields.error) {
    return sourceFields.error.toString()
  } else if (!sourceFields.data) {
    return null
  }

  return (
    <>
      <PageTile title={t('page.title')}>
        <PrimaryButton>{t('action.import')} (xlsx)</PrimaryButton>
      </PageTile>
      <FiltersGuesser apiData={sourceFields.data} resource={resource} />
      <TableGuesser
        apiData={sourceFields.data}
        onPageChange={handlePageChange}
        resource={resource}
      />
    </>
  )
}

export default Attributes
