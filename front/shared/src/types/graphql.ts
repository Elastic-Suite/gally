import { IError } from './network'

export interface IGraphqlNode<T> {
  node: T
}

export interface IGraphqlEdges<T> {
  edges: IGraphqlNode<T>[]
}

export interface IGraphqlErrorLocation {
  line: number
  column: number
}

export interface IGraphqlExtensions {
  argumentName?: string
  category?: string
  code?: string
  exception?: {
    stacktrace: string[]
  }
}

export interface IGraphqlTrace {
  call: string
  file: string
  line: number
}

export interface IGraphqlError {
  debugMessage?: string
  message: string
  extensions: IGraphqlExtensions
  locations: IGraphqlErrorLocation[]
  path?: string[]
  trace?: IGraphqlTrace[]
}

export interface IGraphql<D> {
  data?: D
  errors?: IGraphqlError[]
}

export type IGraphqlApi<T> = (
  query: string,
  variables?: Record<string, unknown>,
  options?: RequestInit
) => Promise<T | IError>
