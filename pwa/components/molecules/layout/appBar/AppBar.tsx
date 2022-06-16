import { makeStyles } from '@mui/styles'
import BreadCrumb from '~/components/atoms/breadcrumb/BreadCrumb.tsx'
import User from '~/components/molecules/layout/user/User.tsx'
import { Theme } from '@mui/material/styles'

const useStylesAppBar = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    position: 'fixed',
    right: 0,
    zIndex: '9',
    height: theme.spacing(8),
    backgroundColor: theme.palette.colors.neutral['100'],
    left: 'inherit',

    '&::before': {
      content: '""',
      position: 'absolute',
      border: '1px solid',
      borderColor: theme.palette.colors.neutral['300'],
      bottom: 0,
      width: `calc(100% - 64px)`,
    },
  },
}))

const AppBar = () => {
  const appbarstyle = useStylesAppBar()
  return (
    <div className={appbarstyle.root}>
      <BreadCrumb />
      <User />
    </div>
  )
}

export default AppBar
