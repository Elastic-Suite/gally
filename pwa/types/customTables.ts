import { IOptions } from '~/components/atoms/form/DropDown'

export enum MassiveSelectionType {
  ALL = 'massiveselection.all',
  ALL_ON_CURRENT_PAGE = 'massiveselection.allOnCurrentPage',
  NONE = 'massiveselection.none',
}

export interface ITableHeader {
  field: string
  headerName: string
  type: DataContentType
  editable: boolean
  sticky: boolean
  options: IOptions | null
}

export enum DataContentType {
  STRING = 'string',
  BOOLEAN = 'boolean',
  TAG = 'tag',
  LABEL = 'label',
  DROPDOWN = 'dropdown',
}

export interface ITableRow {
  id: string
  [key: string]: string | boolean | number
}

export interface IHorizontalOverflow {
  isOverflow: boolean
  shadow: boolean
}

export interface ITableHeaderSticky extends ITableHeader {
  isLastSticky: boolean
}
