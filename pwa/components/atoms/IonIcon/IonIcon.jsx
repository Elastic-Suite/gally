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
    const propsCleaned = { ...props }
    delete propsCleaned.name
    switch (props.name) {
        case 'dashboard':
            return <ion-icon src={home2.src} {...propsCleaned} />
        case 'analyze':
            return <ion-icon name={'analytics'} {...propsCleaned} />
        case 'merchandize':
            return <ion-icon name={'funnel-outline'} {...propsCleaned} />
        case 'monitoring':
            return <ion-icon name={'list'} {...propsCleaned} />
        case 'settings':
            return <ion-icon name={'settings-outline'} {...propsCleaned} />
        default:
            return <ion-icon name={props.name} {...propsCleaned} />
    }
}

export default IonIcon
