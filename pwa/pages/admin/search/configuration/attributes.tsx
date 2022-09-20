import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useContext, useEffect, useState } from 'react'

import { searchableAttributeUrl } from '~/constants'
import { breadcrumbContext } from '~/contexts'
import { withAuth } from '~/hocs'
import Alert from '~/components/atoms/Alert/Alert'

import PageTitle from '~/components/atoms/PageTitle/PageTitle'
import CommonGridFromSourceField from '~/components/stateful-pages/CommonGridFromSourceField/CommonGridFromSourceField'

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
          message={t('attributesAlert')}
          onClose={(): void => setVisibleAlertAttributes(false)}
          style={{ marginBottom: '16px' }}
        />
      ) : null}
      <CommonGridFromSourceField
        active={false}
        urlParams={searchableAttributeUrl}
        filters={fixedFilters}
      />
    </>
  )
}

export default withAuth(Attributes)
