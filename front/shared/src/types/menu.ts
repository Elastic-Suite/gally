export interface IMenuChild {
  code: string
  label: string
  children?: IMenuChild[]
}

export interface IMenu {
  hierarchy: IMenuChild[]
}
