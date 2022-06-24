import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import HelpOver from '~/components/atoms/user/helpOver'
import UserMenu from '~/components/atoms/user/userMenu'

const useStylesUser = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
}))

function User() {
  const userstyle = useStylesUser()

  return (
    <div className={userstyle.root}>
      <HelpOver />
      <UserMenu />
    </div>
  )
}

export default User
