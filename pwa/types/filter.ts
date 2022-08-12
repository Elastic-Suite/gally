import { DataContentType } from './customTables'
import { IOptions } from './option'

export interface IFilter {
  id: string
  label: string
  multiple?: boolean
  options?: IOptions<unknown>
  type?: DataContentType
}
