import Help from '~/components/atoms/help/Help'
import UserMenu from '~/components/atoms/userMenu/UserMenu'
import { styled } from '@mui/system'
import { useContext } from 'react'
import { userContext } from '~/contexts'
import { isValidUser } from '~/../shared'

const CustomRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  marginLeft: 'auto',
}))

function User(): JSX.Element | null {
  const user = useContext(userContext)
  const isConnected = isValidUser(user)

  if (!isConnected) return
  return (
    <CustomRoot>
      <Help />
      <UserMenu />
    </CustomRoot>
  )
}

export default User
