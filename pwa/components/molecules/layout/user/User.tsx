import Help from '~/components/atoms/help/Help'
import UserMenu from '~/components/atoms/user/UserMenu'
import { styled } from '@mui/system'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
}))

function User(): JSX.Element {
  return (
    <CustomRoot>
      <Help />
      <UserMenu />
    </CustomRoot>
  )
}

export default User
