import { IOptions } from './option'

export enum MassiveSelectionType {
  ALL = 'massiveselection.all',
  ALL_ON_CURRENT_PAGE = 'massiveselection.allOnCurrentPage',
  NONE = 'massiveselection.none',
}

export interface ITableHeader {
  field: string
  headerName: string
  type: DataContentType
  editable?: boolean
  sticky?: boolean
  options?: IOptions | null
  boostInfos?: IBoost
}

export interface IBaseStyle {
  left: string
  backgroundColor: string
  zIndex: string
}

export interface INonStickyStyle {
  borderBottomColor: string
  backgroundColor: string
  overflow?: string
}

export interface ISelectionStyle extends IBaseStyle {
  stickyBorderStyle?: IStickyBorderStyle
}

export interface IStickyStyle extends IBaseStyle {
  minWidth: string
  stickyBorderStyle?: IStickyBorderStyle
  overflow?: string
}
export interface IDraggableColumnStyle extends IBaseStyle {
  minWidth: string
  borderRight?: string
  stickyBorderStyle?: IStickyBorderStyle
}

export interface IStickyBorderStyle {
  borderBottomColor: string
  borderRight: string
  borderRightColor: string
  boxShadow?: string
  clipPath?: string
}

export enum DataContentType {
  STRING = 'string',
  BOOLEAN = 'boolean',
  TAG = 'tag',
  LABEL = 'label',
  DROPDOWN = 'dropdown',
  IMAGE = 'image',
  SCORE = 'score',
  STOCK = 'stock',
  PRICE = 'price',
  NUMBER = 'number',
}

export interface ITableRow {
  id: string | number
  [key: string]: string | boolean | number | IScore
}

export interface IHorizontalOverflow {
  isOverflow: boolean
  shadow: boolean
}

export interface ITableHeaderSticky extends ITableHeader {
  isLastSticky: boolean
}

export interface IBoost {
  type: 'up' | 'down' | 'no boost'
  boostNumber: number
  boostMultiplicator: number
}

export interface IScore {
  scoreValue: number
  boostInfos?: IBoost
}

export type BoostType = 'up' | 'down' | 'no boost'
