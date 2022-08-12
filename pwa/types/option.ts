export interface IOption<T> {
  disabled?: boolean
  id?: string | number
  label: string
  value: unknown
  default?: T
}

export type IOptions<T> = IOption<T>[]
