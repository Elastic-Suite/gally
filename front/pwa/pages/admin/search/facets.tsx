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
import { styled } from '@mui/system'
import ResourceTable from '~/components/stateful-pages/ResourceTable/ResourceTable'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import PageTitle from '~/components/atoms/PageTitle/PageTitle'

const pagesSlug = ['search', 'facets']

const ButtonSetting = styled('div')(({theme}) => ({
  color: theme.palette.colors.neutral[900],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  gap: '5px',
  '&:hover': {
    textDecoration: 'underline',
    color: theme.palette.colors.secondary[600],
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

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <TwoColsLayout
        left={[
          <TitleBlock key="title" title={t('facet.title')} />,
          <TitleBlock
            sousTitle
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
            sousTitle
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
          title={
            selectedCategoryItem?.name
              ? selectedCategoryItem?.name
              : selectedCategoryItem?.catalogName
          }
          sx={{ marginBottom: '32px' }}
        />
        <ResourceTable
          resourceName="FacetConfiguration"
          category={selectedCategoryItem?.id}
          diffDefaultValues
        />
      </TwoColsLayout>
    </>
  )
}

export default withAuth(Facets)
