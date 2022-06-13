import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

const useStylesUserMenu = makeStyles((theme: Theme) => ({
  typoTexte: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  typoUsername: {
    fontWeight: '600',
    color: theme.palette.colors.neutral['800'],
  },
  typoEmail: {
    fontWeight: '400',
    color: theme.palette.colors.neutral['600'],
  },
  typoBasic: {
    fontWeight: '400',
    color: theme.palette.colors.neutral['800'],
  },
  hr: {
    width: '100%',
    border: '1px solid',
    margin: 0,
    borderColor: theme.palette.colors.neutral['300'],
  },
}))

const UserMenu = () => {
  const usermenustyle = useStylesUserMenu()

  return (
    <div className={usermenustyle.typoTexte}>
      <div className={usermenustyle.typoUsername}>Admin name</div>
      <div className={usermenustyle.typoEmail}>adminame@mail.com</div>
      <hr className={usermenustyle.hr} />
      <div className={usermenustyle.typoBasic}>Account</div>
      <div className={usermenustyle.typoBasic}>Log out</div>
    </div>
  )
}

export default UserMenu
