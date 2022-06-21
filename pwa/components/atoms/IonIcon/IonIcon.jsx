import React from 'react'
import home2 from '~/assets/images/home2.svg'

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
const IonIcon = (props) => {
    const { name, ...iconProps } = props
    switch (name) {
        case 'dashboard':
            return <ion-icon src={home2.src} {...iconProps} />
        case 'analyze':
            return <ion-icon name={'analytics'} {...iconProps} />
        case 'merchandize':
            return <ion-icon name={'funnel-outline'} {...iconProps} />
        case 'monitoring':
            return <ion-icon name={'list'} {...iconProps} />
        case 'settings':
            return <ion-icon name={'settings-outline'} {...iconProps} />
        default:
            return <ion-icon name={name} {...iconProps} />
    }
}

export default IonIcon
