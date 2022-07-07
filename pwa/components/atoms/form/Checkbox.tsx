import {
  Checkbox as MuiCheckbox,
  CheckboxProps,
  FormControlLabel,
} from '@mui/material'

interface IProps extends CheckboxProps {
  label?: string
  list?: boolean
}

function Checkbox(props: IProps) {
  const { disabled, label, list, ...checkboxProps } = props
  return (
    <FormControlLabel
      componentsProps={{ typography: { variant: list ? 'caption' : 'body2' } }}
      control={
        <MuiCheckbox
          {...checkboxProps}
          sx={
            list && {
              marginBottom: '-9px',
              marginTop: '-9px',
              fontSize: '12px',
            }
          }
        />
      }
      disabled={disabled}
      label={label}
    />
  )
}

export default Checkbox
