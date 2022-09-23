import { useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box } from '@mui/system'

import { breadcrumbContext } from '~/contexts'
import { withAuth } from '~/hocs'
import {
  useApiFetch,
  useApiList,
  useFetchApi,
  useResource,
  useResourceOperations,
} from '~/hooks'
import { selectMenu, useAppSelector } from '~/store'
import {
  ICategories,
  ICategory,
  IHydraCatalog,
  emptyCombinationRule,
  findBreadcrumbLabel,
  isFetchError,
} from 'shared'

import TitleBlock from '~/components/molecules/layout/TitleBlock/TitleBlock'
import TwoColsLayout from '~/components/molecules/layout/twoColsLayout/TwoColsLayout'
import CatalogSwitcher from '~/components/stateful/CatalogSwitcher/CatalogSwitcher'
import CategoryTree from '~/components/stateful/CategoryTree/CategoryTree'
import ProductsContainer, {
  IConfiguration,
} from '~/components/stateful/ProductsContainer/ProductsContainer'
import RulesManager from '~/components/stateful/RulesManager/RulesManager'

function Categories(): JSX.Element {
  const router = useRouter()
  const menu = useAppSelector(selectMenu)
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  const [selectedCategoryItem, setSelectedCategoryItem] = useState<ICategory>()

  const resourceName = 'Catalog'
  const resource = useResource(resourceName)
  const [catalogsFields] = useApiList<IHydraCatalog>(resource, false)
  const { data, error } = catalogsFields

  const [catalogId, setCatalogId] = useState<number>(-1)
  const [localizedCatalogId, setLocalizedCatalogId] = useState<number>(-1)
  const [rule, setRule] = useState(emptyCombinationRule)

  useEffect(() => {
    setBreadcrumb(['merchandize', 'categories'])
  }, [router.query, setBreadcrumb])

  const title = findBreadcrumbLabel(0, ['merchandize'], menu.hierarchy)

  const { t } = useTranslation('categories')

  const [categories] = useFetchApi<ICategories>(
    `categoryTree?/&catalogId=${
      catalogId !== -1 ? catalogId : null
    }&localizedCatalogId=${
      localizedCatalogId !== -1 ? localizedCatalogId : null
    }`
  )

  const categoryConfigurationResource = useResource('CategoryConfiguration')

  const fetchApi = useApiFetch<IConfiguration>()
  const [dataCat, setDataCat] = useState<IConfiguration>()
  const prevDataCat = useRef<IConfiguration>()

  useEffect(() => {
    if (selectedCategoryItem) {
      fetchApi(
        `${categoryConfigurationResource.url}/category/${selectedCategoryItem.id}`
      ).then((dataCat) => {
        if (!isFetchError(dataCat)) {
          prevDataCat.current = dataCat
          setDataCat(dataCat)
        }
      })
    }
  }, [fetchApi, selectedCategoryItem, categoryConfigurationResource.url])

  const { update, create } = useResourceOperations<IConfiguration>(
    categoryConfigurationResource
  )

  function handleUpdateCat(name: string): (val: boolean | string) => void {
    return (val) => {
      if (catalogId !== -1 && localizedCatalogId !== -1) {
        setDataCat((el) => ({ ...el, [name]: val }))
      }
    }
  }

  const dispatch = useAppDispatch()

  async function onSave(): Promise<void> {
    if (!dataCat.id) {
      const val = await create(dataCat)
      if (!isFetchError(val)) {
        prevDataCat.current = val
        setDataCat(val)
        dispatch(addMessage(t('alert')))
      } else {
        dispatch(addMessage(t('alert.error')))
      }
    } else {
      const val = await update(dataCat.id, dataCat)
      if (!isFetchError(val)) {
        prevDataCat.current = val
        setDataCat(val)
        dispatch(addMessage(t('alert')))
      } else {
        dispatch(addMessage(t('alert.error')))
      }
    }
  }

  const dirty = prevDataCat.current
    ? Object.entries(dataCat ?? {}).some(
        ([key, val]: [key: keyof typeof dataCat, val: string | boolean]) =>
          !(
            prevDataCat.current[key] === undefined ||
            prevDataCat.current[key] === val
          )
      )
    : false

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
                categories={categories.data}
                selectedItem={selectedCategoryItem}
                onSelect={setSelectedCategoryItem}
              />
            </>
          </TitleBlock>,
          <TitleBlock key="virtualRule" title={t('virtualRule.title')}>
            <RulesManager
              catalogId={catalogId}
              localizedCatalogId={localizedCatalogId}
              onChange={setRule}
              rule={rule}
            />
          </TitleBlock>,
        ]}
      >
        {selectedCategoryItem?.id ? (
          <ProductsContainer
            category={selectedCategoryItem}
            dataCat={dataCat}
            onVirtualChange={handleUpdateCat('isVirtual')}
            onNameChange={handleUpdateCat('useNameInProductSearch')}
            onSortChange={handleUpdateCat('defaultSorting')}
            catalog={catalogId}
            localizedCatalog={localizedCatalogId}
            catalogsData={data}
            error={error}
            onSave={onSave}
            disableBtnSave={!dirty}
          />
        ) : (
          <Box
            sx={{
              fontSize: '12px',
              fontFamily: 'inter',
              lineHeight: '18px',
              padding: '16px 0  0 16px',
              color: 'colors.neutral.600',
            }}
          >
            {t('placeholder')}
          </Box>
        )}
      </TwoColsLayout>
    </>
  )
}

export default withAuth(Categories)
