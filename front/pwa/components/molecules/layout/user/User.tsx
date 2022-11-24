import Help from '~/components/atoms/help/Help'
import UserMenu from '~/components/atoms/userMenu/UserMenu'
import { styled } from '@mui/system'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  marginLeft: 'auto',
}))

interface IProps {
  isConnectedWithValidJwt: boolean
}

function User({ isConnectedWithValidJwt }: IProps): JSX.Element | null {
  if (!isConnectedWithValidJwt) return null
  return (
    <CustomRoot>
      <Help />
      <UserMenu />
    </CustomRoot>
  )
}

export default User
