import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

import { useTranslation } from 'next-i18next'
import { breadcrumbContext } from '~/contexts'
import { withAuth } from '~/hocs'
import { useFetchApi } from '~/hooks'

import TitleBlock from '~/components/molecules/layout/TitleBlock/TitleBlock'
import TwoColsLayout from '~/components/molecules/layout/twoColsLayout/TwoColsLayout'
import CategoryTree from '~/components/stateful/CategoryTree/CategoryTree'

import { ICategories, ICategory } from '~/../shared'
import ResourceTable from '~/components/stateful-pages/ResourceTable/ResourceTable'

const pagesSlug = ['search', 'facets']

function Facets(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { t } = useTranslation('facets')
  const [selectedCategoryItem, setSelectedCategoryItem] = useState<ICategory>()

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const title = pagesSlug.slice(-1).flat()

  const [categories] = useFetchApi<ICategories>(`categoryTree`)

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <TwoColsLayout
        left={[
          <TitleBlock key="title" title={t('categories')}>
            {t('categories')}
          </TitleBlock>,
          <TitleBlock key="configuration" title={t('configuration')}>
            TODO : Set default values here
          </TitleBlock>,
          <TitleBlock key="categories" title={t('byCategory')}>
            <CategoryTree
              categories={categories.data}
              selectedItem={selectedCategoryItem}
              onSelect={setSelectedCategoryItem}
            />
          </TitleBlock>,
        ]}
      >
        <ResourceTable resourceName="FacetConfiguration" />
      </TwoColsLayout>
    </>
  )
}

export default withAuth(Facets)
