import { IField } from './api'
import { IOptions } from './option'

export enum MassiveSelectionType {
  ALL = 'massiveselection.all',
  ALL_ON_CURRENT_PAGE = 'massiveselection.allOnCurrentPage',
  NONE = 'massiveselection.none',
}

export enum DataContentType {
  BOOLEAN = 'boolean',
  IMAGE = 'image',
  LABEL = 'label',
  NUMBER = 'number',
  PRICE = 'price',
  RANGE = 'range',
  SCORE = 'score',
  SELECT = 'select',
  STOCK = 'stock',
  STRING = 'string',
  TAG = 'tag',
}

export interface ITableHeader {
  boostInfos?: IBoost
  editable?: boolean
  field?: IField
  input?: DataContentType
  label: string
  name: string
  options?: IOptions<unknown> | null
  required?: boolean
  sticky?: boolean
  suffix?: string
  type?: DataContentType
  validation?: Record<string, string | number>
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
  [key: string]: string | boolean | number | IScore | IStock | IPrice[]
}

export interface IHorizontalOverflow {
  isOverflow: boolean
  shadow: boolean
}

export interface ITableHeaderSticky extends ITableHeader {
  isLastSticky: boolean
}

export type BoostType = 'up' | 'down' | 'no boost'

export interface IBoost {
  type: BoostType
  boostNumber: number
  boostMultiplicator: number
}

export interface IStock {
  status: boolean
  qty?: number
}

export interface IScore {
  scoreValue: number
  boostInfos?: IBoost
}

export interface IPrice {
  price: number
}
