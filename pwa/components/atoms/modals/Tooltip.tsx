import { Tooltip as MuiTooltip, TooltipProps } from '@mui/material'

function Tooltip(props: TooltipProps): JSX.Element {
  const { className, ...tooltipProps } = props

  return <MuiTooltip {...tooltipProps} classes={{ popper: className }} />
}

export default Tooltip
