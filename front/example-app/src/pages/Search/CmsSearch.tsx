import { useContext } from 'react'

import { searchContext } from '../../contexts'

import Facets from '../../components/Facets/Facets'
import TwoColsLayout from '../../components/TwoColsLayout/TwoColsLayout'
import CmsPages from '../../components/Cms/Pages'

function CmsSearch(): JSX.Element {
  const {
    cmsPageSearch: {
      activeFilters,
      loadMore,
      moreOptions,
      page,
      pageSize,
      documents,
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
          filters={documents.data?.documents.aggregations}
          loadMore={loadMore}
          moreOptions={moreOptions}
          onFilterChange={setActiveFilters}
        />
      }
    >
      <CmsPages
        page={page}
        pageSize={pageSize}
        documents={documents}
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

export default CmsSearch
