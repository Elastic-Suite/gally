import { useContext } from 'react'
import { FormControl } from '@mui/material'

import { searchContext } from '../../contexts'

import PageLayout from '../../components/PageLayout/PageLayout'
import Products from '../../components/Products/Products'
import SearchBar from '../../components/SearchBar/SearchBar'

function Search(): JSX.Element {
  const {
    page,
    pageSize,
    products,
    search,
    setPage,
    setPageSize,
    setSort,
    setSortOrder,
    sort,
    sortOptions,
    sortOrder,
  } = useContext(searchContext)

  return (
    <PageLayout title={`Search results for "${search}"`}>
      <FormControl margin="normal">
        <SearchBar />
      </FormControl>
      <Products
        page={page}
        pageSize={pageSize}
        products={products}
        setPage={setPage}
        setPageSize={setPageSize}
        setSort={setSort}
        setSortOrder={setSortOrder}
        sort={sort}
        sortOptions={sortOptions}
        sortOrder={sortOrder}
      />
    </PageLayout>
  )
}

export default Search
