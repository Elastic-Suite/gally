import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button'
import { Theme, styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import PropTypes from 'prop-types'

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.colors.neutral['900'],
    fontSize: 12,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
}))

const Tooltips = ({ hoverDesc, placement, desc }) => {
  return (
    <LightTooltip title={hoverDesc} placement={placement}>
      <span>{desc}</span>
    </LightTooltip>
  )
}

Tooltips.propTypes = {
  hoverDesc: PropTypes.string,
  placement: PropTypes.string,
  desc: PropTypes.any,
}

Tooltips.defaultProps = {
  placement: 'left', // show all possibility of placement : https://codesandbox.io/s/43zvk1?file=/demo.tsx
}
export default Tooltips
