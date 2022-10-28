import { SyntheticEvent } from 'react'

import { IField } from './api'
import { DataContentType } from './customTables'
import { IOptions } from './option'

export interface IFieldConfig {
  editable?: boolean
  field?: IField
  id: string
  input?: DataContentType
  label?: string
  name: string
  multiple?: boolean
  options?: IOptions<unknown> | null
  required?: boolean
  suffix?: string
  type?: DataContentType
  validation?: Record<string, string | number>
}

export interface IFieldGuesserProps extends IFieldConfig {
  diffValue?: unknown
  onChange?: (name: string, value: unknown, event?: SyntheticEvent) => void
  showError?: boolean
  useDropdownBoolean?: boolean
  value: unknown
}
