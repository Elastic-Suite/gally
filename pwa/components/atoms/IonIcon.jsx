import React from "react"
import home2 from "~/assets/images/home2.svg"
import resizeMenu from "~/assets/images/resize-menu.svg"

/*
 * Creation of special props to be clean on Typescripts files
 * See: https://github.com/ionic-team/ionicons
 *
 * Setup switch for special names that need svg or have another name in ion-icons
 */
const IonIcon = (props) => {
    let icon = <></>
    switch (props.name) {
        case "dashboard":
            icon = <ion-icon src={home2.src} style={props.style} />
            break
        case "analyze":
            icon = <ion-icon name={"analytics"} style={props.style} />
            break
        case "merchandize":
            icon = <ion-icon name={"funnel-outline"} style={props.style} />
            break
        case "monitoring":
            icon = <ion-icon name={"list"} style={props.style} />
            break
        case "settings":
            icon = <ion-icon name={"settings-outline"} style={props.style} />
            break
        case "resize-menu":
            icon = <ion-icon src={resizeMenu.src} style={props.style} />
            break
        default:
            icon = <ion-icon name={props.name} style={props.style} />
    }
    return icon
}

export default IonIcon
