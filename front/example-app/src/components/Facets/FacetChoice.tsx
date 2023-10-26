import { Checkbox } from '@mui/material'
import {
  IGraphqlAggregation,
  IGraphqlAggregationOption,
} from '@elastic-suite/gally-admin-shared'

import { IFilterChange } from '../../types'

import { FormControlLabel } from './Facet.styled'

interface IProps {
  activeOptions: string[]
  filter: IGraphqlAggregation
  onChange: IFilterChange
  option: IGraphqlAggregationOption
}

function FacetChoice(props: IProps): JSX.Element {
  const { activeOptions, filter, onChange, option } = props
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={activeOptions.includes(option.value) ?? false}
          name={String(option.value)}
          onChange={onChange(filter, option.value)}
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
