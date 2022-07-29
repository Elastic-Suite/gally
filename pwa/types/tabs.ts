import { ReactChild } from 'react'

export interface ITab {
  content: ReactChild | string
  id: number
  label: string
}

export interface IRouterTab extends ITab {
  actions?: JSX.Element
  default?: true
  url: string
}
