import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'

import { breadcrumbContext } from '~/contexts'
import { findBreadcrumbLabel } from '~/services'
import { selectMenu, useAppSelector } from '~/store'
import { ITreeItem } from '~/types'

import TitleBlock from '~/components/molecules/layout/TitleBlock/TitleBlock'
import TwoColsLayout from '~/components/molecules/layout/twoColsLayout/TwoColsLayout'
import CategoryTree from '~/components/stateful/CategoryTree/CategoryTree'
import PageTitle from '~/components/atoms/PageTitle/PageTitle'

function Categories(): JSX.Element {
  const router = useRouter()
  const menu = useAppSelector(selectMenu)
  const [, setBreadcrumb] = useContext(breadcrumbContext)

  const [selectedCategoryItem, setSelectedCategoryItem] = useState<
    ITreeItem | undefined
  >()

  useEffect(() => {
    setBreadcrumb(['merchandize', 'categories'])
  }, [router.query, setBreadcrumb])

  const title = findBreadcrumbLabel(0, ['merchandize'], menu.hierarchy)

  const { t } = useTranslation('categories')

  function handleSelect(item: ITreeItem): void {
    setSelectedCategoryItem(item)
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <TwoColsLayout
        left={[
          <TitleBlock key="categories" title={t('categories.title')}>
            <CategoryTree
              selectedItem={selectedCategoryItem}
              onSelect={handleSelect}
            />
          </TitleBlock>,
          <TitleBlock key="virtualRule" title={t('virtualRule.title')}>
            Virtual rule DATA
          </TitleBlock>,
        ]}
      >
        <PageTitle
          title={
            selectedCategoryItem?.name
              ? selectedCategoryItem?.name
              : selectedCategoryItem?.catalogName
          }
        />
      </TwoColsLayout>
    </>
  )
}

export default Categories
