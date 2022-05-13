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
import ButtonsPreview from '~/components/atoms/buttons/ButtonsPreview'

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
    position: 'fixed',
    top: theme.spacing(6),
    background: theme.palette.background.paper,
    border: '1px solid #E2E6F3',
    boxSizing: 'border-box',
    borderRadius: theme.spacing(1.5),
    width: theme.spacing(3),
    height: theme.spacing(3),
    cursor: 'pointer',
    zIndex: '99',
  },
  rightBar: {
    borderRight: '1px solid #E2E6F3',
    boxSizing: 'unset',
    height: '100vh',
    overflowY: 'scroll',
    position: 'fixed',
    top: '0',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      width: 0,
    },
  },

  toClose: {
    left: `calc(66px - 12px)`,
    transition: 'left linear',
  },

  toOpen: {
    left: `calc(279px - 12px)`,
    transition: 'left linear',
  },
}))
const useStylesAppBar = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'blue',
    color: 'white',
    position: 'fixed',
    width: '100%',
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
    setSidebarStateTimeout(sidebarState)
  }

  return (
    <ThemeProvider theme={RegularTheme}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <CustomSidebar />
          <div
            className={classes.contentWithAppbar + ' ' + classes.rightBar}
            style={{
              left: sidebarState ? '279px' : '66px',
            }}
          >
            <div
              className={
                classes.buttonCollapse +
                ' ' +
                (!sidebarState ? classes.toClose : classes.toOpen)
              }
              onClick={collapseSidebar}
            >
              <IonIcon name={'resize-menu'} style={{ width: 14, height: 14 }} />
            </div>
            <div className={appbar.root} style={{ zIndex: 99 }}>
              WIP : TO DO
            </div>
            <div className={classes.content}>
              {children}
              <ButtonsPreview />
            </div>
          </div>
          <Notification />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default CustomLayout
