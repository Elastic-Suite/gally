import ionIcons from 'ionicons/dist/ionicons.json'

import { customIcons } from '~/components/atoms/IonIcon/IonIcon'

export const icons = ionIcons.icons.map(icon => icon.name).concat(customIcons).sort()
