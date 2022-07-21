export interface IOption {
  disabled?: boolean
  id?: string
  label: string
  value: unknown
}

export type IOptions = IOption[]
