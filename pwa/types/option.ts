export interface IOption {
  disabled?: boolean
  id?: string | number
  label: string
  value: unknown
}

export type IOptions = IOption[]
