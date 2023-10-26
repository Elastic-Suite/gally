import { useContext } from 'react'
import { searchContext } from '../../contexts'
import PageLayout from '../../components/PageLayout/PageLayout'
import Tabs from '../../components/Tabs/Tabs'
import ProductsSearch from './ProductSearch'
import CmsSearch from './CmsSearch'
import { ITab } from '@elastic-suite/gally-admin-shared'

function Search(): JSX.Element {
  const { search } = useContext(searchContext)

  const tabs: ITab[] = [
    {
      Component: ProductsSearch,
      id: 0,
      label: 'Products',
    },
    {
      Component: CmsSearch,
      id: 1,
      label: 'CMS pages',
    },
  ]

  return (
    <PageLayout title={`Search results for "${search}"`}>
      <Tabs tabs={tabs} />
    </PageLayout>
  )
}

export default Search
