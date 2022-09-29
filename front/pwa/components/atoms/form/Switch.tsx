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
  label?: string
  labelInfo?: string
}

function Switch(props: IProps): JSX.Element {
  const { helperIcon, helperText, label, labelInfo, ...switchProps } = props

  return (
    <StyleFormControl variant="standard" fullWidth>
      {label || labelInfo ? (
        <InputLabel sx={{ maxWidth: '90%' }} shrink>
          {label ? label : null}
          {labelInfo ? <InfoTooltip title={labelInfo} /> : null}
        </InputLabel>
      ) : undefined}
      <MuiSwitch
        {...switchProps}
        sx={
          label || labelInfo ? { marginLeft: '-12px', marginTop: '20px' } : {}
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
