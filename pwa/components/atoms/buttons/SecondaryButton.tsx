import Button from '@mui/material/Button'
import CommonButtonStyle from "~/components/atoms/buttons/CommonButtonStyle";
import RegularTheme from '~/components/atoms/RegularTheme'
import _ from "lodash";

const secondaryButtonStyle = _.merge(
  { ...CommonButtonStyle },
  {
    color: RegularTheme.palette.colors.secondary['600'],
    background: RegularTheme.palette.colors.secondary['100'],
    boxShadow: RegularTheme.palette.colors.shadow.secondaryButton.sm,
    '&::before': {
      background: RegularTheme.palette.colors.secondary['200'],
      boxShadow: RegularTheme.palette.colors.shadow.secondaryButton.md,
    },
    '&:hover': {
      background: RegularTheme.palette.colors.secondary['100'],
      boxShadow: RegularTheme.palette.colors.shadow.secondaryButton.sm
    },
    '&& .MuiTouchRipple-child': {
      backgroundColor: RegularTheme.palette.colors.secondary['300'],
    },
  }
);

const SecondaryButton = (props) => {
  return (
    <Button {...props}
            sx={secondaryButtonStyle}
            variant="contained"
    >
      {props.children}
    </Button>
  )
}

export default SecondaryButton
