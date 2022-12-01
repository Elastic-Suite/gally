import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useContext, useEffect, useState } from 'react'
import { searchableAttributeUrl } from 'shared'

import { breadcrumbContext } from '~/contexts'
import { withAuth, withOptions } from '~/hocs'
import { useFilters, useResource } from '~/hooks'

import Alert from '~/components/atoms/Alert/Alert'
import PageTitle from '~/components/atoms/PageTitle/PageTitle'
import ResourceTable from '~/components/stateful-pages/ResourceTable/ResourceTable'

const pagesSlug = ['search', 'configuration', 'attributes']
const fixedFilters = { 'metadata.entity': 'product' }

function Attributes(): JSX.Element {
  const [isVisibleAlertAttributes, setIsVisibleAlertAttributes] = useState(true)

  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const { t } = useTranslation('attributes')

  const title = t(pagesSlug.slice(-1).flat().pop())

  const resource = useResource('SourceField')
  const [activeFilters, setActiveFilters] = useFilters(resource)

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageTitle title={title} sx={{ marginBottom: '32px' }} />
      {Boolean(isVisibleAlertAttributes) && (
        <Alert
          message={t('attributes.alert')}
          onShut={(): void => setIsVisibleAlertAttributes(false)}
          style={{ marginBottom: '16px' }}
        />
      )}
      <ResourceTable
        activeFilters={activeFilters}
        filters={fixedFilters}
        resourceName="SourceField"
        setActiveFilters={setActiveFilters}
        urlParams={searchableAttributeUrl}
      />
    </>
  )
}

export default withAuth(withOptions(Attributes))
