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

export const iconSrcMapping = {
  dashboard: '/images/home2.svg',
  arrow: '/images/arrow.svg',
  telescope: '/images/telescope-outline.svg',
}

export const iconAliasMapping = {
  analyze: 'analytics',
  informationCircle: 'information-circle-outline',
  merchandize: 'funnel-outline',
  minus: 'remove-circle',
  monitoring: 'list',
  more: 'add-circle',
  settings: 'settings-outline',
}
export const customIcons = [
  ...Object.keys(iconSrcMapping),
  ...Object.keys(iconAliasMapping),
]

/*
 * Creation of special props to be clean on Typescripts files
 * See: https://github.com/ionic-team/ionicons
 *
 * Setup switch for special names that need svg or have another name in ion-icons
 */
function IonIcon(props: IProps): JSX.Element {
  const { name, tooltip, ...other } = props
  const style = tooltip
    ? {
        color: '#8187B9',
        width: '20px',
        height: '20px',
        display: 'flex',
      }
    : {}
  const iconProps = { ...other, style: { ...style, ...other.style } }
  if (name in iconSrcMapping) {
    return (
      <ion-icon
        src={iconSrcMapping[name as keyof typeof iconSrcMapping]}
        {...iconProps}
      />
    )
  } else if (name in iconAliasMapping) {
    return (
      <ion-icon
        name={iconAliasMapping[name as keyof typeof iconAliasMapping]}
        {...iconProps}
      />
    )
  }
  return <ion-icon name={name} {...iconProps} />
}

export default IonIcon
