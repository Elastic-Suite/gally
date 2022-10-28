import {
  currentPage,
  defaultPageSize,
  pageSize,
  rangeSeparator,
  searchParameter,
  usePagination,
} from '../constants'
import { ISearchParameters } from '../types'

import { removeEmptyParameters } from './api'

export function getUrl(
  urlParam: string | URL,
  searchParameters: ISearchParameters = {}
): URL {
  const url: URL = urlParam instanceof URL ? urlParam : new URL(urlParam)

  Object.entries(searchParameters).forEach(([key, value]) => {
    if (key.endsWith('[between]')) {
      value = value as (string | number)[]
      if (value[0] !== '' || value[1] !== '') {
        url.searchParams.append(key, value.join(rangeSeparator))
      }
    } else if (value instanceof Array) {
      value.forEach((value) => url.searchParams.append(key, String(value)))
    } else {
      url.searchParams.append(key, String(value))
    }
  })

  return url
}

export function clearParameters(url: URL): URL {
  ;[...url.searchParams.entries()].forEach(([key]) =>
    url.searchParams.delete(key)
  )
  return url
}

export function getListParameters(
  page: number | false = 0,
  searchParameters: ISearchParameters = {},
  searchValue = ''
): ISearchParameters {
  if (typeof page === 'number') {
    return removeEmptyParameters({
      ...searchParameters,
      [currentPage]: page === 0 ? '' : page, // If page=0, remove parameter from URL
      [searchParameter]: searchValue,
    })
  }
  return removeEmptyParameters({
    ...searchParameters,
    [searchParameter]: searchValue,
  })
}

export function getListApiParameters(
  page: number | false = 0,
  rowsPerPage: number = defaultPageSize,
  searchParameters: ISearchParameters = {},
  searchValue = ''
): ISearchParameters {
  if (typeof page === 'number') {
    return removeEmptyParameters({
      ...searchParameters,
      [currentPage]: page + 1,
      [usePagination]: true,
      [pageSize]: rowsPerPage,
      [searchParameter]: searchValue,
    })
  }
  return removeEmptyParameters({
    ...searchParameters,
    [usePagination]: false,
    [searchParameter]: searchValue,
  })
}

export function getRouterUrl(path: string): URL {
  return new URL(`${window.location.origin}${path}`)
}

export function getRouterPath(path: string): string {
  const url = getRouterUrl(path)
  return clearParameters(url).pathname
}

export function getAppUrl(
  path: string,
  page: number | false = 0,
  activeFilters?: ISearchParameters,
  searchValue?: string
): URL {
  const parameters = getListParameters(page, activeFilters, searchValue)
  const url = getRouterUrl(path)
  return getUrl(clearParameters(url), parameters)
}

export function getParametersFromUrl(url: URL): ISearchParameters {
  return Object.fromEntries(
    [...url.searchParams.entries()].reduce((acc, [key, value]) => {
      if (key.endsWith('[between]')) {
        acc.push([key, value.split(rangeSeparator)])
      } else if (key.endsWith('[]')) {
        const existingValue = acc.find(([accKey]) => accKey === key)?.[1]
        if (existingValue) {
          existingValue.push(value)
        } else {
          acc.push([key, [value]])
        }
      } else {
        acc.push([key, value])
      }
      return acc
    }, [])
  )
}

export function getPageParameter(parameters: ISearchParameters): number {
  const pageEntry = Object.entries(parameters).find(
    ([key]) => key === currentPage
  )
  return Number(pageEntry?.[1] ?? 0)
}

export function getSearchParameter(parameters: ISearchParameters): string {
  const pageEntry = Object.entries(parameters).find(
    ([key]) => key === searchParameter
  )
  return String(pageEntry?.[1] ?? '')
}
