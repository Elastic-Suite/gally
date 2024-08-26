import { useContext } from 'react'
import { searchContext } from '../../contexts'
import PageLayout from '../../components/PageLayout/PageLayout'
import ProductsSearch from './ProductSearch'

function Search(): JSX.Element {
  const { search } = useContext(searchContext)

  return (
    <PageLayout title={`Search results for "${search}"`}>
      <ProductsSearch/>
    </PageLayout>
  )
}

export default Search
