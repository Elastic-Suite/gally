import { Method } from './fetch'
import { IHydraMember } from './hydra'
import { IJsonldBase, IJsonldId, IJsonldType } from './jsonld'

export interface IProperty extends IJsonldBase {
  domain: IJsonldId
  label: string
  range?: IJsonldId
  showable?: boolean
}

export interface IField extends IJsonldType {
  description?: string
  property: IProperty
  readable: boolean
  required: boolean
  title: string
  writeable: boolean
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
  create?: (item: Omit<T, 'id' | '@id' | '@type'>) => Promise<T>
  replace?: (item: Omit<T, '@id' | '@type'>) => Promise<T>
  update?: (id: string | number, item: Partial<T>) => Promise<T>
  delete?: (id: string | number) => Promise<void>
}
