import { Theme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'

const useStylesHelpOver = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(1.5),
    paddingLeft: theme.spacing(1.5),
  },
  texte: {
    color: theme.palette.colors.neutral['800'],
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '18px',
  },
}))

function HelpOver() {
  const helpoverstyle = useStylesHelpOver()

  return (
    <div className={helpoverstyle.root + ' ' + helpoverstyle.texte}>
      <div>Helpdesk</div>
      <div>User guide</div>
    </div>
  )
}

export default HelpOver
