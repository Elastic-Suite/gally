import { styled } from '@mui/system'
import {
  Tooltip as MuiTooltip,
  TooltipProps,
  tooltipClasses,
} from '@mui/material'

const StyledTooltip = styled(MuiTooltip)(({ theme }) => ({
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

function Tooltip(props: TooltipProps): JSX.Element {
  const { className, ...tooltipProps } = props
  return (
    <StyledTooltip {...tooltipProps} arrow classes={{ popper: className }} />
  )
}

export default Tooltip
