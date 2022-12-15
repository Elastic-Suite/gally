import { useRouter } from 'next/router'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ICategories, ICategory } from 'shared'
import { styled } from '@mui/system'
import classNames from 'classnames'

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

const ButtonSetting = styled('div')(({ theme }) => ({
  color: theme.palette.colors.neutral[900],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  gap: '5px',
  '&.selected': {
    color: theme.palette.colors.secondary[600],
    textDecoration: 'underline',
  },
}))

const IonIconStyle = styled(IonIcon)(() => ({
  width: '30px',
  fontSize: '20px',
}))

const DefaultButton = styled('button')(() => ({
  fontWeight: 500,
  fontFamily: 'Inter',
  lineHeight: '18px',
  fontSize: '12px',
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  color: 'inherit',
}))

const pagesSlug = ['search', 'facets']

function Facets(): JSX.Element {
  const router = useRouter()
  const [, setBreadcrumb] = useContext(breadcrumbContext)
  const { t } = useTranslation('facet')
  const [selectedCategoryItem, setSelectedCategoryItem] = useState<ICategory>()

  // Breadcrumb
  useEffect(() => {
    setBreadcrumb(pagesSlug)
  }, [router.query, setBreadcrumb])

  // Categories
  const [categories] = useFetchApi<ICategories>(`categoryTree`)

  // Facet configuration
  const resource = useResource('FacetConfiguration')
  const [activeFilters, setActiveFilters] = useFilters(resource)
  const filters = useMemo(
    () => ({
      category: selectedCategoryItem?.id,
      'sourceField.metadata.entity': 'product',
    }),
    [selectedCategoryItem?.id]
  )

  const [isVisibleAlertFacets, setIsVisibleAlertFacets] = useState(true)
  const contentTitle = selectedCategoryItem?.name
    ? selectedCategoryItem?.name
    : selectedCategoryItem?.catalogName

  return (
    <>
      <TwoColsLayout
        left={[
          <TitleBlock
            key="configuration"
            subtitle={t('facet.configuration')}
            title={t('facet.title')}
          >
            <ButtonSetting
              className={classNames({ selected: !selectedCategoryItem })}
              onClick={(): void => setSelectedCategoryItem(undefined)}
            >
              <IonIconStyle name="settings" />
              <DefaultButton>{t('facet.button.setting')}</DefaultButton>
            </ButtonSetting>
          </TitleBlock>,
          <TitleBlock key="categories" subtitle={t('facet.byCategory')}>
            <CategoryTree
              categories={categories.data}
              selectedItem={selectedCategoryItem}
              onSelect={setSelectedCategoryItem}
            />
          </TitleBlock>,
        ]}
      >
        <PageTitle
          title={contentTitle ? contentTitle : t('facets')}
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
