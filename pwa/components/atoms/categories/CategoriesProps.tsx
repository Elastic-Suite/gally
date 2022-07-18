export interface ICategoriesPropsItem {
  isVirtual: boolean
  name: string
  path: string
  children?: ICategoriesPropsItem[]
  level: number
}
