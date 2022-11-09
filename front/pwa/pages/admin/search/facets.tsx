import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ICategories, ICategory, LoadStatus } from 'shared'
import { styled } from '@mui/system'

import { breadcrumbContext } from '~/contexts'
import { withAuth, withOptions } from '~/hocs'
import { useFetchApi, useFilters, useResource } from '~/hooks'

import TitleBlock from '~/components/molecules/layout/TitleBlock/TitleBlock'
import TwoColsLayout from '~/components/molecules/layout/twoColsLayout/TwoColsLayout'
import CategoryTree from '~/components/stateful/CategoryTree/CategoryTree'

import ResourceTable from '~/components/stateful-pages/ResourceTable/ResourceTable'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import PageTitle from '~/components/atoms/PageTitle/PageTitle'
import Alert from '~/components/atoms/Alert/Alert'

const pagesSlug = ['search', 'facets']

const ButtonSetting = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  gap: '5px',
  '&:hover': {
    color: theme.palette.colors.secondary[600],
    textDecoration: 'underline',
  },
}))

const IonIconStyle = styled(IonIcon)(() => ({
  width: '30px',
  fontSize: '20px',
}))

const FontSetting = styled('div')(() => ({
  fontWeight: 500,
  fontFamily: 'Inter',
  lineHeight: '18px',
  fontSize: '12px',
}))

function Facets(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { t } = useTranslation('facet')
  const [selectedCategoryItem, setSelectedCategoryItem] = useState<ICategory>()

  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  const title = pagesSlug.slice(-1).flat()

  const [categories] = useFetchApi<ICategories>(`categoryTree`)

  const hasFacets = selectedCategoryItem?.name
    ? selectedCategoryItem?.name
    : selectedCategoryItem?.catalogName
  const [isVisibleAlertFacets, setIsVisibleAlertFacets] = useState(true)

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
    })
  }, [categories])

  const resource = useResource('FacetConfiguration')
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const filters = useMemo(
    () => ({ category: selectedCategoryItem?.id }),
    [selectedCategoryItem?.id]
  )

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <TwoColsLayout
        left={[
          <TitleBlock key="title" title={t('facet.title')} />,
          <TitleBlock
            hasSubTitle
            borderBottom={false}
            key="configuration"
            title={t('facet.configuration')}
          >
            <ButtonSetting
              onClick={(): void => setSelectedCategoryItem(undefined)}
            >
              <IonIconStyle name="settings" />
              <FontSetting>{t('facet.button.setting')}</FontSetting>
            </ButtonSetting>
          </TitleBlock>,
          <TitleBlock
            borderBottom={false}
            hasSubTitle
            key="categories"
            title={t('facet.byCategory')}
          >
            <CategoryTree
              categories={categories.data}
              selectedItem={selectedCategoryItem}
              onSelect={setSelectedCategoryItem}
            />
          </TitleBlock>,
        ]}
      >
        <PageTitle
          title={hasFacets ? hasFacets : t('facets')}
          sx={{ marginBottom: '32px' }}
        />
        {Boolean(isVisibleAlertFacets) && (
          <Alert
            message={t('facet.alert')}
            onShut={(): void => setIsVisibleAlertFacets(false)}
            style={{ marginBottom: '16px' }}
          />
        )}
        <ResourceTable
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          filters={filters}
          resourceName="FacetConfiguration"
          diffDefaultValues
          isFacets
        />
      </TwoColsLayout>
    </>
  )
}

export default withAuth(withOptions(Facets))
