import Button from '@mui/material/Button'
import useCommonButtonStyle from '~/components/atoms/buttons/CommonButtonStyle'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

const useSecondaryButtonStyle = makeStyles((theme: Theme) => ({
  root: {
    color: theme.palette.colors.secondary['600'],
    background: theme.palette.colors.secondary['100'],
    boxShadow: theme.palette.colors.shadow.secondaryButton.sm,
    '&::before': {
      background: theme.palette.colors.secondary['200'],
      boxShadow: theme.palette.colors.shadow.secondaryButton.md,
    },
    '&:hover': {
      background: theme.palette.colors.secondary['100'],
      boxShadow: theme.palette.colors.shadow.secondaryButton.sm,
    },
    '&& .MuiTouchRipple-child': {
      backgroundColor: theme.palette.colors.secondary['300'],
    },
  },
}))

const SecondaryButton = (props) => {
  const CommonButtonStyle = useCommonButtonStyle()
  const secondaryButtonStyle = useSecondaryButtonStyle()
  return (
    <Button
      {...props}
      className={CommonButtonStyle.root + ' ' + secondaryButtonStyle.root}
      variant="contained"
    >
      {props.children}
    </Button>
  )
}

export default SecondaryButton
