import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductRequestType } from 'gally-admin-shared'

import { searchContext } from '../../../contexts'
import { useProducts } from '../../../hooks'

interface IProps {
  children: ReactNode
}

function SearchProvider(props: IProps): JSX.Element {
  const { children } = props
  const productsHook = useProducts(ProductRequestType.SEARCH)
  const navigate = useNavigate()
  const { loadProducts, search, setSearch } = productsHook

  useEffect(() => {
    loadProducts(Boolean(search))
  }, [loadProducts, search])

  const onSearch = useCallback(
    (search: string) => {
      setSearch(search)
      navigate('/search')
    },
    [navigate, setSearch]
  )

  const context = useMemo(
    () => ({ onSearch, ...productsHook }),
    [onSearch, productsHook]
  )

  return (
    <searchContext.Provider value={context}>{children}</searchContext.Provider>
  )
}

export default SearchProvider
