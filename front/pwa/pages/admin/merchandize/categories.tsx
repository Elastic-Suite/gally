import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box } from '@mui/system'
import debounce from 'lodash.debounce'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
import {
  ICategories,
  ICategory,
  ICategoryConfiguration,
  IHydraCatalog,
  IParsedCategoryConfiguration,
  IProductFieldFilterInput,
  IRuleCombination,
  IRuleEngineGraphqlFilters,
  IRuleEngineOperators,
  LoadStatus,
  findBreadcrumbLabel,
  isError,
  parseCatConf,
  serializeCatConf,
  serializeRule,
} from 'shared'

import { breadcrumbContext } from '~/contexts'
import { withAuth, withOptions } from '~/hocs'
import {
  useApiFetch,
  useApiList,
  useFetchApi,
  useResource,
  useResourceOperations,
} from '~/hooks'
import { findCategory } from '~/services'
import { selectMenu, useAppSelector } from '~/store'

import TitleBlock from '~/components/molecules/layout/TitleBlock/TitleBlock'
import TwoColsLayout from '~/components/molecules/layout/twoColsLayout/TwoColsLayout'
import CatalogSwitcher from '~/components/stateful/CatalogSwitcher/CatalogSwitcher'
import CategoryTree from '~/components/stateful/CategoryTree/CategoryTree'
import ProductsContainer from '~/components/stateful/ProductsContainer/ProductsContainer'
import RulesManager from '~/components/stateful/RulesManager/RulesManager'

const debounceDelay = 200

function Categories(): JSX.Element {
  const router = useRouter()
  const fetchApi = useApiFetch()
  const { t } = useTranslation('categories')
  const [isSaving, setIsSaving] = useState(false)

  // Breadcrumb
  const menu = useAppSelector(selectMenu)
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const title = findBreadcrumbLabel(0, ['merchandize'], menu.hierarchy)
  useEffect(() => {
    setBreadcrumb(['merchandize', 'categories'])
  }, [router.query, setBreadcrumb])

  // Catalogs
  const resourceName = 'Catalog'
  const resource = useResource(resourceName)
  const [catalogsFields] = useApiList<IHydraCatalog>(resource, false)
  const { data, error } = catalogsFields
  const [catalogId, setCatalogId] = useState<number>(-1)
  const [localizedCatalogId, setLocalizedCatalogId] = useState<number>(-1)

  // Rule engine operators
  const [ruleOperators, setRuleOperators] = useState<IRuleEngineOperators>()
  useEffect(() => {
    fetchApi<IRuleEngineOperators>('rule_engine_operators').then((json) => {
      if (!isError(json)) {
        setRuleOperators(json)
      }
    })
  }, [fetchApi])

  // Categories
  const [selectedCategoryItem, setSelectedCategoryItem] = useState<ICategory>()
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
  useEffect(() => {
    if (categories.status !== LoadStatus.SUCCEEDED) {
      return
    }
    setSelectedCategoryItem((prevState) => {
      if (!categories.data.categories[0]) {
        return undefined
      }
      if (prevState === undefined) {
        return categories.data.categories[0]
      }
      const cat = findCategory(prevState, categories.data.categories)
      return cat
    })
  }, [categories])

  // Category configuration
  const catConfResource = useResource('CategoryConfiguration')
  const [catConf, setCatConf] = useState<IParsedCategoryConfiguration>()
  const prevCatConf = useRef<IParsedCategoryConfiguration>()
  const { update, create } =
    useResourceOperations<ICategoryConfiguration>(catConfResource)
  useEffect(() => {
    if (ruleOperators && selectedCategoryItem) {
      fetchApi<ICategoryConfiguration>(
        `${catConfResource.url}/category/${selectedCategoryItem.id}`,
        filters
      ).then((catConf) => {
        if (!isError(catConf)) {
          const parsedCatConf = parseCatConf(catConf, ruleOperators)
          prevCatConf.current = parsedCatConf
          setCatConf(parsedCatConf)
        }
      })
    }
  }, [
    fetchApi,
    filters,
    ruleOperators,
    selectedCategoryItem,
    catConfResource.url,
  ])

  // Rule engine graphql filters
  const [ruleEngineGraphqlFilters, setRuleEngineGraphqlFilters] =
    useState<IProductFieldFilterInput>(null)
  const debouncedFetch = useMemo(
    () =>
      debounce(async (rule: string): Promise<void> => {
        const json = await fetchApi<IRuleEngineGraphqlFilters>(
          'rule_engine_graphql_filters',
          undefined,
          { body: JSON.stringify({ rule }), method: 'POST' }
        )
        if (!isError(json)) {
          setRuleEngineGraphqlFilters(json.graphQlFilters)
        }
      }, debounceDelay),
    [fetchApi]
  )
  useEffect(() => {
    if (catConf?.virtualRule) {
      debouncedFetch(
        JSON.stringify(serializeRule(catConf.virtualRule, ruleOperators))
      )
    }
  }, [catConf?.virtualRule, debouncedFetch, ruleOperators])
  const productGraphqlFilters: IProductFieldFilterInput = useMemo(() => {
    if (catConf?.isVirtual && ruleEngineGraphqlFilters) {
      return ruleEngineGraphqlFilters
    } else if (!catConf?.isVirtual && selectedCategoryItem) {
      return { category__id: { eq: selectedCategoryItem.id } }
    }
    return {}
  }, [catConf, ruleEngineGraphqlFilters, selectedCategoryItem])

  function handleUpdateCat(name: string): (val: boolean | string) => void {
    return (val) => {
      setCatConf((catConf) => ({ ...catConf, [name]: val }))
    }
  }

  function handleUpdateRule(rule: IRuleCombination): void {
    setCatConf((catConf) => ({ ...catConf, virtualRule: rule }))
  }

  async function onSave(): Promise<void> {
    setIsSaving(true)
    const serializedCatConf = serializeCatConf(catConf, ruleOperators)
    if (!catConf.id) {
      delete serializedCatConf['@id']
      const newCatConf = await create(serializedCatConf)
      if (!isError(newCatConf)) {
        const parsedCatConf = parseCatConf(newCatConf, ruleOperators)
        prevCatConf.current = parsedCatConf
        setCatConf(parsedCatConf)
        enqueueSnackbar(t('alert'), {
          onShut: closeSnackbar,
          variant: 'success',
        })
      } else {
        enqueueSnackbar(t('alert.error'), {
          onShut: closeSnackbar,
          variant: 'error',
        })
      }
    } else {
      const newCatConf = await update(serializedCatConf.id, serializedCatConf)
      if (!isError(newCatConf)) {
        const parsedCatConf = parseCatConf(newCatConf, ruleOperators)
        prevCatConf.current = parsedCatConf
        setCatConf(parsedCatConf)
        enqueueSnackbar(t('alert'), {
          onShut: closeSnackbar,
          variant: 'success',
        })
      } else {
        enqueueSnackbar(t('alert.error'), {
          onShut: closeSnackbar,
          variant: 'error',
        })
      }
    }
    setIsSaving(false)
  }

  const dirty = prevCatConf.current
    ? Object.entries(catConf ?? {}).some(
        ([key, val]: [key: keyof typeof catConf, val: string | boolean]) =>
          !(
            prevCatConf.current[key] === undefined ||
            prevCatConf.current[key] === val
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
          Boolean(catConf?.id && catConf?.isVirtual) && (
            <TitleBlock key="virtualRule" title={t('virtualRule.title')}>
              <RulesManager
                catalogId={catalogId}
                localizedCatalogId={localizedCatalogId}
                onChange={handleUpdateRule}
                rule={catConf.virtualRule}
                ruleOperators={ruleOperators}
              />
            </TitleBlock>
          ),
        ]}
      >
        {selectedCategoryItem?.id &&
        catConf &&
        (!catConf?.virtualRule || productGraphqlFilters) ? (
          <ProductsContainer
            catConf={catConf}
            catalog={catalogId}
            catalogsData={data}
            category={selectedCategoryItem}
            disableBtnSave={!dirty}
            error={error}
            isSaving={isSaving}
            localizedCatalog={localizedCatalogId}
            onNameChange={handleUpdateCat('useNameInProductSearch')}
            onSave={onSave}
            onSortChange={handleUpdateCat('defaultSorting')}
            onVirtualChange={handleUpdateCat('isVirtual')}
            productGraphqlFilters={productGraphqlFilters}
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
