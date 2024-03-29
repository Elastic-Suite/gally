import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import {
  IGraphqlProductSortingOptions,
  IOptions,
  ISortingOption,
  SortOrder,
} from '@elastic-suite/gally-admin-shared'

import { getProductSortingOptionsQuery } from '../constants'

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

  const [productSortingOptions, , loadSortOptions] =
    useGraphqlApi<IGraphqlProductSortingOptions>()
  const sortOptions: IOptions<string> = useMemo(
    () =>
      productSortingOptions.data?.productSortingOptions?.map(
        (obj: ISortingOption) => ({
          value: obj.code,
          label: obj.label,
        })
      ) ?? [],
    [productSortingOptions]
  )

  useEffect(() => {
    loadSortOptions(getProductSortingOptionsQuery)
  }, [loadSortOptions])

  return [sort, sortOrder, sortOptions, setSort, setSortOrder]
}
