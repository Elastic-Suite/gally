export enum MassiveSelectionType {
  ALL = 'massiveselection.all',
  ALL_ON_CURRENT_PAGE = 'massiveselection.allOnCurrentPage',
  NONE = 'massiveselection.none',
}
export interface ITableRow {
  id: string
  cells: ITableCell[]
}

export enum DataContentType {
  STRING = 'string',
  BOOLEAN = 'boolean',
}
export interface ITableCell {
  id: string
  value: string | boolean
  type: DataContentType
  isEditable: boolean
}
