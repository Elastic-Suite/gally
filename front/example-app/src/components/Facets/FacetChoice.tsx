import { Checkbox } from '@mui/material'
import {
  IGraphqlProductAggregation,
  IGraphqlProductAggregationOption,
} from 'shared'

import { IFilterChange } from '../../types'

import { FormControlLabel } from './Facet.styled'

interface IProps {
  activeOptions: string[]
  filter: IGraphqlProductAggregation
  onChange: IFilterChange
  option: IGraphqlProductAggregationOption
}

function FacetChoice(props: IProps): JSX.Element {
  const { activeOptions, filter, onChange, option } = props
  return (
    <FormControlLabel
      key={String(option.value)}
      control={
        <Checkbox
          checked={activeOptions.includes(option.value) ?? false}
          onChange={onChange(filter, option.value)}
          name={String(option.value)}
        />
      }
      label={
        <>
          <span>{option.label}</span>
          <span>({option.count})</span>
        </>
      }
    />
  )
}

export default FacetChoice
