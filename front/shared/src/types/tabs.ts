import { FunctionComponent } from 'react'

export interface ITabContentProps {
  active?: boolean
}

export interface ITab<P = ITabContentProps> {
  Component: FunctionComponent<P>
  componentProps?: Omit<P, 'active'>
  id: number
  label: string
}

export interface IRouterTab extends ITab {
  actions?: JSX.Element
  default?: true
  url: string
}
