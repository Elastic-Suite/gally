import { IFetchError, Method } from './fetch'
import { IElasticSuiteProperty, IHydraMember } from './hydra'
import { IJsonldBase, IJsonldId, IJsonldType } from './jsonld'

export interface IProperty extends IJsonldBase {
  domain: IJsonldId
  label: string
  range?: IJsonldId
}

export interface IField extends IJsonldType {
  description?: string
  property: IProperty
  readable: boolean
  required: boolean
  title: string
  writeable: boolean
  elasticsuite?: IElasticSuiteProperty
}

export interface IOperation extends IJsonldType {
  expects?: string
  label: string
  method: Method
  returns: IJsonldId
  title: string
}

export interface IResource extends IJsonldBase {
  label: string
  supportedOperation: IOperation[]
  supportedProperty: IField[]
  title: string
  url: string
}

export type IApi = IResource[]

export interface IResponseError {
  code: number
  message: string
}

export interface IResourceOperations<T extends IHydraMember> {
  create?: (item: Omit<T, 'id' | '@id' | '@type'>) => Promise<T | IFetchError>
  remove?: (id: string | number) => Promise<T | IFetchError>
  replace?: (item: Omit<T, '@id' | '@type'>) => Promise<T | IFetchError>
  update?: (id: string | number, item: Partial<T>) => Promise<T | IFetchError>
}

export type IResourceEditableCreate<T> = (
  item: Omit<T, 'id' | '@id' | '@type'>
) => Promise<void>
export type IResourceEditableMassUpdate<T> = (
  ids: (string | number)[],
  item: Partial<T>
) => Promise<void>
export type IResourceEditableRemove = (id: string | number) => Promise<void>
export type IResourceEditableReplace<T> = (
  item: Omit<T, '@id' | '@type'>
) => Promise<void>
export type IResourceEditableUpdate<T> = (
  id: string | number,
  item: Partial<T>
) => Promise<void>

export interface IResourceEditableOperations<T extends IHydraMember> {
  create?: IResourceEditableCreate<T>
  massUpdate?: IResourceEditableMassUpdate<T>
  remove?: IResourceEditableRemove
  replace?: IResourceEditableReplace<T>
  update?: IResourceEditableUpdate<T>
}

export type ILoadResource = () => void
