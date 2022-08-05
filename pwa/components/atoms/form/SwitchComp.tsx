import { ChangeEvent } from 'react'
import { Grid, Switch } from '@mui/material'
import { Font } from './SwitchComp.style'
import InfoTooltip from '~/components/atoms/form/InfoTooltip'

function SwitchComp({
  label,
  labelInfo,
  handleChange,
  value,
  name,
}: {
  label?: string
  labelInfo?: string
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
  value: boolean
  name: string
}): JSX.Element {
  return (
    <Grid container direction="column">
      <Font>
        <Grid container justifyContent="flex-start" alignItems="center">
          {label ? label : null}
          {labelInfo ? <InfoTooltip text={labelInfo} /> : null}
        </Grid>
      </Font>
      <div style={{ marginLeft: '-12px' }}>
        <Switch
          checked={value}
          onChange={handleChange}
          name={name}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      </div>
    </Grid>
  )
}

export default SwitchComp
