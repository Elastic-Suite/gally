import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import HelpOver from '~/components/atoms/user/helpOver.tsx'
import UserMenu from '~/components/atoms/user/userMenu.tsx'

const useStylesUser = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
  },
}))

const User = () => {
  const userstyle = useStylesUser()

  return (
    <div className={userstyle.root}>
      <HelpOver />
      <UserMenu />
    </div>
  )
}

export default User
