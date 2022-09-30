import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'next-i18next'
import debounce from 'lodash.debounce'

import {
  IFetch,
  IFetchApi,
  IHydraMember,
  IHydraResponse,
  ILoadResource,
  IResource,
  IResourceEditableOperations,
  ISearchParameters,
  LoadStatus,
  defaultPageSize,
  fetchApi,
  getListApiParameters,
  isError,
} from 'shared'

import { useLog } from './useLog'
import { useResourceOperations } from './useResource'

const debounceDelay = 400

export function useApiFetch<T>(secure = true): IFetchApi<T> {
  const { i18n } = useTranslation('common')
  const log = useLog()
  return useCallback(
    async (
      resource: IResource | string,
      searchParameters?: ISearchParameters,
      options?: RequestInit
    ) => {
      try {
        const json = await fetchApi<T>(
          i18n.language,
          resource,
          searchParameters,
          options,
          secure
        )
        return json
      } catch (error) {
        log(error)
        return { error }
      }
    },
    [i18n.language, log, secure]
  )
}

export function useFetchApi<T>(
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit
): [IFetch<T>, Dispatch<SetStateAction<T>>, ILoadResource] {
  const fetchApi = useApiFetch<T>()
  const [response, setResponse] = useState<IFetch<T>>({
    status: LoadStatus.IDLE,
  })

  const updateResponse = useCallback((data: SetStateAction<T>): void => {
    setResponse((prevState) => ({
      ...prevState,
      data: data instanceof Function ? data(prevState.data) : data,
    }))
  }, [])

  const load = useCallback(() => {
    setResponse((prevState) => ({
      data: prevState.data,
      status: LoadStatus.LOADING,
    }))
    fetchApi(resource, searchParameters, options).then((json) => {
      if (isError(json)) {
        setResponse({ error: json.error, status: LoadStatus.FAILED })
      } else {
        setResponse({ data: json, status: LoadStatus.SUCCEEDED })
      }
    })
  }, [fetchApi, options, resource, searchParameters])

  useEffect(() => {
    load()
  }, [load])

  return [response, updateResponse, load]
}

export function useApiList<T extends IHydraMember>(
  resource: IResource | string,
  page: number | false = 0,
  rowsPerPage: number = defaultPageSize,
  searchParameters?: ISearchParameters,
  searchValue?: string
): [IFetch<IHydraResponse<T>>, Dispatch<SetStateAction<T[]>>, ILoadResource] {
  const parameters = useMemo(
    () =>
      getListApiParameters(page, rowsPerPage, searchParameters, searchValue),
    [page, rowsPerPage, searchParameters, searchValue]
  )
  const [response, updateResponse, load] = useFetchApi<IHydraResponse<T>>(
    resource,
    parameters
  )

  const updateList = useCallback(
    (data: SetStateAction<T[]>): void => {
      updateResponse((prevState) => ({
        ...prevState,
        'hydra:member':
          data instanceof Function ? data(prevState['hydra:member']) : data,
      }))
    },
    [updateResponse]
  )

  return [response, updateList, load]
}

export function useApiEditableList<T extends IHydraMember>(
  resource: IResource,
  page: number | false = 0,
  rowsPerPage: number = defaultPageSize,
  searchParameters?: ISearchParameters,
  searchValue?: string,
  url?: string
): [IFetch<IHydraResponse<T>>, IResourceEditableOperations<T>] {
  const [response, updateList, load] = useApiList<T>(
    url ? url : resource,
    page,
    rowsPerPage,
    searchParameters,
    searchValue
  )
  const { create, remove, replace, update } = useResourceOperations<T>(resource)

  const debouncedUpdate = useMemo(
    () =>
      debounce(
        async (id: string | number, updatedItem: Partial<T>): Promise<void> => {
          const updateResponse = await update(id, updatedItem)
          if (isError(updateResponse)) {
            // reload if error
            load()
          }
        },
        debounceDelay
      ),
    [load, update]
  )

  const editableUpdate = useCallback(
    (id: string | number, updatedItem: Partial<T>): void => {
      updateList((items) =>
        items.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      )
      debouncedUpdate(id, updatedItem)
    },
    [debouncedUpdate, updateList]
  )

  const massEditableUpdate = useCallback(
    async (
      ids: (string | number)[],
      updatedItem: Partial<T>
    ): Promise<void> => {
      updateList((items) =>
        items.map((item) =>
          ids.includes(item.id) ? { ...item, ...updatedItem } : item
        )
      )
      const promises = ids.map((id) => update(id, updatedItem))
      const responses = await Promise.all(promises)
      const hasError = responses.some((response) => isError(response))
      if (hasError) {
        // reload if error
        load()
      }
    },
    [load, update, updateList]
  )

  const editableCreate = useCallback(
    async (item: Omit<T, 'id' | '@id' | '@type'>): Promise<void> => {
      const createResponse = await create(item)
      if (
        !isError(createResponse) &&
        response.data['hydra:member'].length < rowsPerPage
      ) {
        // reload if item has been added and we are on the last page
        load()
      }
    },
    [create, load, response, rowsPerPage]
  )

  const editableReplace = useCallback(
    async (replacedItem: Omit<T, '@id' | '@type'>): Promise<void> => {
      updateList((items) =>
        items.map((item) =>
          item.id === replacedItem.id ? { ...item, ...replacedItem } : item
        )
      )
      const response = await replace(replacedItem)
      if (isError(response)) {
        // reload if error
        load()
      }
    },
    [load, replace, updateList]
  )

  const editableRemove = useCallback(
    async (id: string | number): Promise<void> => {
      updateList((items) => items.filter((item) => item.id !== id))
      const removeResponse = await remove(id)
      if (
        isError(removeResponse) ||
        response.data['hydra:member'].length === rowsPerPage
      ) {
        // reload if error
        // and reload if we are not on the last page to fill the space left by the deleted item
        load()
      }
    },
    [load, remove, response, rowsPerPage, updateList]
  )

  const operations = useMemo(() => {
    const operations: IResourceEditableOperations<T> = {}
    if (update) {
      operations.update = editableUpdate
      operations.massUpdate = massEditableUpdate
    }
    if (create) {
      operations.create = editableCreate
    }
    if (replace) {
      operations.replace = editableReplace
    }
    if (remove) {
      operations.remove = editableRemove
    }
    return operations
  }, [
    create,
    editableCreate,
    editableRemove,
    editableReplace,
    editableUpdate,
    massEditableUpdate,
    remove,
    replace,
    update,
  ])

  return [response, operations]
}
