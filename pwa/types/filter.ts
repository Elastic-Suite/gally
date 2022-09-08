import { IField } from './api'
import { DataContentType } from './customTables'
import { IOptions } from './option'

export interface IFilter {
  field: IField
  id: string
  label: string
  multiple?: boolean
  options?: IOptions<unknown>
  type?: DataContentType
}
