import {
  AppBar,
  UserMenu,
  Notification,
  LayoutComponent,
  useSidebarState,
  useStore,
} from 'react-admin'
import IonIcon from 'components/atoms/IonIcon'
import { ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import RegularTheme from '~/components/atoms/RegularTheme'
import CustomSidebar from '~/components/molecules/layout/CustomSidebar'

/*
 * TODO: THIBO: Update AppBar
 * Custom Layout to implement blueprints
 * See: https://marmelab.com/react-admin/Theming.html#using-a-custom-layout
 */

/*
 * Use of mui makeStyles to create multiple styles reusing theme fm react-admin
 * see: https://mui.com/system/styles/basics/
 */
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
    position: 'relative',
  },
  appFrame: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    minHeight: '100vh',
  },
  contentWithAppbar: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    width: 'auto',
    position: 'relative',
  },
  appbar: {
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
    position: 'unset',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 2,
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  buttonCollapse: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: theme.spacing(-2),
    top: theme.spacing(6),
    background: theme.palette.background.paper,
    border: '1px solid #E2E6F3',
    boxSizing: 'border-box',
    borderRadius: theme.spacing(2),
    width: theme.spacing(4),
    height: theme.spacing(4),
    cursor: 'pointer',
  },
}))
const useStylesAppBar = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
    position: 'unset',
    backgroundColor: 'blue',
    color: 'white',
  },
}))

/*
 * Component CustomLayout with type LayoutComponent
 */
const CustomLayout: LayoutComponent = ({ children, title }) => {
  /*
   * useStore from ReactAdmin to store data globally
   * see: https://marmelab.com/react-admin/doc/4.0/Store.html
   */
  const [sidebarState, setSidebarState] = useSidebarState()
  const [sidebarStateTimeout, setSidebarStateTimeout] = useStore(
    'sidebarStateTimeout',
    sidebarState
  )

  const classes = useStyles()
  const appbar = useStylesAppBar()

  /*
   * Setup function to collapse sidebar when click on button
   */
  const collapseSidebar = () => {
    if (sidebarState) {
      setTimeout(() => {
        setSidebarState(!sidebarState)
      }, 500)
    } else {
      setSidebarState(!sidebarState)
    }

    // if (sidebarState) {
    //   setTimeout(() => {
    setSidebarStateTimeout(sidebarState)
    //   }, 500)
    // } else {
    //   setSidebarStateTimeout(sidebarState)
    // }
    console.log(sidebarState)
    console.log(sidebarStateTimeout)
  }

  return (
    <ThemeProvider theme={RegularTheme}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <CustomSidebar />
          <div className={classes.contentWithAppbar}>
            <div className={classes.buttonCollapse} onClick={collapseSidebar}>
              <IonIcon
                name={'code-outline'}
                style={{ width: 18, height: 18 }}
              />
            </div>
            <div className={appbar.root}>grhfgv</div>
            <div className={classes.content}>{children}</div>
          </div>
          <Notification />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default CustomLayout
