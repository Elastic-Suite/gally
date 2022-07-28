import { IOptions } from './option'

export enum FilterType {
  BOOLEAN,
  TEXT,
  SELECT,
}

export interface IFilter {
  id: string
  label: string
  multiple?: boolean
  options?: IOptions
  type?: FilterType
}
