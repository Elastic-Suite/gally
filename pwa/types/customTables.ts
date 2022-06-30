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
}

export enum DataContentType {
  STRING = 'string',
  BOOLEAN = 'boolean',
}

export interface ITableRow {
  id: string
  [key: string]: string | boolean | number
}
