import { ChangeEvent, ReactNode } from 'react'
import {
  CheckboxProps,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from '@mui/material'

interface IProps extends Omit<CheckboxProps, 'onChange'> {
  label?: ReactNode
  list?: boolean
  onChange?: (checked: boolean) => void
  small?: boolean
}

function Checkbox(props: IProps): JSX.Element {
  const { disabled, label, list, onChange, small, ...checkboxProps } = props

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    if (onChange) {
      onChange(event.target.checked)
    }
  }

  return (
    <FormControlLabel
      componentsProps={{ typography: { variant: list ? 'caption' : 'body2' } }}
      control={
        <MuiCheckbox
          {...checkboxProps}
          onChange={handleChange}
          sx={{
            ...(Boolean(list) && {
              marginBottom: '-9px',
              marginTop: '-9px',
              fontSize: '12px',
            }),
            ...(Boolean(small) && {
              padding: 0,
              marginLeft: '6px',
              marginRight: '6px',
            }),
          }}
        />
      }
      disabled={disabled}
      label={label}
      sx={{
        ...(Boolean(small) && {
          marginLeft: '-6px',
        }),
      }}
    />
  )
}

export default Checkbox
