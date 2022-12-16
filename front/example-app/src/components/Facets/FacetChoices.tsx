import { Button, Collapse, FormGroup } from '@mui/material'
import {
  IFetch,
  IGraphqlProductAggregation,
  IGraphqlViewMoreFacetOption,
} from 'shared'

import { IFilterChange } from '../../types'

import FacetChoice from './FacetChoice'

interface IProps {
  activeOptions: string[]
  filter: IGraphqlProductAggregation
  id: string
  loadMore: (filter: IGraphqlProductAggregation) => void
  moreOptions?: IFetch<IGraphqlViewMoreFacetOption[]>
  onChange: IFilterChange
}

function FacetChoices(props: IProps): JSX.Element {
  const { activeOptions, filter, id, loadMore, moreOptions, onChange } = props
  const open = moreOptions?.data?.length > 0

  function handleToggleMore(): void {
    loadMore(filter)
  }

  return (
    <>
      <FormGroup aria-labelledby={id}>
        {filter.options.map((option) => (
          <FacetChoice
            key={String(option.value)}
            activeOptions={activeOptions}
            filter={filter}
            onChange={onChange}
            option={option}
          />
        ))}
      </FormGroup>
      <Collapse in={open}>
        <FormGroup aria-labelledby={id}>
          {moreOptions?.data?.map((option) => (
            <FacetChoice
              key={String(option.value)}
              activeOptions={activeOptions}
              filter={filter}
              onChange={onChange}
              option={option}
            />
          ))}
        </FormGroup>
      </Collapse>
      {Boolean(filter.hasMore) && !open && (
        <Button
          disabled={Boolean(moreOptions?.error)}
          onClick={handleToggleMore}
        >
          {moreOptions?.error ? 'An error occured' : 'Show more'}
        </Button>
      )}
    </>
  )
}

export default FacetChoices
