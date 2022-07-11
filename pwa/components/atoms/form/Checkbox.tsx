import {
  CheckboxProps,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from '@mui/material'

interface IProps extends CheckboxProps {
  label?: string
  list?: boolean
}

function Checkbox(props: IProps): JSX.Element {
  const { disabled, label, list, ...checkboxProps } = props
  return (
    <FormControlLabel
      componentsProps={{ typography: { variant: list ? 'caption' : 'body2' } }}
      control={
        <MuiCheckbox
          {...checkboxProps}
          sx={
            list
              ? {
                  marginBottom: '-9px',
                  marginTop: '-9px',
                  fontSize: '12px',
                }
              : null
          }
        />
      }
      disabled={disabled}
      label={label}
    />
  )
}

export default Checkbox
