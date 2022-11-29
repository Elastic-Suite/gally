import { Radio, RadioGroup } from '@mui/material'
import { IGraphqlProductAggregation } from 'shared'

import { IFilterChange } from '../../types'

import { FormControlLabel } from './Facet.styled'

interface IProps {
  activeOptions: string[]
  filter: IGraphqlProductAggregation
  id: string
  onChange: IFilterChange
}

function FacetBoolean(props: IProps): JSX.Element {
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
          onChange={onChange(filter, option.value)}
          value={
            <>
              <span>{option.label}</span>
              <span>({option.count})</span>
            </>
          }
        />
      ))}
    </RadioGroup>
  )
}

export default FacetBoolean
