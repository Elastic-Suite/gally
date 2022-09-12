import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Box } from '@mui/system'
import { Fade } from '@mui/material'

import { emptyCombinationRule } from '~/constants'
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
import { ICatalog, ICategories, ICategory, ISearchParameters } from '~/types'

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
  const [catalogsFields] = useApiList<ICatalog>(resource, false)
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

  const categoryConfigurationParams: ISearchParameters = useMemo(
    () => ({
      categoryId: selectedCategoryItem ? selectedCategoryItem.id : null,
      catalogId: catalogId !== -1 ? catalogId : null,
      localizedCatalogId: localizedCatalogId !== -1 ? localizedCatalogId : null,
    }),
    [selectedCategoryItem, catalogId, localizedCatalogId]
  )
  const categoryConfigurationResource = useResource('CategoryConfiguration')
  const [dataCat, updateDataCat] = useFetchApi<IConfiguration>(
    categoryConfigurationResource,
    categoryConfigurationParams
  )

  const idCat = dataCat?.data?.id

  const configuration = useResource('CategoryConfiguration')
  const { update } = useResourceOperations<IConfiguration>(configuration)

  const [saveData, setSaveData] = useState({})

  function handleUpdateCat(name: string): (val: boolean | string) => void {
    return (val) => {
      if (catalogId !== -1 && localizedCatalogId !== -1) {
        setSaveData((state) => ({ ...state, [name]: val }))
        updateDataCat((categ) => {
          return {
            ...categ,
            [name]: val,
          }
        })
      }
    }
  }

  const [saveTest, setSaveTest] = useState({})

  useEffect(() => {
    if (
      localizedCatalogId !== -1 &&
      catalogId !== -1 &&
      !Object.entries(saveData).length
    )
      setSaveTest({
        useNameInProductSearch: dataCat?.data.useNameInProductSearch,
        isVirtual: dataCat?.data.isVirtual,
        defaultSorting: dataCat?.data.defaultSorting,
      })
  }, [dataCat.data])

  // console.log('save', saveTest)

  async function onSave(): Promise<void> {
    await update(idCat, saveData)
    setSaveData({})
  }

  function testBtnSaveDisabled(): boolean {
    if (
      Object.entries(saveTest).find(
        ([key, val]: [
          key: (keyof typeof saveTest)['string'],
          val: string | boolean
        ]) => {
          if (saveData[key] === undefined) return 0
          else if (saveData[key] === val) return 0
          return 1
        }
      )
    )
      return false
    return true
  }
  const disableBtnSave = testBtnSaveDisabled()

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
            <Fade in={dataCat?.data?.isVirtual}>
              <Box>
                <RulesManager
                  catalogId={catalogId}
                  localizedCatalogId={localizedCatalogId}
                  onChange={setRule}
                  rule={rule}
                />
              </Box>
            </Fade>
          </TitleBlock>,
        ]}
      >
        {selectedCategoryItem?.id ? (
           <ProductsContainer
           category={selectedCategoryItem}
           dataCat={dataCat.data}
           onVirtualChange={handleUpdateCat('isVirtual')}
           onNameChange={handleUpdateCat('useNameInProductSearch')}
           onSortChange={handleUpdateCat('defaultSorting')}
           catalog={catalogId}
           localizedCatalog={localizedCatalogId}
           catalogsData={data}
           error={error}
           onSave={onSave}
           disableBtnSave={disableBtnSave}
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
