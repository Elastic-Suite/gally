export enum HttpCode {
  OK = '200',
  CREATED = '201',
  NO_CONTENT = '204',
  BAD_REQUEST = '400',
  NOT_FOUND = '404',
  UNPROCESSABLE_ENTITY = '422',
}

export enum Method {
  DELETE = 'DELETE',
  GET = 'GET',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
}

export enum LoadStatus {
  FAILED,
  IDLE,
  LOADING,
  SUCCEEDED,
}

export interface IFetch<D> {
  data?: D
  error?: Error | string
  status: LoadStatus
}

export type ISearchParameters = Record<
  string,
  string | number | boolean | (string | number | boolean)[]
>
