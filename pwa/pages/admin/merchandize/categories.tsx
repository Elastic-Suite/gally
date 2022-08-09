import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

import { breadcrumbContext } from '~/contexts'
import { withAuth } from '~/hocs'
import {
  useApiList,
  useFetchApi,
  useResource,
  useResourceOperations,
} from '~/hooks'
import { findBreadcrumbLabel } from '~/services'
import { selectMenu, useAppSelector } from '~/store'
import { ICatalog, ICategories, ITreeItem } from '~/types'

import VirtualRule from '~/components/molecules/layout/fade/VirtualRule'
import TitleBlock from '~/components/molecules/layout/TitleBlock/TitleBlock'
import TwoColsLayout from '~/components/molecules/layout/twoColsLayout/TwoColsLayout'
import CatalogSwitcher from '~/components/stateful/CatalogSwitcher/CatalogSwitcher'
import CategoryTree from '~/components/stateful/CategoryTree/CategoryTree'
import ProductsContainer, {
  IConfiguration,
} from '~/components/stateful/ProductsContainer/ProductsContainer'

function Categories(): JSX.Element {
  const router = useRouter()
  const menu = useAppSelector(selectMenu)
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  const [selectedCategoryItem, setSelectedCategoryItem] = useState<ITreeItem>(
    {}
  )

  const resourceName = 'Catalog'
  const resource = useResource(resourceName)
  const [catalogsFields] = useApiList<ICatalog>(resource, false)
  const { data, error } = catalogsFields

  const [catalogId, setCatalogId] = useState<number>(-1)
  const [localizedCatalogId, setLocalizedCatalogId] = useState<number>(-1)

  useEffect(() => {
    setBreadcrumb(['merchandize', 'categories'])
  }, [router.query, setBreadcrumb])

  const title = findBreadcrumbLabel(0, ['merchandize'], menu.hierarchy)

  const { t } = useTranslation('categories')

  const [categoryTreeFields] = useFetchApi<ICategories>(
    `categoryTree?/&catalogId=${
      catalogId !== -1 ? catalogId : null
    }&localizedCatalogId=${
      localizedCatalogId !== -1 ? localizedCatalogId : null
    }`
  )

  const paramsCategory = `https://localhost/category_configurations/category/one?catalogId=${catalogId}&localizedCatalogId=${localizedCatalogId}`
  const [dataCat, updateDataCat] = useFetchApi<IConfiguration>(paramsCategory)

  const idCat = dataCat?.data?.id

  const configuration = useResource('CategoryConfiguration')
  const { update } = useResourceOperations<IConfiguration>(configuration)

  function handleUpdateCat(
    name: string
  ): (val: boolean | string) => Promise<void> {
    return async function (val: boolean | string): Promise<void> {
      await update(idCat, { [name]: val })

      updateDataCat((categ) => {
        return {
          ...categ,
          [name]: val,
        }
      })
    }
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
                catalog={catalogId}
                onCatalog={setCatalogId}
                localizedCatalog={localizedCatalogId}
                onLocalizedCatalog={setLocalizedCatalogId}
                catalogsData={data}
                error={error}
                onCategory={setSelectedCategoryItem}
              />
              <CategoryTree
                categoryTreeFields={categoryTreeFields}
                selectedItem={selectedCategoryItem}
                onSelect={setSelectedCategoryItem}
              />
            </>
          </TitleBlock>,
          <TitleBlock key="virtualRule" title={t('virtualRule.title')}>
            <VirtualRule val={dataCat?.data?.isVirtual}>
              Virtual rule DATA
            </VirtualRule>
          </TitleBlock>,
        ]}
      >
        <ProductsContainer
          category={selectedCategoryItem}
          dataCat={dataCat.data}
          onVirtualChange={handleUpdateCat('isVirtual')}
          onNameChange={handleUpdateCat('useNameInProductSearch')}
          onSortChange={handleUpdateCat('defaultSorting')}
          catalogId={catalogId}
        />
      </TwoColsLayout>
    </>
  )
}

export default withAuth(Categories)
