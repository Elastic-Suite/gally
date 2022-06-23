/* eslint-disable @typescript-eslint/naming-convention */
import { DOMAttributes, ReactChild } from 'react'
import { Components } from 'ionicons'

import home2 from '~/assets/images/home2.svg'

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: ReactChild }>

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      ['ion-icon']: CustomElement<Components.IonIcon>
    }
  }
}

export const customIcons = [
  'dashboard',
  'analyze',
  'merchandize',
  'monitoring',
  'settings',
]

interface IProps extends Components.IonIcon {
  name: string
}

/*
 * Creation of special props to be clean on Typescripts files
 * See: https://github.com/ionic-team/ionicons
 *
 * Setup switch for special names that need svg or have another name in ion-icons
 */
const Icon = (props: IProps) => {
  const { name, ...iconProps } = props
  switch (name) {
    case 'dashboard':
      return <ion-icon src={home2.src} {...iconProps} />
    case 'analyze':
      return <ion-icon name="analytics" {...iconProps} />
    case 'merchandize':
      return <ion-icon name="funnel-outline" {...iconProps} />
    case 'monitoring':
      return <ion-icon name="list" {...iconProps} />
    case 'settings':
      return <ion-icon name="settings-outline" {...iconProps} />
    default:
      return <ion-icon name={name} {...iconProps} />
  }
}

export default Icon
