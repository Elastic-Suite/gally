import { IField } from './api'
import { IOptions } from './option'

export enum MassiveSelectionType {
  ALL = 'massiveselection.all',
  ALL_ON_CURRENT_PAGE = 'massiveselection.allOnCurrentPage',
  NONE = 'massiveselection.none',
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

export interface ITableHeader {
  name: string
  label: string
  type?: DataContentType
  editable?: boolean
  field?: IField
  sticky?: boolean
  options?: IOptions<unknown> | null
  boostInfos?: IBoost
  required?: boolean
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

export interface ITableRow {
  id: string | number
  [key: string]: string | boolean | number | IScore | IStock
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

export interface IStock {
  status: boolean
  qty: number
}
