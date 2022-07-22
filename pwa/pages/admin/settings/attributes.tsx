import { MouseEvent } from 'react'
import { useTranslation } from 'next-i18next'

import { IHydraResponse, ISourceField } from '~/types'

import { useApiFetch } from '~/hooks'

import PageTile from '~/components/atoms/PageTitle/PageTitle'
import PrimaryButton from '~/components/atoms/buttons/PrimaryButton'

import FiltersGuesser from '~/components/stateful/FiltersGuesser/FiltersGuesser'
import TableGuesser from '~/components/stateful/TableGuesser/TableGuesser'

function Attributes(): JSX.Element | string {
  const [sourceFields] =
    useApiFetch<IHydraResponse<ISourceField>>('/source_fields')
  const { t } = useTranslation('attributes')

  const api = '/source_fields'

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
      <FiltersGuesser api={api} apiData={sourceFields.data} />
      <TableGuesser
        api={api}
        apiData={sourceFields.data}
        onPageChange={handlePageChange}
      />
    </>
  )
}

export default Attributes
