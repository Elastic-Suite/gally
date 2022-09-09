export interface ITreeItem {
  id: number | string
  isVirtual: boolean
  name: string
  path: string
  level: number
  children?: ITreeItem[]
}
