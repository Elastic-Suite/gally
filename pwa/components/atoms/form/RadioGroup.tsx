import { FormControlLabel, Radio, RadioGroup as RadioGrp } from '@mui/material'

interface IOptions {
  value: string
  label: string
  disabled?: boolean
  default?: boolean
}

interface IProps {
  name: string
  defaultChecked: string
  row?: boolean
  options: IOptions[]
}

function RadioGroup({
  name,
  defaultChecked,
  row,
  options,
}: IProps): JSX.Element {
  return (
    <RadioGrp name={name} row={row} defaultValue={defaultChecked}>
      {options.map((item: IOptions) => {
        return (
          <FormControlLabel
            disabled={item.disabled}
            key={item.label}
            value={item.value}
            control={<Radio />}
            label={item.label}
          />
        )
      })}
    </RadioGrp>
  )
}

export default RadioGroup
