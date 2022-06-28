import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import Help from '~/components/atoms/help/Help'
import UserMenu from '~/components/atoms/user/UserMenu'

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
      <Help />
      <UserMenu />
    </div>
  )
}

export default User
