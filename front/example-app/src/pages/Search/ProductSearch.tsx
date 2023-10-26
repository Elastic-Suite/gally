import { useContext } from 'react'

import { searchContext } from '../../contexts'

import Facets from '../../components/Facets/Facets'
import Products from '../../components/Products/Products'
import TwoColsLayout from '../../components/TwoColsLayout/TwoColsLayout'

function ProductSearch(): JSX.Element {
  const {
    productSearch: {
      activeFilters,
      loadMore,
      moreOptions,
      page,
      pageSize,
      products,
      setActiveFilters,
      setPage,
      setPageSize,
      setSort,
      setSortOrder,
      sort,
      sortOptions,
      sortOrder,
    },
  } = useContext(searchContext)

  return (
    <TwoColsLayout
      left={
        <Facets
          activeFilters={activeFilters}
          filters={products.data?.products.aggregations}
          loadMore={loadMore}
          moreOptions={moreOptions}
          onFilterChange={setActiveFilters}
        />
      }
    >
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
    </TwoColsLayout>
  )
}

export default ProductSearch
