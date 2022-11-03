import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import {
  ICategorySortingOption,
  IGraphqlCategorySortingOption,
  IOptions,
  SortOrder,
} from 'shared'

import { getCategorySortingOptionsQuery } from '../constants'

import { useGraphqlApi } from './useGraphql'

// export function useProductSort(categoryId?: string): [
export function useProductSort(): [
  string,
  SortOrder,
  IOptions<string>,
  Dispatch<SetStateAction<string>>,
  Dispatch<SetStateAction<SortOrder>>
] {
  const [sort, setSort] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC)
  // const { catalogId, localizedCatalogId } = useContext(catalogContext)

  // Todo: get default sorting
  // const variables = useMemo(() => ({
  //   catalogId,
  //   categoryId,
  //   localizedCatalogId
  // }), [catalogId, categoryId, localizedCatalogId])
  // const [categoryConfiguration, , loadCatConf] =
  // useGraphqlApi<IGraphqlCategorySortingOption>(getCategoryConfigurationQuery, variables)

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

  // useEffect(() => {
  //   if (categoryId && catalogId && localizedCatalogId) {
  //     loadCatConf()
  //   }
  // }, [categoryId, catalogId, localizedCatalogId, loadCatConf])

  useEffect(() => {
    loadSortOptions()
  }, [loadSortOptions])

  return [sort, sortOrder, sortOptions, setSort, setSortOrder]
}
