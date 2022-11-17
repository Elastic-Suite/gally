import {
  FormHelperText,
  InputLabel,
  Switch as MuiSwitch,
  SwitchProps,
} from '@mui/material'
import { StyleFormControl } from './Switch.styled'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import InfoTooltip from '~/components/atoms/form/InfoTooltip'

interface IProps extends SwitchProps {
  helperIcon?: string
  helperText?: string
  infoTooltip?: string
  label?: string
  margin?: 'none' | 'dense' | 'normal'
}

function Switch(props: IProps): JSX.Element {
  const { helperIcon, helperText, infoTooltip, label, margin, ...switchProps } =
    props

  return (
    <StyleFormControl fullWidth variant="standard" margin={margin}>
      {label || infoTooltip ? (
        <InputLabel sx={{ maxWidth: '90%' }} shrink>
          {label ? label : null}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      ) : undefined}
      <MuiSwitch
        {...switchProps}
        sx={
          label || infoTooltip ? { marginLeft: '-12px', marginTop: '20px' } : {}
        }
      />
      {Boolean(helperText) && (
        <FormHelperText>
          {Boolean(helperIcon) && (
            <IonIcon
              name={helperIcon}
              style={{ fontSize: 18, marginRight: 2 }}
            />
          )}
          {helperText}
        </FormHelperText>
      )}
    </StyleFormControl>
  )
}

export default Switch
