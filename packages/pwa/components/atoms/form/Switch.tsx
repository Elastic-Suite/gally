import { ChangeEvent } from 'react'
import { InputLabel, Switch as MuiSwitch } from '@mui/material'
import { StyleFormControl } from './Switch.styled'
import InfoTooltip from '~/components/atoms/form/InfoTooltip'

interface IProps {
  label: string
  labelInfo: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  name: string
  checked: boolean
}

function Switch({ label, labelInfo, ...args }: IProps): JSX.Element {
  return (
    <StyleFormControl variant="standard" fullWidth>
      {label || labelInfo ? (
        <InputLabel sx={{ maxWidth: '90%' }} shrink>
          {label ? label : null}
          {labelInfo ? <InfoTooltip title={labelInfo} /> : null}
        </InputLabel>
      ) : undefined}
      <MuiSwitch
        {...args}
        sx={{ margin: '15px', marginLeft: '-12px', marginTop: '22px' }}
      />
    </StyleFormControl>
  )
}

export default Switch
