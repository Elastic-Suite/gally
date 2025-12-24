import {
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ICategoryTypeDefaultFilterInputType,
  IGraphqlAggregation,
  IGraphqlSearchProducts,
  IGraphqlSearchProductsVariables,
  IGraphqlViewMoreProductFacetOptions,
  IGraphqlViewMoreProductFacetOptionsVariables,
  IProductFieldFilterInput,
  LoadStatus,
  ProductRequestType,
  getMoreFacetProductOptionsQuery,
  getSearchProductsQuery,
  isError,
} from '@elastic-suite/gally-admin-shared'

import { catalogContext, settingsContext } from '../contexts'
import { IActiveFilters, IFilterMoreOptions, IProductsHook } from '../types'
import { getProductFilters } from '../services'

import { useApiGraphql, useGraphqlApi } from './useGraphql'
import { useProductSort } from './useProductSort'

export function useProducts(
  requestType: ProductRequestType,
  currentCategoryId?: string,
  search?: string,
  defaultPageSize?: number
): IProductsHook {
  const graphqlApi = useApiGraphql()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(
    defaultPageSize ? defaultPageSize : 10
  )
  const { localizedCatalogId } = useContext(catalogContext)
  const [sort, sortOrder, sortOptions, setSort, setSortOrder] = useProductSort()
  const [activeFilters, setActiveFilters] = useState<IActiveFilters>([])
  const [moreOptions, setMoreOptions] = useState<IFilterMoreOptions>(new Map())
  const queryFilters: IProductFieldFilterInput[] = useMemo(
    () => getProductFilters(activeFilters),
    [activeFilters]
  )
  const { longitude, latitude } = useContext(settingsContext)

  const [products, setProducts, load, debouncedLoad] =
    useGraphqlApi<IGraphqlSearchProducts>()
  const field = products.data?.products?.sortInfo.current[0].field
  const direction = products.data?.products?.sortInfo.current[0].direction

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

  const loadProducts = useCallback(
    (condition: boolean) => {
      setMoreOptions(new Map())
      if (localizedCatalogId && condition) {
        const variables: IGraphqlSearchProductsVariables = {
          localizedCatalog: String(localizedCatalogId),
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
        if (currentCategoryId) {
          variables.currentCategoryId = currentCategoryId
        }
        const loadFunction = activeFilters.length === 0 ? load : debouncedLoad
        return loadFunction(
          getSearchProductsQuery(queryFilters, true),
          variables as unknown as Record<string, unknown>,
          {
            headers: {
              ...(latitude !== '' &&
                longitude !== '' && {
                  'reference-location': `${latitude}, ${longitude}`,
                }),
            },
          }
        )
      }
      setProducts(null)
    },
    [
      activeFilters,
      currentCategoryId,
      debouncedLoad,
      load,
      localizedCatalogId,
      page,
      pageSize,
      queryFilters,
      requestType,
      search,
      setProducts,
      sort,
      sortOrder,
      latitude,
      longitude,
    ]
  )

  const loadMore = useCallback(
    (filter: IGraphqlAggregation, optionSearch?: string) => {
      const variables: IGraphqlViewMoreProductFacetOptionsVariables = {
        aggregation: filter.field,
        localizedCatalog: String(localizedCatalogId),
      }
      const categoryIdFilter = queryFilters.find(
        (value) => Object.keys(value)[0] === 'category__id'
      )
      if (search) {
        variables.search = search
      }
      if (optionSearch) {
        variables.optionSearch = optionSearch
      }
      if (currentCategoryId) {
        variables.currentCategoryId = currentCategoryId
      }
      if (categoryIdFilter) {
        variables.currentCategoryId = (
          categoryIdFilter.category_id as ICategoryTypeDefaultFilterInputType
        ).eq
      }
      graphqlApi<IGraphqlViewMoreProductFacetOptions>(
        getMoreFacetProductOptionsQuery(queryFilters),
        variables as unknown as Record<string, unknown>,
        {
          headers: {
            ...(latitude !== '' &&
              longitude !== '' && {
                'reference-location': `${latitude}, ${longitude}`,
              }),
          },
        }
      ).then((json) => {
        if (isError(json)) {
          setMoreOptions(
            (prevState) =>
              new Map([
                ...prevState,
                [filter, { error: json.error, status: LoadStatus.FAILED }],
              ])
          )
        } else {
          setMoreOptions(
            (prevState) =>
              new Map([
                ...prevState,
                [
                  filter,
                  {
                    data: json.viewMoreProductFacetOptions,
                    status: LoadStatus.SUCCEEDED,
                  },
                ],
              ])
          )
        }
      })
    },
    [
      graphqlApi,
      localizedCatalogId,
      queryFilters,
      search,
      latitude,
      longitude,
      currentCategoryId,
    ]
  )

  function updateFilters(filters: SetStateAction<IActiveFilters>): void {
    setActiveFilters(filters)
    setPage(0)
  }

  return useMemo(
    () => ({
      activeFilters,
      loadMore,
      loadProducts,
      moreOptions,
      page,
      pageSize,
      products,
      setActiveFilters: updateFilters,
      setPage,
      setPageSize,
      setSort,
      setSortOrder,
      sort,
      sortOptions,
      sortOrder,
    }),
    [
      activeFilters,
      loadMore,
      loadProducts,
      moreOptions,
      page,
      pageSize,
      products,
      setSort,
      setSortOrder,
      sort,
      sortOptions,
      sortOrder,
    ]
  )
}
