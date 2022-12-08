import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import {
  ICategorySortingOption,
  IGraphqlCategorySortingOption,
  IOptions,
  SortOrder,
} from 'shared'

import { getCategorySortingOptionsQuery } from '../constants'

import { useGraphqlApi } from './useGraphql'

export function useProductSort(): [
  string,
  SortOrder,
  IOptions<string>,
  Dispatch<SetStateAction<string>>,
  Dispatch<SetStateAction<SortOrder>>
] {
  const [sort, setSort] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC)

  const [categorySortingOptions, , loadSortOptions] =
    useGraphqlApi<IGraphqlCategorySortingOption>(getCategorySortingOptionsQuery)
  const sortOptions: IOptions<string> = useMemo(
    () =>
      categorySortingOptions.data?.categorySortingOptions.map(
        (obj: ICategorySortingOption) => ({
          value: obj.code,
          label: obj.label,
        })
      ) ?? [],
    [categorySortingOptions]
  )

  useEffect(() => {
    loadSortOptions()
  }, [loadSortOptions])

  return [sort, sortOrder, sortOptions, setSort, setSortOrder]
}
