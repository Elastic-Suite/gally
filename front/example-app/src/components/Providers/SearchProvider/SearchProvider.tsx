import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ProductRequestType,
  cmsPageEntityType,
} from '@elastic-suite/gally-admin-shared'

import { searchContext } from '../../../contexts'
import { useProducts } from '../../../hooks'
import { useDocuments } from '../../../hooks/useDocuments'

interface IProps {
  children: ReactNode
}

function SearchProvider(props: IProps): JSX.Element {
  const { children } = props
  const [search, setSearch] = useState('')
  const productsHook = useProducts(ProductRequestType.SEARCH, null, search)
  const cmsPagesHook = useDocuments(cmsPageEntityType, search)
  const navigate = useNavigate()
  const { loadProducts } = productsHook
  const { loadDocuments: loadCmsPages } = cmsPagesHook

  useEffect(() => {
    loadProducts(Boolean(search))
    loadCmsPages(Boolean(search))
  }, [loadProducts, search, loadCmsPages])

  const onSearch = useCallback(
    (search: string) => {
      setSearch(search)
      navigate('/search')
    },
    [navigate, setSearch]
  )

  const context = useMemo(
    () => ({
      search,
      onSearch,
      productSearch: productsHook,
      cmsPageSearch: cmsPagesHook,
    }),
    [search, onSearch, productsHook, cmsPagesHook]
  )

  return (
    <searchContext.Provider value={context}>{children}</searchContext.Provider>
  )
}

export default SearchProvider
