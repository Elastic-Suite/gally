import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  IDocumentFieldFilterInput,
  IGraphqlAggregation,
  IGraphqlSearchDocumentsVariables,
  IGraphqlVectorSearchDocuments,
  IGraphqlViewMoreFacetOptions,
  IGraphqlViewMoreFacetOptionsVariables,
  LoadStatus,
  addPrefixKeyObject,
  getMoreFacetOptionsQuery,
  getVectorSearchDocumentsQuery,
  isError,
} from '@elastic-suite/gally-admin-shared'

import { catalogContext } from '../contexts'
import {
  IActiveFilters,
  IFilterMoreOptions,
  IVectorSearchDocumentsHook,
} from '../types'

import { useApiGraphql, useGraphqlApi } from './useGraphql'
import { getDocumentFilters } from '../services/document'
import { useDocumentSort } from './useDocumentSort'

export function useVectorSearchDocuments(
  entityType: string,
  search?: string
): IVectorSearchDocumentsHook {
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

  const [vectorSearchDocuments, setVectorSearchDocument, load, debouncedLoad] =
    useGraphqlApi<IGraphqlVectorSearchDocuments>()
  const field =
    vectorSearchDocuments.data?.vectorSearchDocuments?.sortInfo.current[0].field
  const direction =
    vectorSearchDocuments.data?.vectorSearchDocuments?.sortInfo.current[0]
      .direction

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

  const loadVectorSearchDocuments = useCallback(
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
          getVectorSearchDocumentsQuery(entityType, queryFilters, true),
          variables as unknown as Record<string, unknown>
        )
      }
      setVectorSearchDocument(null)
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
      setVectorSearchDocument,
      sort,
      sortOrder,
    ]
  )

  const loadMore = useCallback(
    (filter: IGraphqlAggregation) => {
      const variables: IGraphqlViewMoreFacetOptionsVariables = {
        aggregation: filter.field,
        localizedCatalog: String(localizedCatalogId),
        entityType,
      }
      if (search) {
        variables.search = search
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
      loadVectorSearchDocuments,
      moreOptions,
      page,
      pageSize,
      vectorSearchDocuments,
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
      loadVectorSearchDocuments,
      moreOptions,
      page,
      pageSize,
      vectorSearchDocuments,
      setSort,
      setSortOrder,
      sort,
      sortOptions,
      sortOrder,
    ]
  )
}
