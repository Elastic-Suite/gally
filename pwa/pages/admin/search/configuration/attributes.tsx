import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

import { searchableAttributeUrl } from '~/constants'
import { breadcrumbContext } from '~/contexts'
import { withAuth } from '~/hocs'
import { firstLetterUppercase } from '~/services'

import PageTitle from '~/components/atoms/PageTitle/PageTitle'
import CommonGridFromSourceField from '~/components/stateful-pages/CommonGridFromSourceField/CommonGridFromSourceField'

const pagesSlug = ['search', 'configuration', 'attributes']

function Attributes(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const title = pagesSlug.slice(-1).flat()

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageTitle title={firstLetterUppercase(title.pop())} />
      <CommonGridFromSourceField urlParams={`${searchableAttributeUrl}`} />
    </>
  )
}

export default withAuth(Attributes)
