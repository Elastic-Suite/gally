import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IGraphqlSearchProducts,
  ProductRequestType,
  getSearchProductsQuery,
} from 'shared'

import { catalogContext, searchContext } from '../../../contexts'
import { useGraphqlApi, useProductSort } from '../../../hooks'

interface IProps {
  children: ReactNode
}

function SearchProvider(props: IProps): JSX.Element {
  const { children } = props
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const { localizedCatalogId } = useContext(catalogContext)
  const navigate = useNavigate()
  const [sort, sortOrder, sortOptions, setSort, setSortOrder] = useProductSort()

  const onSearch = useCallback(
    (search: string) => {
      setSearch(search)
      navigate('/search')
    },
    [navigate]
  )

  const variables = useMemo(
    () => ({
      catalogId: String(localizedCatalogId),
      currentPage: page + 1,
      pageSize,
      requestType: ProductRequestType.SEARCH,
      search,
      sort: sort ? { [sort]: 'asc' } : undefined,
    }),
    [localizedCatalogId, page, pageSize, search, sort]
  )
  const [products, , load] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery(),
    variables
  )

  useEffect(() => {
    if (localizedCatalogId) {
      load()
    }
  }, [load, localizedCatalogId])

  const context = useMemo(
    () => ({
      onSearch,
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
    }),
    [
      onSearch,
      page,
      pageSize,
      products,
      search,
      setSort,
      setSortOrder,
      sort,
      sortOptions,
      sortOrder,
    ]
  )

  return (
    <searchContext.Provider value={context}>{children}</searchContext.Provider>
  )
}

export default SearchProvider
