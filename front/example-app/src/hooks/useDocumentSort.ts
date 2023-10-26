import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import {
  IGraphqlSortingOptions,
  IOptions,
  ISortingOption,
  SortOrder,
} from '@elastic-suite/gally-admin-shared'

import { getSortingOptionsQuery } from '../constants'

import { useGraphqlApi } from './useGraphql'

export function useDocumentSort(
  entityType: string
): [
  string,
  SortOrder,
  IOptions<string>,
  Dispatch<SetStateAction<string>>,
  Dispatch<SetStateAction<SortOrder>>
] {
  const [sort, setSort] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC)

  const [categorySortingOptions, , loadSortOptions] =
    useGraphqlApi<IGraphqlSortingOptions>()
  const sortOptions: IOptions<string> = useMemo(
    () =>
      categorySortingOptions.data?.sortingOptions?.map(
        (obj: ISortingOption) => ({
          value: obj.code,
          label: obj.label,
        })
      ) ?? [],
    [categorySortingOptions]
  )

  const variables = useMemo(() => ({ entityType }), [entityType])

  useEffect(() => {
    loadSortOptions(getSortingOptionsQuery, variables)
  }, [loadSortOptions, variables])

  return [sort, sortOrder, sortOptions, setSort, setSortOrder]
}
