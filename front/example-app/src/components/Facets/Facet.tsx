import { useId, useState } from 'react'
import { Collapse, IconButton, styled } from '@mui/material'
import ExpandMore from '@mui/icons-material/ExpandMore'
import classnames from 'classnames'
import {
  AggregationType,
  IFetch,
  IGraphqlAggregation,
  IGraphqlViewMoreFacetOption,
} from '@elastic-suite/gally-admin-shared'

import { IActiveFilters, IFilterChange } from '../../types'

import FacetBoolean from './FacetBoolean'
import FacetCategory from './FacetCategory'
import FacetChoice from './FacetChoice'
import FacetLoadMore from './FacetLoadMore'
import FacetSlider from './FacetSlider'

const Title = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '8px 0',
  cursor: 'pointer',
})

const CustomSeparator = styled('div')({
  width: '100%',
  height: '2px',
  background: '#d7d7d7',
})

const ExpandMoreIcon = styled(ExpandMore)({
  transition: 'transform 200ms',
  '&.is-open': {
    transform: 'rotateZ(180deg)',
  },
})

interface IProps {
  activeFilters: IActiveFilters
  filter: IGraphqlAggregation
  loadMore: (filter: IGraphqlAggregation) => void
  moreOptions?: IFetch<IGraphqlViewMoreFacetOption[]>
  onChange: IFilterChange
}

function Facet(props: IProps): JSX.Element {
  const { activeFilters, filter, loadMore, moreOptions, onChange } = props
  const [open, setOpen] = useState(false)
  const id = useId()
  const activeOptions = activeFilters
    .filter((activeFilters) => activeFilters.filter.field === filter.field)
    .map((activeFilters) => activeFilters.value)

  function handleToggleOpen(): void {
    setOpen((prevState) => !prevState)
  }

  function getFacet(): JSX.Element | null {
    switch (filter.type) {
      case AggregationType.BOOLEAN:
        return (
          filter.options.filter((option) => Boolean(Number(option.value)))
            .length > 0 && (
            <FacetBoolean
              activeOptions={activeOptions}
              filter={filter}
              id={id}
              onChange={onChange}
            />
          )
        )

      case AggregationType.CATEGORY:
        return (
          <FacetLoadMore
            filter={filter}
            id={id}
            loadMore={loadMore}
            moreOptions={moreOptions}
            renderOption={(option): JSX.Element => (
              <FacetCategory
                key={String(option.value)}
                activeOptions={activeOptions}
                filter={filter}
                onChange={onChange}
                option={option}
              />
            )}
          />
        )

      case AggregationType.SLIDER:
        return (
          <FacetSlider
            activeOptions={activeOptions}
            filter={filter}
            id={id}
            onChange={onChange}
          />
        )
      case AggregationType.HISTOGRAM || AggregationType.HISTOGRAM_DATE:
        return (
          <FacetLoadMore
            filter={filter}
            id={id}
            loadMore={loadMore}
            moreOptions={moreOptions}
            renderOption={(option): JSX.Element => (
              <FacetChoice
                key={String(option.value)}
                activeOptions={activeOptions}
                filter={filter}
                onChange={onChange}
                option={option}
              />
            )}
          />
        )

      default:
        return (
          <FacetLoadMore
            filter={filter}
            id={id}
            loadMore={loadMore}
            moreOptions={moreOptions}
            renderOption={(option): JSX.Element => (
              <FacetChoice
                key={String(option.value)}
                activeOptions={activeOptions}
                filter={filter}
                onChange={onChange}
                option={option}
              />
            )}
          />
        )
    }
  }
  const facet = getFacet()

  if (!facet) {
    return null
  }

  return (
    <>
      <Title id={id} onClick={handleToggleOpen}>
        {filter.label}
        <IconButton type="button">
          <ExpandMoreIcon className={classnames({ 'is-open': open })} />
        </IconButton>
      </Title>
      <Collapse in={open}>{facet}</Collapse>
      <CustomSeparator />
    </>
  )
}

export default Facet
