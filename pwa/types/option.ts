import { IField } from './api'

export interface IOption<T> {
  disabled?: boolean
  id?: string | number
  label: string
  value: unknown
  default?: T
}

export type IOptions<T> = IOption<T>[]

export type IFieldOptions = Map<string, IOptions<string | number>>

export interface IOptionsContext {
  load: (field: IField) => void
  fieldOptions: IFieldOptions
}

export interface IApiSchemaOptions {
  code: string
  label: string
}
