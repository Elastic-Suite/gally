import { AppBar, Layout } from 'react-admin'
import IonIcon from 'components/atoms/IonIcon'

/*
 * TODO: THIBO: Create complete Layout to set Menu + AppBar + Body
 * Custom Layout to implement blueprints
 * See: https://marmelab.com/react-admin/Theming.html#using-a-custom-layout
 */
const MyAppBar = (props) => (
  <AppBar {...props} userMenu={<IonIcon name="person" />} />
)

const CustomLayout = (props) => <Layout {...props} appBar={MyAppBar} />

export default CustomLayout
