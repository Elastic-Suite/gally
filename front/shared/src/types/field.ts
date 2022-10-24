import { SyntheticEvent } from 'react'

import { IField } from './api'
import { DataContentType } from './customTables'
import { IOptions } from './option'

export interface IFieldGuesserProps {
  diffValue?: unknown
  editable?: boolean
  field?: IField
  input?: DataContentType
  name: string
  label?: string
  multiple?: boolean
  onChange?: (name: string, value: unknown, event?: SyntheticEvent) => void
  options?: IOptions<unknown> | null
  required?: boolean
  type?: DataContentType
  useDropdownBoolean?: boolean
  validation?: Record<string, string | number>
  value: unknown
}
