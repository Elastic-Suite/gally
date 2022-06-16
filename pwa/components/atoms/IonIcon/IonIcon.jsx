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
    switch (props.name) {
        case 'dashboard':
            return <ion-icon src={home2.src} style={props.style} />
        case 'analyze':
            return <ion-icon name={'analytics'} style={props.style} />
        case 'merchandize':
            return <ion-icon name={'funnel-outline'} style={props.style} />
        case 'monitoring':
            return <ion-icon name={'list'} style={props.style} />
        case 'settings':
            return <ion-icon name={'settings-outline'} style={props.style} />
        default:
            return <ion-icon name={props.name} style={props.style} />
    }
}

export default IonIcon
