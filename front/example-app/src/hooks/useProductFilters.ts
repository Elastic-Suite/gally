import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { ActiveFilters, SortKey } from '../data/types'

const LIST_PARAMS = {
  categoryIds: 'category',
  colors: 'color',
  sizes: 'size',
  materials: 'material',
  styles: 'style',
} as const

type ListField = keyof typeof LIST_PARAMS

const DEFAULT_PAGE_SIZE = 9

function parseList(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key)
  return raw ? raw.split(',').filter(Boolean) : []
}

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<ActiveFilters>(() => {
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    return {
      categoryIds: parseList(searchParams, 'category'),
      colors: parseList(searchParams, 'color'),
      sizes: parseList(searchParams, 'size'),
      materials: parseList(searchParams, 'material'),
      styles: parseList(searchParams, 'style'),
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    }
  }, [searchParams])

  const sort = (searchParams.get('sort') as SortKey | null) ?? 'relevance'
  const query = searchParams.get('q') ?? ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const pageSize = Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE

  const toggleValue = useCallback(
    (field: ListField, value: string) => {
      setSearchParams(
        (prev) => {
          const key = LIST_PARAMS[field]
          const current = parseList(prev, key)
          const next = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value]
          const params = new URLSearchParams(prev)
          if (next.length) params.set(key, next.join(','))
          else params.delete(key)
          params.delete('page')
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setPriceRange = useCallback(
    (min: number | undefined, max: number | undefined) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          if (min !== undefined) params.set('minPrice', String(min))
          else params.delete('minPrice')
          if (max !== undefined) params.set('maxPrice', String(max))
          else params.delete('maxPrice')
          params.delete('page')
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setSort = useCallback(
    (value: SortKey) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          if (value === 'relevance') params.delete('sort')
          else params.set('sort', value)
          params.delete('page')
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setPage = useCallback(
    (value: number) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev)
        if (value <= 1) params.delete('page')
        else params.set('page', String(value))
        return params
      })
    },
    [setSearchParams],
  )

  const setPageSize = useCallback(
    (value: number) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev)
        if (value === DEFAULT_PAGE_SIZE) params.delete('pageSize')
        else params.set('pageSize', String(value))
        params.delete('page')
        return params
      })
    },
    [setSearchParams],
  )

  const clearAll = useCallback(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      for (const key of [
        'category',
        'color',
        'size',
        'material',
        'style',
        'minPrice',
        'maxPrice',
        'page',
      ]) {
        params.delete(key)
      }
      return params
    })
  }, [setSearchParams])

  return {
    filters,
    sort,
    query,
    page,
    pageSize,
    toggleValue,
    setPriceRange,
    setSort,
    setPage,
    setPageSize,
    clearAll,
  }
}
