import {
  FormControlLabel,
  Radio,
  RadioGroupProps,
  RadioGroup as RadioGrp,
} from '@mui/material'
import { IOption, IOptions } from '~/types'

interface IProps extends RadioGroupProps {
  options: IOptions
}

function RadioGroup(props: IProps): JSX.Element {
  const { options, ...radioGroupProps } = props
  const foundNameDefaultValue = options.find((element) => element.default)

  return (
    <RadioGrp
      {...radioGroupProps}
      defaultValue={
        radioGroupProps.defaultChecked ? foundNameDefaultValue?.value : null
      }
    >
      {options.map((item: IOption) => {
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
