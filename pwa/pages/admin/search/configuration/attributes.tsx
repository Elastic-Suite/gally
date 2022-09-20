import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useContext, useEffect } from 'react'

import { searchableAttributeUrl } from '~/constants'
import { breadcrumbContext } from '~/contexts'
import { withAuth } from '~/hocs'

import PageTitle from '~/components/atoms/PageTitle/PageTitle'
import CommonGridFromSourceField from '~/components/stateful-pages/CommonGridFromSourceField/CommonGridFromSourceField'

const pagesSlug = ['search', 'configuration', 'attributes']
const fixedFilters = { 'metadata.entity': 'product' }

function Attributes(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const { t } = useTranslation('common')

  const title = t(pagesSlug.slice(-1).flat().pop())

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageTitle title={title} />
      <CommonGridFromSourceField
        active={false}
        urlParams={searchableAttributeUrl}
        filters={fixedFilters}
      />
    </>
  )
}

export default withAuth(Attributes)
