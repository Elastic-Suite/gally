import Button from '@mui/material/Button'
import CommonButtonStyle from "~/components/atoms/buttons/CommonButtonStyle";
import RegularTheme from '~/components/atoms/RegularTheme'
import _ from "lodash";

const tertiaryButtonStyle = _.merge(
  { ...CommonButtonStyle },
  {
    color: RegularTheme.palette.colors.neutral['900'],
    background: 'none',
    boxShadow: 'none',
    '&::before': {
      backgroundColor: RegularTheme.palette.colors.neutral['200'],
      boxShadow: 'none',
    },
    '&:hover': {
      background: 'none',
      boxShadow: 'none',
    },
    '&& .MuiTouchRipple-child': {
      backgroundColor: RegularTheme.palette.colors.neutral['300'],
    },
  }
);

const TertiaryButton = (props) => {
  return (
    <Button {...props}
            sx={tertiaryButtonStyle}
            variant="contained"
    >
      {props.children}
    </Button>
  )
}

export default TertiaryButton
