import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

const useStylesUserMenuShow = makeStyles((theme: Theme) => ({
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

function UserMenuShow() {
  const usermenushowstyle = useStylesUserMenuShow()

  return (
    <div className={usermenushowstyle.typoTexte}>
      <div className={usermenushowstyle.typoUsername}>Admin name</div>
      <div className={usermenushowstyle.typoEmail}>adminame@mail.com</div>
      <hr className={usermenushowstyle.hr} />
      <div className={usermenushowstyle.typoBasic}>Account</div>
      <div className={usermenushowstyle.typoBasic}>Log out</div>
    </div>
  )
}

export default UserMenuShow
