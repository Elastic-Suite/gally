import { IField } from './api'
import { DataContentType } from './customTables'
import { IOptions } from './option'

export interface IFieldGuesserProps {
  dirty?: boolean
  editable?: boolean
  field?: IField
  name: string
  label?: string
  multiple?: boolean
  onChange?: (name: string, value: unknown) => void
  options?: IOptions<unknown> | null
  type?: DataContentType
  useDropdownBoolean?: boolean
  value: unknown
  required?: boolean
}
