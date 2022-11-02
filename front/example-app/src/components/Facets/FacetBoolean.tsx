import { FormControlLabel, Radio, RadioGroup } from '@mui/material'

import { IFilter, IFilterChange, IFilterOption } from '../../types'

interface IProps {
  activeOptions: IFilterOption[]
  filter: IFilter
  id: string
  onChange: IFilterChange
}

export function FacetBoolean(props: IProps): JSX.Element {
  const { activeOptions, filter, id, onChange } = props
  return (
    <RadioGroup
      aria-labelledby={id}
      name={filter.field}
      value={activeOptions[0] ?? ''}
    >
      {filter.options.map((option) => (
        <FormControlLabel
          key={String(option.value)}
          control={<Radio />}
          label={option.label}
          onChange={onChange(filter, option)}
          value={option}
        />
      ))}
    </RadioGroup>
  )
}
