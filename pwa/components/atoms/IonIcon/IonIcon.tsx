/* eslint-disable @typescript-eslint/no-namespace */
import { CSSProperties, MouseEvent } from 'react'
import { JSX as IonIconJSX } from 'ionicons'
import { JSXBase } from 'ionicons/dist/types/stencil-public-runtime'

export type IIonIconProps = Omit<
  IonIconJSX.IonIcon & JSXBase.HTMLAttributes<HTMLIonIconElement>,
  'style' | 'onClick'
> & {
  style?: CSSProperties
  onClick?: (event: MouseEvent<IIonIconProps>) => void
}

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
  tooltip?: boolean
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
function IonIcon(props: IProps): JSX.Element {
  const { name, tooltip, ...iconProps } = props
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
    case 'information':
      return (
        <ion-icon
          name="information-circle-outline"
          style={
            tooltip
              ? {
                  color: '#8187B9',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                }
              : { ...iconProps }
          }
        />
      )
    default:
      return <ion-icon name={name} {...iconProps} />
  }
}

export default IonIcon
