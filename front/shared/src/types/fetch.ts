import { IResource } from './api'
import { IError } from './network'

export enum LoadStatus {
  FAILED,
  IDLE,
  LOADING,
  SUCCEEDED,
}

export interface IFetch<D> {
  data?: D
  error?: Error
  status: LoadStatus
}

export interface IGraphqlResponse<D> {
  data: D
}

export type ISearchParameters = Record<
  string,
  string | number | boolean | (string | number | boolean)[]
>

export type IFetchApi<T> = (
  resource: IResource | string,
  searchParameters?: ISearchParameters,
  options?: RequestInit
) => Promise<T | IError>
