import { styled } from '@mui/system'
import { IUser, storageRemove, tokenStorageKey } from 'shared'
import { setUser, useAppDispatch } from '~/store'
import NoFullString from '../noFullString/NoFullString'

const CustomTypoTexte = styled('div')(({ theme }) => ({
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '12px',
  lineHeight: '18px',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Inter',
  gap: theme.spacing(1),
}))

const CustomTypoEmail = styled('div')(({ theme }) => ({
  fontWeight: '400',
  color: theme.palette.colors.neutral['600'],
}))

const CustomTypoBasic = styled('div')(({ theme }) => ({
  fontWeight: '400',
  color: theme.palette.colors.neutral['800'],
  cursor: 'pointer',
}))

const CustomHr = styled('div')(({ theme }) => ({
  width: '100%',
  border: '1px solid',
  margin: 0,
  borderColor: theme.palette.colors.neutral['300'],
}))

interface IProps {
  user: IUser
}

function UserMenuShow({ user }: IProps): JSX.Element {
  const dispatch = useAppDispatch()

  function handleLogOut(): void {
    storageRemove(tokenStorageKey)
    dispatch(setUser({ token: '', user: null }))
  }

  return (
    <CustomTypoTexte>
      <CustomTypoEmail>
        <NoFullString name={user.username} toolTip firstLetterUpp />
      </CustomTypoEmail>
      <CustomHr />
      <CustomTypoBasic onClick={handleLogOut}>Log out</CustomTypoBasic>
    </CustomTypoTexte>
  )
}

export default UserMenuShow
