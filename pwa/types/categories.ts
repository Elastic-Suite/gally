export interface ICategory {
  id: number
  isVirtual: boolean
  name: string
  path: string
  children?: ICategory[]
  level: number
}

export type ICategories = ICategory[]
