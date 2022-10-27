import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import {
  IResource,
  ISearchParameters,
  getApiFilters,
  getAppUrl,
  getFilterParameters,
  getPageParameter,
  getParametersFromUrl,
  getRouterUrl,
  getSearchParameter,
} from 'shared'

export function useFiltersRedirect(
  page: number | false = 0,
  activeFilters?: ISearchParameters,
  searchValue?: string,
  active = true
): void {
  const router = useRouter()

  useEffect(() => {
    if (active) {
      const url = getAppUrl(router.asPath, page, activeFilters, searchValue)
      if (router.asPath !== url.pathname + url.search) {
        router.push(url.href, undefined, { shallow: true })
      }
    }
  }, [active, activeFilters, page, router, searchValue])
}

export function usePage(): [number, Dispatch<SetStateAction<number>>] {
  const router = useRouter()
  const [page, setPage] = useState<number>(() => {
    const url = getRouterUrl(router.asPath)
    const parameters = getParametersFromUrl(url)
    return getPageParameter(parameters)
  })
  return [page, setPage]
}

export function useFilters(
  resource: IResource
): [ISearchParameters, Dispatch<SetStateAction<ISearchParameters>>] {
  const router = useRouter()
  const [activeFilters, setActiveFilters] = useState<ISearchParameters>(() => {
    const url = getRouterUrl(router.asPath)
    const parameters = getParametersFromUrl(url)
    const params = getFilterParameters(resource, parameters)
    return params
  })
  return [activeFilters, setActiveFilters]
}

export function useSearch(): [string, Dispatch<SetStateAction<string>>] {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState<string>(() => {
    const url = getRouterUrl(router.asPath)
    const parameters = getParametersFromUrl(url)
    return getSearchParameter(parameters)
  })
  return [searchValue, setSearchValue]
}

export function useFilterParameters(
  ...filters: ISearchParameters[]
): ISearchParameters {
  return useMemo(
    () => getApiFilters(Object.assign({}, ...filters)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    filters
  )
}
