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
  replace?: (item: Omit<T, '@id' | '@type'>) => Promise<T | IFetchError>
  update?: (id: string | number, item: Partial<T>) => Promise<T | IFetchError>
  delete?: (id: string | number) => Promise<T | IFetchError>
}
