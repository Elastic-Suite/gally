import { Checkbox, FormControlLabel } from '@mui/material'

import { IFilter, IFilterChange, IFilterOption } from '../../types'

interface IProps {
  activeOptions: IFilterOption[]
  filter: IFilter
  onChange: IFilterChange
  option: IFilterOption
}

function FacetChoice(props: IProps): JSX.Element {
  const { activeOptions, filter, onChange, option } = props
  return (
    <FormControlLabel
      key={String(option.value)}
      control={
        <Checkbox
          checked={activeOptions.includes(option) ?? false}
          onChange={onChange(filter, option)}
          name={String(option.value)}
        />
      }
      label={option.label}
    />
  )
}

export default FacetChoice
