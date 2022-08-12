import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

import { breadcrumbContext } from '~/contexts'
import { withAuth } from '~/hocs'
import { useApiList, useResource } from '~/hooks'
import { findBreadcrumbLabel, findDefaultCatalog } from '~/services'
import { selectMenu, useAppSelector } from '~/store'
import { ICatalog, ITreeItem } from '~/types'

import TitleBlock from '~/components/molecules/layout/TitleBlock/TitleBlock'
import TwoColsLayout from '~/components/molecules/layout/twoColsLayout/TwoColsLayout'
import CatalogSwitcher from '~/components/stateful/CatalogSwitcher/CatalogSwitcher'
import CategoryTree from '~/components/stateful/CategoryTree/CategoryTree'
import ProductsContainer from '~/components/stateful/ProductsContainer/ProductsContainer'

function Categories(): JSX.Element {
  const router = useRouter()
  const menu = useAppSelector(selectMenu)
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  const [selectedCategoryItem, setSelectedCategoryItem] = useState<
    ITreeItem | undefined
  >({} as ITreeItem)

  const resourceName = 'Catalog'
  const resource = useResource(resourceName)
  const [catalogsFields] = useApiList<ICatalog>(resource, false)
  const { data, error } = catalogsFields

  const defaultCatalog = findDefaultCatalog(data ? data['hydra:member'] : null)

  const [selectedCatalogId, setSelectedCatalogId] = useState<string | number>(
    defaultCatalog?.id
  )
  const [selectedLocalizedCatalogId, setSelectedLocalizedCatalogId] = useState<
    string | number
  >(defaultCatalog?.localizedCatalogs[0].id)

  useEffect(() => {
    setBreadcrumb(['merchandize', 'categories'])
  }, [router.query, setBreadcrumb])

  const title = findBreadcrumbLabel(0, ['merchandize'], menu.hierarchy)

  const { t } = useTranslation('categories')

  function handleSelect(item: ITreeItem): void {
    setSelectedCategoryItem(item)
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <TwoColsLayout
        left={[
          <TitleBlock key="categories" title={t('categories.title')}>
            <>
              <CatalogSwitcher
                catalog={selectedCatalogId}
                onCatalog={setSelectedCatalogId}
                localizedCatalog={selectedLocalizedCatalogId}
                onLocalizedCatalog={setSelectedLocalizedCatalogId}
                catalogsData={data}
                error={error}
                defaultCatalogId={defaultCatalog ? defaultCatalog.id : ' '}
                onCategory={handleSelect}
              />
              <CategoryTree
                catalog={selectedCatalogId}
                localizedCatalog={selectedLocalizedCatalogId}
                selectedItem={selectedCategoryItem}
                onSelect={handleSelect}
              />
            </>
          </TitleBlock>,
          <TitleBlock key="virtualRule" title={t('virtualRule.title')}>
            Virtual rule DATA
          </TitleBlock>,
        ]}
      >
        <ProductsContainer category={selectedCategoryItem} />
      </TwoColsLayout>
    </>
  )
}

export default withAuth(Categories)
