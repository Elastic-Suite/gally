/* eslint-disable @typescript-eslint/no-namespace */
import { CSSProperties } from 'react'
import { JSX as IonIconJSX } from 'ionicons'
import { JSXBase } from 'ionicons/dist/types/stencil-public-runtime'

type IIonIconProps = Omit<
  IonIconJSX.IonIcon & JSXBase.HTMLAttributes<HTMLIonIconElement>,
  'style'
> & { style?: CSSProperties }

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface IntrinsicElements {
      'ion-icon': IIonIconProps
    }
  }
}

interface IProps extends IIonIconProps {
  name: string
}

export const customIcons = [
  'dashboard',
  'analyze',
  'merchandize',
  'monitoring',
  'settings',
]

/*
 * Creation of special props to be clean on Typescripts files
 * See: https://github.com/ionic-team/ionicons
 *
 * Setup switch for special names that need svg or have another name in ion-icons
 */
function Icon(props: IProps) {
  const { name, ...iconProps } = props
  switch (name) {
    case 'dashboard':
      return <ion-icon src="/images/home2.svg" {...iconProps} />
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
