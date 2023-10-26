import {
  IGraphqlAggregation,
  IGraphqlAggregationOption,
} from '@elastic-suite/gally-admin-shared'
import classNames from 'classnames'

import { IFilterChange } from '../../types'

import { FacetLink } from './Facet.styled'

interface IProps {
  activeOptions: string[]
  filter: IGraphqlAggregation
  onChange: IFilterChange
  option: IGraphqlAggregationOption
}

function FacetCategory(props: IProps): JSX.Element {
  const { activeOptions, filter, onChange, option } = props
  return (
    <FacetLink
      className={classNames({
        active: option.value === activeOptions[0],
      })}
      onClick={onChange(filter, option.value)}
      type="button"
    >
      <span>{option.label}</span>
      <span>({option.count})</span>
    </FacetLink>
  )
}

export default FacetCategory
