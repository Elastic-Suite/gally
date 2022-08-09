import { ChangeEvent, useMemo } from 'react'
import { FormControl, InputLabel, Switch } from '@mui/material'
import { Font } from './SwitchLabel.style'
import InfoTooltip from '~/components/atoms/form/InfoTooltip'

interface IProps {
  label: string
  labelInfo: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  name: string
  checked: boolean
}

function SwitchLabel({ label, labelInfo, ...args }: IProps): JSX.Element {
  return useMemo(() => {
    return (
      <Font>
        <FormControl variant="standard" fullWidth>
          <InputLabel shrink>
            {label ? label : null}
            {labelInfo ? <InfoTooltip title={labelInfo} /> : null}
          </InputLabel>
          <Switch
            {...args}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            sx={{ margin: '15px', marginLeft: '-12px' }}
          />
        </FormControl>
      </Font>
    )
  }, [args.checked])
}

export default SwitchLabel
