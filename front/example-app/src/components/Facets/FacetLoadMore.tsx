import React, { ChangeEvent, useMemo, useState } from 'react'
import { Button, FormGroup, TextField, styled } from '@mui/material'
import {
  IFetch,
  IGraphqlAggregation,
  IGraphqlAggregationOption,
  IGraphqlViewMoreFacetOption,
  LoadStatus,
} from '@elastic-suite/gally-admin-shared'
import { IFilterChange } from '../../types'

const SearchOption = styled(TextField)(() => ({
  width: '100%',
}))

const NoOption = styled('div')(({ theme }) => ({
  color: '#AA0000',
  backgroundColor: '#FFEEEE',
  marginBottom: theme.spacing(1),
  padding: theme.spacing(1),
}))

interface IProps {
  filter: IGraphqlAggregation
  id: string
  loadMore: (filter: IGraphqlAggregation, optionSearch?: string) => void
  moreOptions?: IFetch<IGraphqlViewMoreFacetOption[]>
  renderOption: (
    option: IGraphqlAggregationOption,
    onOptionChange: IFilterChange
  ) => JSX.Element
  onOptionChange: IFilterChange
}

function getFirstLabelsString(items: IGraphqlAggregationOption[]): string {
  const labels = items.slice(0, 2).map((i) => i.label)
  if (items.length > 2) {
    labels.push('...')
  }
  return labels.join(', ')
}

function FacetLoadMore(props: IProps): JSX.Element {
  const { filter, id, loadMore, moreOptions, renderOption, onOptionChange } =
    props

  const [optionSearch, setOptionSearch] = useState<string>('')
  const [showMore, setShowMore] = useState<boolean>(false)

  const searchOptionLabel = useMemo(() => {
    const labels = getFirstLabelsString(filter.options)
    return labels ? `Search (${labels})` : 'Search'
  }, [filter.options])

  function handleToggleMore(showMoreEnabled: boolean): void {
    setShowMore(showMoreEnabled)
    if (showMoreEnabled) {
      loadMore(filter, optionSearch)
    }
  }

  function handleOptionSearchChange(value: string): void {
    setOptionSearch(value)
    if (!value) {
      setShowMore(false)
    } else {
      setShowMore(true)
    }
    loadMore(filter, value)
  }

  function handleOptionChange(filter: IGraphqlAggregation, value: string) {
    return () => {
      // Empty the search facet field when a value is selected.
      setOptionSearch('')
      onOptionChange(filter, value)()
    }
  }

  const options =
    showMore &&
    !moreOptions?.error &&
    moreOptions?.status === LoadStatus.SUCCEEDED
      ? moreOptions?.data
      : filter.options

  const showShowMore = !showMore || options === filter.options
  const canShowToggleButtons = Boolean(filter.hasMore) && !optionSearch

  return (
    <>
      {Boolean(filter.hasMore) && (
        <>
          <SearchOption
            id="outlined-basic"
            label={searchOptionLabel}
            variant="outlined"
            name="searchOption"
            value={optionSearch}
            onChange={(e: ChangeEvent<HTMLInputElement>): void =>
              handleOptionSearchChange(e.target.value)
            }
            size="small"
          />
          {Boolean(optionSearch) &&
            ((moreOptions?.status === LoadStatus.SUCCEEDED &&
              moreOptions?.data?.length < 1) ||
              Boolean(moreOptions?.error)) && (
              <NoOption>
                {moreOptions?.error
                  ? 'An error occured'
                  : `No value matching the search "${optionSearch}"`}
              </NoOption>
            )}
        </>
      )}
      <FormGroup aria-labelledby={id}>
        {options?.map((option) => renderOption(option, handleOptionChange))}
      </FormGroup>
      {canShowToggleButtons && (showShowMore || Boolean(moreOptions?.error)) ? (
        <Button
          disabled={Boolean(moreOptions?.error)}
          onClick={(): void => handleToggleMore(true)}
        >
          {moreOptions?.error ? 'An error occured' : 'Show more'}
        </Button>
      ) : null}

      {canShowToggleButtons && !showShowMore && !moreOptions?.error ? (
        <Button onClick={(): void => handleToggleMore(false)}>Show less</Button>
      ) : null}
    </>
  )
}

export default FacetLoadMore
