import { IJsonldId, IJsonldType } from './hydra'

export interface ITreeItem extends IJsonldId, IJsonldType {
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

export type ICategoriesFields = ITreeItem[]
