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

const ButtonSetting = styled('div')(() => ({
  color: '#2C19CD',
  display: 'flex',
  justifyContent: 'center',
  cursor: 'pointer',
  '&:hover': {
    color: 'green',
  },
}))

const IonIconStyle = styled(IonIcon)(() => ({
  width: '30px',
  fontSize: '20px',
}))

const FontSetting = styled('div')(() => ({
  borderBottom: '1px solid',
  fontWeight: 450,
  marginLeft: '5px',
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
          <TitleBlock key="title" title={t('facet.title')} line={false} />,
          <TitleBlock
            key="configuration"
            title={t('facet.configuration')}
            line={false}
            style={{ color: '#425880' }}
          >
            <ButtonSetting
              onClick={(): void => setSelectedCategoryItem(undefined)}
            >
              <IonIconStyle name="settings" />
              <FontSetting>{t('facet.button.setting')}</FontSetting>
            </ButtonSetting>
          </TitleBlock>,
          <TitleBlock
            key="categories"
            title={t('facet.byCategory')}
            line={false}
            style={{ color: '#425880' }}
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
        />
      </TwoColsLayout>
    </>
  )
}

export default withAuth(Facets)
