import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Resource } from '@api-platform/api-doc-parser'
import { useRouter } from 'next/router'

import {
  getAppUrl,
  getFilterParameters,
  getPageParameter,
  getParametersFromUrl,
  getRouterUrl,
  getSearchParameter,
} from '~/services'
import { ISearchParameters } from '~/types'

export function useFiltersRedirect(
  page: number | false = 0,
  activeFilters?: ISearchParameters,
  searchValue?: string
): void {
  const router = useRouter()

  useEffect(() => {
    const url = getAppUrl(router.asPath, page, activeFilters, searchValue)
    if (router.asPath !== url.pathname + url.search) {
      router.push(url.href, undefined, { shallow: true })
    }
  }, [activeFilters, page, router, searchValue])
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
  resource: Resource
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