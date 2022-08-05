import { Method } from './fetch'
import { IGraphqlField } from './graphql'
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

export interface IApi {
  graphqlFields: IGraphqlField[]
  resources: IResource[]
}
