import { styled } from '@mui/system'

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

const CustomTypoUsername = styled('div')(({ theme }) => ({
  fontWeight: '600',
  color: theme.palette.colors.neutral['800'],
}))

const CustomTypoEmail = styled('div')(({ theme }) => ({
  fontWeight: '400',
  color: theme.palette.colors.neutral['600'],
}))

const CustomTypoBasic = styled('div')(({ theme }) => ({
  fontWeight: '400',
  color: theme.palette.colors.neutral['800'],
}))

const CustomHr = styled('div')(({ theme }) => ({
  width: '100%',
  border: '1px solid',
  margin: 0,
  borderColor: theme.palette.colors.neutral['300'],
}))

function UserMenuShow(): JSX.Element {
  return (
    <CustomTypoTexte>
      <CustomTypoUsername>Admin name</CustomTypoUsername>
      <CustomTypoEmail>adminame@mail.com</CustomTypoEmail>
      <CustomHr />
      <CustomTypoBasic>Account</CustomTypoBasic>
      <CustomTypoBasic>Log out</CustomTypoBasic>
    </CustomTypoTexte>
  )
}

export default UserMenuShow
