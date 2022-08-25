import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

import { breadcrumbContext } from '~/contexts'
import { withAuth } from '~/hocs'
import { useFilters, usePage, useResource, useSearch } from '~/hooks'
import { firstLetterUppercase } from '~/services'
import { searchableAttributeUrl } from '~/constants'

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

  const resourceName = 'SourceField'
  const resource = useResource(resourceName)
  const [page, setPage] = usePage()
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const [searchValue, setSearchValue] = useSearch()

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageTitle title={firstLetterUppercase(title.pop())} />
      <CommonGridFromSourceField
        page={page}
        setPage={setPage}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        resource={resource}
        url={searchableAttributeUrl}
      />
    </>
  )
}

export default withAuth(Attributes)
