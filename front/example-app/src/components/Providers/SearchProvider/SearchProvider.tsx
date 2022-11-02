import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { IGraphqlSearchProducts, getSearchProductsQuery } from 'shared'

import { catalogContext, searchContext } from '../../../contexts'
import { useGraphqlApi } from '../../../hooks'

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
      search,
    }),
    [localizedCatalogId, page, pageSize, search]
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
    }),
    [onSearch, page, pageSize, products, search]
  )

  return (
    <searchContext.Provider value={context}>{children}</searchContext.Provider>
  )
}

export default SearchProvider
