import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  IGraphqlSearchProducts,
  IGraphqlSearchProductsVariables,
  IProductFieldFilterInput,
  ProductRequestType,
  getSearchProductsQuery,
} from 'shared'

import { catalogContext } from '../contexts'
import { IProductsHook } from '../types'
import { useGraphqlApi } from './useGraphql'

import { useProductSort } from './useProductSort'

export function useProducts(
  requestType: ProductRequestType,
  filters?: IProductFieldFilterInput[] | IProductFieldFilterInput
): IProductsHook {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const { localizedCatalogId } = useContext(catalogContext)
  const [sort, sortOrder, sortOptions, setSort, setSortOrder] = useProductSort()

  const variables = useMemo(() => {
    const variables: IGraphqlSearchProductsVariables = {
      catalogId: String(localizedCatalogId),
      requestType,
      currentPage: page + 1,
      pageSize,
    }
    if (search) {
      variables.search = search
    }
    if (sort) {
      variables.sort = { [sort]: sortOrder }
    }
    return variables
  }, [localizedCatalogId, page, pageSize, requestType, search, sort, sortOrder])
  const [products, setProducts, load] = useGraphqlApi<IGraphqlSearchProducts>(
    getSearchProductsQuery(filters),
    variables as unknown as Record<string, unknown>
  )
  const field = products.data?.products.sortInfo.current[0].field
  const direction = products.data?.products.sortInfo.current[0].direction

  useEffect(() => {
    setSort((prevState) => {
      if (field && field !== prevState) {
        return field
      }
      return prevState
    })
    setSortOrder((prevState) => {
      if (direction && direction !== prevState) {
        return direction
      }
      return prevState
    })
  }, [direction, field, setSort, setSortOrder])

  const loadProduts = useCallback(
    (condition: boolean) => {
      if (localizedCatalogId && condition) {
        load()
      } else {
        setProducts(null)
      }
    },
    [localizedCatalogId, load, setProducts]
  )

  return useMemo(
    () => ({
      loadProduts,
      page,
      pageSize,
      products,
      search,
      setPage,
      setPageSize,
      setSearch,
      setSort,
      setSortOrder,
      sort,
      sortOptions,
      sortOrder,
    }),
    [
      loadProduts,
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
}
