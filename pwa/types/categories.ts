import { IJsonldId, IJsonldType } from './hydra'

export interface ITreeItem {
  catalogCode?: string
  catalogName?: string
  categories?: ITreeItem[]
  isVirtual?: boolean
  name?: string
  path?: string
  level?: number
  id?: number | string
  children?: ITreeItem[]
}

export interface ICategories extends IJsonldType, IJsonldId {
  catalogCode?: string
  catalogName?: string
  categories?: ITreeItem[]
  isVirtual?: boolean
  name?: string
  path?: string
  level?: number
  id: number
  children?: ITreeItem[]
}
