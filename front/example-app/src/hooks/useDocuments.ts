import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  IDocumentFieldFilterInput,
  IGraphqlAggregation,
  IGraphqlSearchDocuments,
  IGraphqlSearchDocumentsVariables,
  IGraphqlViewMoreFacetOptions,
  IGraphqlViewMoreFacetOptionsVariables,
  LoadStatus,
  addPrefixKeyObject,
  getMoreFacetOptionsQuery,
  getSearchDocumentsQuery,
  isError,
} from '@elastic-suite/gally-admin-shared'

import { catalogContext } from '../contexts'
import { IActiveFilters, IDocumentsHook, IFilterMoreOptions } from '../types'

import { useApiGraphql, useGraphqlApi } from './useGraphql'
import { getDocumentFilters } from '../services/document'
import { useDocumentSort } from './useDocumentSort'

export function useDocuments(
  entityType: string,
  search?: string
): IDocumentsHook {
  const graphqlApi = useApiGraphql()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const { localizedCatalogId } = useContext(catalogContext)
  const [sort, sortOrder, sortOptions, setSort, setSortOrder] =
    useDocumentSort(entityType)
  const [activeFilters, setActiveFilters] = useState<IActiveFilters>([])
  const [moreOptions, setMoreOptions] = useState<IFilterMoreOptions>(new Map())
  const queryFilters: IDocumentFieldFilterInput[] = useMemo(
    () => getDocumentFilters(activeFilters),
    [activeFilters]
  )

  const [documents, setDocuments, load, debouncedLoad] =
    useGraphqlApi<IGraphqlSearchDocuments>()
  const field = documents.data?.documents?.sortInfo.current[0].field
  const direction = documents.data?.documents?.sortInfo.current[0].direction

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

  const loadDocuments = useCallback(
    (condition: boolean) => {
      setMoreOptions(new Map())
      if (localizedCatalogId && condition) {
        const documentVariables: IGraphqlSearchDocumentsVariables = {
          localizedCatalog: String(localizedCatalogId),
          entityType,
          currentPage: page + 1,
          pageSize,
        }
        if (search) {
          documentVariables.search = search
        }
        if (sort) {
          documentVariables.sort = { field: sort, direction: sortOrder }
        }
        const variables = {
          ...addPrefixKeyObject(documentVariables, entityType),
        }
        const loadFunction = activeFilters.length === 0 ? load : debouncedLoad
        return loadFunction(
          getSearchDocumentsQuery(entityType, queryFilters, true),
          variables as unknown as Record<string, unknown>
        )
      }
      setDocuments(null)
    },
    [
      activeFilters,
      debouncedLoad,
      load,
      localizedCatalogId,
      page,
      pageSize,
      queryFilters,
      entityType,
      search,
      setDocuments,
      sort,
      sortOrder,
    ]
  )

  const loadMore = useCallback(
    (filter: IGraphqlAggregation, optionSearch?: string) => {
      const variables: IGraphqlViewMoreFacetOptionsVariables = {
        aggregation: filter.field,
        localizedCatalog: String(localizedCatalogId),
        entityType,
      }
      if (search) {
        variables.search = search
      }
      if (optionSearch) {
        variables.optionSearch = optionSearch
      }
      graphqlApi<IGraphqlViewMoreFacetOptions>(
        getMoreFacetOptionsQuery(queryFilters),
        variables as unknown as Record<string, unknown>
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
                    data: json.viewMoreFacetOptions,
                    status: LoadStatus.SUCCEEDED,
                  },
                ],
              ])
          )
        }
      })
    },
    [graphqlApi, localizedCatalogId, queryFilters, search, entityType]
  )

  return useMemo(
    () => ({
      activeFilters,
      loadMore,
      loadDocuments,
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
    }),
    [
      activeFilters,
      loadMore,
      loadDocuments,
      moreOptions,
      page,
      pageSize,
      documents,
      setSort,
      setSortOrder,
      sort,
      sortOptions,
      sortOrder,
    ]
  )
}
