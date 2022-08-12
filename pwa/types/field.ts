import { DataContentType } from './customTables'
import { IOptions } from './option'

export interface IFieldGuesserProps {
  editable?: boolean
  name: string
  label?: string
  multiple?: boolean
  onChange?: (name: string, value: unknown) => void
  options?: IOptions<unknown> | null
  type?: DataContentType
  useDropdownBoolean?: boolean
  value: unknown
}
