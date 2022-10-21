import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box } from '@mui/system'

import { breadcrumbContext } from '~/contexts'
import { withAuth, withOptions } from '~/hocs'
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
  IRuleCombination,
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
  IParsedConfiguration,
} from '~/components/stateful/ProductsContainer/ProductsContainer'
import RulesManager from '~/components/stateful/RulesManager/RulesManager'

function getParsedCatConf(catConf: IConfiguration): IParsedConfiguration {
  let virtualRule: IRuleCombination
  try {
    virtualRule = JSON.parse(catConf.virtualRule)
  } catch {
    virtualRule = emptyCombinationRule
  }
  return { ...catConf, virtualRule }
}

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

  useEffect(() => {
    setBreadcrumb(['merchandize', 'categories'])
  }, [router.query, setBreadcrumb])

  const title = findBreadcrumbLabel(0, ['merchandize'], menu.hierarchy)

  const { t } = useTranslation('categories')

  const filters = useMemo(() => {
    const filters: { catalogId?: number; localizedCatalogId?: number } = {}
    if (catalogId !== -1) {
      filters.catalogId = catalogId
    }
    if (localizedCatalogId !== -1) {
      filters.localizedCatalogId = localizedCatalogId
    }
    return filters
  }, [catalogId, localizedCatalogId])
  const [categories] = useFetchApi<ICategories>(`categoryTree`, filters)

  const catConfResource = useResource('CategoryConfiguration')

  const fetchApi = useApiFetch<IConfiguration>()
  const [catConf, setCatConf] = useState<IParsedConfiguration>()
  const prevDataCat = useRef<IParsedConfiguration>()

  useEffect(() => {
    if (selectedCategoryItem) {
      fetchApi(
        `${catConfResource.url}/category/${selectedCategoryItem.id}`
      ).then((catConf) => {
        if (!isError(catConf)) {
          const parsedCatConf = getParsedCatConf(catConf)
          prevDataCat.current = parsedCatConf
          setCatConf(parsedCatConf)
        }
      })
    }
  }, [fetchApi, selectedCategoryItem, catConfResource.url])

  const { update, create } =
    useResourceOperations<IConfiguration>(catConfResource)

  function handleUpdateCat(name: string): (val: boolean | string) => void {
    return (val) => {
      setCatConf((catConf) => ({ ...catConf, [name]: val }))
    }
  }

  function handleUpdateRule(rule: IRuleCombination): void {
    setCatConf((catConf) => ({ ...catConf, virtualRule: rule }))
  }

  const dispatch = useAppDispatch()

  async function onSave(): Promise<void> {
    const apiCatConf = {
      ...catConf,
      virtualRule: JSON.stringify(catConf.virtualRule),
    }
    if (!catConf.id) {
      const newCatConf = await create(apiCatConf)
      if (!isError(newCatConf)) {
        const parsedCatConf = getParsedCatConf(newCatConf)
        prevDataCat.current = parsedCatConf
        setCatConf(parsedCatConf)
        dispatch(addMessage({ message: t('alert'), severity: 'success' }))
      } else {
        dispatch(addMessage({ message: t('alert.error'), severity: 'error' }))
      }
    } else {
      const newCatConf = await update(apiCatConf.id, apiCatConf)
      if (!isError(newCatConf)) {
        const parsedCatConf = getParsedCatConf(newCatConf)
        prevDataCat.current = parsedCatConf
        setCatConf(parsedCatConf)
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
    ? Object.entries(catConf ?? {}).some(
        ([key, val]: [key: keyof typeof catConf, val: string | boolean]) =>
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
            {Boolean(catConf?.id && catConf?.isVirtual) && (
              <RulesManager
                catalogId={catalogId}
                localizedCatalogId={localizedCatalogId}
                onChange={handleUpdateRule}
                rule={catConf.virtualRule}
              />
            )}
          </TitleBlock>,
        ]}
      >
        {selectedCategoryItem?.id ? (
          <ProductsContainer
            category={selectedCategoryItem}
            catConf={catConf}
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

export default withAuth(withOptions(Categories))
