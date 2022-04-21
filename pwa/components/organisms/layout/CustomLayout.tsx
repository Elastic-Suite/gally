import { AppBar, UserMenu, Notification } from 'react-admin'
import IonIcon from 'components/atoms/IonIcon'
import PropTypes from 'prop-types'
import { ThemeProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import RegularTheme from '~/components/atoms/RegularTheme'
import CustomSidebar from '~/components/molecules/layout/CustomSidebar'

/*
 * TODO: THIBO: Update AppBar
 * Custom Layout to implement blueprints
 * See: https://marmelab.com/react-admin/Theming.html#using-a-custom-layout
 */

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1,
    minHeight: '100vh',
    backgroundColor: RegularTheme.palette.background.default,
    position: 'relative',
  },
  appFrame: {
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
  },
  contentWithAppbar: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    width: 'auto',
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
    marginTop: RegularTheme.spacing(2),
    paddingLeft: RegularTheme.spacing(4),
    paddingRight: RegularTheme.spacing(4),
  },
}))
const useStylesAppBar = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    width: 'auto',
    position: 'unset',
  },
}))

const CustomLayout = ({ children, dashboard, logout, title }) => {
  const classes = useStyles()
  const appbar = useStylesAppBar()
  return (
    <ThemeProvider theme={RegularTheme}>
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <CustomSidebar className={classes.sidebar} dashboard={dashboard} />
          <div className={classes.contentWithAppbar}>
            <AppBar
              classes={appbar}
              userMenu={<UserMenu icon={<IonIcon name="person" />} />}
            />
            <div className={classes.content}>{children}</div>
          </div>
          <Notification />
        </div>
      </div>
    </ThemeProvider>
  )
}

CustomLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
}

export default CustomLayout
