export interface IOption {
  disabled?: boolean
  id?: string | number
  label: string
  value: unknown
  default?: boolean
}

export type IOptions = IOption[]
