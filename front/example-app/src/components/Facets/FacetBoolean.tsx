import { FormGroup, Switch } from '@mui/material'
import { IGraphqlAggregation } from '@elastic-suite/gally-admin-shared'

import { IFilterChange } from '../../types'

import { FormControlLabel } from './Facet.styled'

interface IProps {
  activeOptions: string[]
  filter: IGraphqlAggregation
  id: string
  onChange: IFilterChange
}

function FacetBoolean(props: IProps): JSX.Element {
  const { activeOptions, filter, id, onChange } = props
  return (
    <FormGroup aria-labelledby={id}>
      {filter.options
        .filter((option) => Boolean(Number(option.value)))
        .map((option) => (
          <FormControlLabel
            key={String(option.value)}
            control={
              <Switch
                checked={option.value === activeOptions[0]}
                onChange={onChange(filter, option.value)}
                name={String(option.value)}
              />
            }
            label={<span>({option.count})</span>}
            value={option.value}
          />
        ))}
    </FormGroup>
  )
}

export default FacetBoolean
