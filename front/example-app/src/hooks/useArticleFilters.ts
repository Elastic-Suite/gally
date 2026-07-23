import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { ArticleFilters } from '../data/types'

const LIST_PARAMS = {
  sections: 'cmsSection',
  categoryIds: 'cmsCategory',
} as const

type ListField = keyof typeof LIST_PARAMS

function parseList(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key)
  return raw ? raw.split(',').filter(Boolean) : []
}

export function useArticleFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filters = useMemo<ArticleFilters>(
    () => ({
      sections: parseList(searchParams, LIST_PARAMS.sections),
      categoryIds: parseList(searchParams, LIST_PARAMS.categoryIds),
    }),
    [searchParams],
  )

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
          return params
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const clearAll = useCallback(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev)
      params.delete(LIST_PARAMS.sections)
      params.delete(LIST_PARAMS.categoryIds)
      return params
    })
  }, [setSearchParams])

  return { filters, toggleValue, clearAll }
}
