import { MutableRefObject } from 'react'

import { IField } from './api'
import { LoadStatus } from './fetch'

export interface IOption<T> {
  disabled?: boolean
  id?: string | number
  label: string
  value: T
  default?: boolean
}

export type IOptions<T> = IOption<T>[]

export type IFieldOptions = Map<string, IOptions<string | number>>

export type ILoadStatuses = Map<string, LoadStatus>

export interface IOptionsContext {
  load: (field: IField) => void
  fieldOptions: IFieldOptions
  statuses: MutableRefObject<ILoadStatuses>
}

export interface IApiSchemaOptions {
  code: string
  label: string
}
