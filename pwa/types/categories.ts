import { IJsonldBase } from './jsonld'

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

export interface ICategories extends IJsonldBase {
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
