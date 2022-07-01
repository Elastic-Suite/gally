import {
  Checkbox as MuiCheckbox,
  CheckboxProps,
  FormControlLabel,
} from '@mui/material'

interface IProps extends CheckboxProps {
  label?: string
  noPadding?: boolean
}

function Checkbox(props: IProps) {
  const { disabled, label, noPadding, ...checkboxProps } = props
  return (
    <FormControlLabel
      control={
        <MuiCheckbox
          {...checkboxProps}
          sx={noPadding && { marginBottom: '-9px', marginTop: '-9px' }}
        />
      }
      disabled={disabled}
      label={label}
    />
  )
}

export default Checkbox
