import { Button, Collapse, FormGroup } from '@mui/material'
import {
  IFetch,
  IGraphqlAggregation,
  IGraphqlAggregationOption,
  IGraphqlViewMoreFacetOption,
} from '@elastic-suite/gally-admin-shared'

interface IProps {
  filter: IGraphqlAggregation
  id: string
  loadMore: (filter: IGraphqlAggregation) => void
  moreOptions?: IFetch<IGraphqlViewMoreFacetOption[]>
  renderOption: (option: IGraphqlAggregationOption) => JSX.Element
}

function FacetLoadMore(props: IProps): JSX.Element {
  const { filter, id, loadMore, moreOptions, renderOption } = props
  const open = moreOptions?.data?.length > 0

  function handleToggleMore(): void {
    loadMore(filter)
  }

  return (
    <>
      {!moreOptions?.data && (
        <FormGroup aria-labelledby={id}>
          {filter.options.map(renderOption)}
        </FormGroup>
      )}
      <Collapse in={open}>
        <FormGroup aria-labelledby={id}>
          {moreOptions?.data?.map(renderOption)}
        </FormGroup>
      </Collapse>
      {Boolean(filter.hasMore) && !open && (
        <Button
          sx={{
            display: 'none'
          }}
          disabled={Boolean(moreOptions?.error)}
          onClick={handleToggleMore}
        >
          {moreOptions?.error ? 'An error occured' : 'Show more'}
        </Button>
      )}
    </>
  )
}

export default FacetLoadMore
