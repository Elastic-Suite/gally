import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useContext, useEffect, useState } from 'react'

import { breadcrumbContext } from '~/contexts'
import { withAuth } from '~/hocs'
import { searchableAttributeUrl } from 'shared'

import Alert from '~/components/atoms/Alert/Alert'
import PageTitle from '~/components/atoms/PageTitle/PageTitle'
import ResourceTable from '~/components/stateful-pages/ResourceTable/ResourceTable'

const pagesSlug = ['search', 'configuration', 'attributes']
const fixedFilters = { 'metadata.entity': 'product' }

function Attributes(): JSX.Element {
  const [visibleAlertAttributes, setVisibleAlertAttributes] = useState(true)

  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const { t } = useTranslation('attributes')

  const title = t(pagesSlug.slice(-1).flat().pop())

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageTitle title={title} />
      {visibleAlertAttributes ? (
        <Alert
          message={t('attributes.alert')}
          onClose={(): void => setVisibleAlertAttributes(false)}
          style={{ marginBottom: '16px' }}
        />
      ) : null}
      <ResourceTable
        resourceName='SourceField'
        active={false}
        urlParams={searchableAttributeUrl}
        filters={fixedFilters}
      />
    </>
  )
}

export default withAuth(Attributes)
