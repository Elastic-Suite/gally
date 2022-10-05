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
import { addMessage, selectMenu, useAppDispatch, useAppSelector } from '~/store'
import {
  ICategories,
  ICategory,
  IHydraCatalog,
  LoadStatus,
  emptyCombinationRule,
  findBreadcrumbLabel,
  isError,
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

  const [categories] = useFetchApi<ICategories>(`categoryTree`)

  const categoryConfigurationResource = useResource('CategoryConfiguration')

  const fetchApi = useApiFetch<IConfiguration>()
  const [dataCat, setDataCat] = useState<IConfiguration>()
  const prevDataCat = useRef<IConfiguration>()

  useEffect(() => {
    if (selectedCategoryItem) {
      fetchApi(
        `${categoryConfigurationResource.url}/category/${selectedCategoryItem.id}`
      ).then((dataCat) => {
        if (!isError(dataCat)) {
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
      setDataCat((el) => ({ ...el, [name]: val }))
    }
  }

  const dispatch = useAppDispatch()

  async function onSave(): Promise<void> {
    if (!dataCat.id) {
      const val = await create(dataCat)
      if (!isError(val)) {
        prevDataCat.current = val
        setDataCat(val)
        dispatch(addMessage({ message: t('alert'), severity: 'success' }))
      } else {
        dispatch(addMessage({ message: t('alert.error'), severity: 'error' }))
      }
    } else {
      const val = await update(dataCat.id, dataCat)
      if (!isError(val)) {
        prevDataCat.current = val
        setDataCat(val)
        dispatch(addMessage({ message: t('alert'), severity: 'success' }))
      } else {
        dispatch(addMessage({ message: t('alert.error'), severity: 'error' }))
      }
    }
  }

  function findCategory(
    selectedCategoryItem: ICategory,
    categories: ICategory[]
  ): ICategory {
    const sameCateInOtherCatalog = categories.find((element: ICategory) => {
      return element.id === selectedCategoryItem.id
        ? element
        : element.children &&
            findCategory(selectedCategoryItem, element.children)
    })

    return sameCateInOtherCatalog
  }

  useEffect(() => {
    if (categories.status !== LoadStatus.SUCCEEDED) {
      return
    }

    if (!categories.data.categories[0]) {
      return setSelectedCategoryItem(undefined)
    }

    if (selectedCategoryItem === undefined) {
      return setSelectedCategoryItem(categories.data.categories[0])
    }

    return setSelectedCategoryItem(
      findCategory(selectedCategoryItem, categories.data.categories)
    )
  }, [categories.status])

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
              />
              <CategoryTree
                categories={categories.data}
                selectedItem={selectedCategoryItem}
                onSelect={setSelectedCategoryItem}
              />
            </>
          </TitleBlock>,
          <TitleBlock key="virtualRule" title={t('virtualRule.title')}>
            {dataCat?.id && dataCat?.isVirtual ? (
              <RulesManager
                catalogId={catalogId}
                localizedCatalogId={localizedCatalogId}
                onChange={setRule}
                rule={rule}
              />
            ) : undefined}
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
