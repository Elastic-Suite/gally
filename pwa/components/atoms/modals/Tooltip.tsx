import { styled } from '@mui/material/styles'
import {
  Tooltip as MuiTooltip,
  TooltipProps,
  tooltipClasses,
} from '@mui/material'

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MuiTooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.colors.neutral['900'],
    fontSize: 12,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
}))

export default Tooltip
