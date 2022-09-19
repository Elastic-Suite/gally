import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'

import { useApiFetch } from '~/hooks'
import { IFetchApi, LoadStatus } from 'shared'

export type ILoader<T> = (fetchApi: IFetchApi<unknown>) => Promise<T>

type IFetch<T> = (id: string, loader: ILoader<T>) => void

interface IUseLoader<T> {
  fetch: IFetch<T>
  map: Map<string, T>
  setMap: Dispatch<SetStateAction<Map<string, T>>>
}

export function useSingletonLoader<T>(defaultState = new Map()): IUseLoader<T> {
  const fetchApi = useApiFetch()
  const [map, setMap] = useState<Map<string, T>>(defaultState)
  const fieldOptionsStatuses = useRef<Map<string, LoadStatus>>(new Map())

  const updateFieldOptions = useCallback((id: string, options: T) => {
    fieldOptionsStatuses.current.set(id, LoadStatus.SUCCEEDED)
    setMap((prevState) => {
      const clone = new Map(prevState)
      clone.set(id, options)
      return clone
    })
  }, [])

  const fetch = useCallback(
    async (id: string, loader: ILoader<T>) => {
      const status = fieldOptionsStatuses.current.get(id)
      if (!status) {
        fieldOptionsStatuses.current.set(id, LoadStatus.LOADING)
        try {
          const data = await loader(fetchApi)
          updateFieldOptions(id, data)
        } catch {
          fieldOptionsStatuses.current.set(id, LoadStatus.FAILED)
        }
      }
    },
    [fetchApi, updateFieldOptions]
  )

  return { fetch, map, setMap }
}
