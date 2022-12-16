import { useId, useState } from 'react'
import { Collapse, IconButton, styled } from '@mui/material'
import ExpandMore from '@mui/icons-material/ExpandMore'
import classnames from 'classnames'
import {
  AggregationType,
  IFetch,
  IGraphqlProductAggregation,
  IGraphqlViewMoreFacetOption,
} from 'shared'

import { IActiveFilters, IFilterChange } from '../../types'

import FacetBoolean from './FacetBoolean'
import FacetCategories from './FacetCategories'
import FacetChoices from './FacetChoices'
import FacetSlider from './FacetSlider'

const Title = styled('h3')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const ExpandMoreIcon = styled(ExpandMore)({
  transition: 'transform 200ms',
  '&.is-open': {
    transform: 'rotateZ(180deg)',
  },
})

interface IProps {
  activeFilters: IActiveFilters
  filter: IGraphqlProductAggregation
  loadMore: (filter: IGraphqlProductAggregation) => void
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

  function getFacet(): JSX.Element {
    // todo: remove test using label
    if ('Category' === filter.label) {
      return (
        <FacetCategories
          activeOptions={activeOptions}
          filter={filter}
          id={id}
          onChange={onChange}
        />
      )
    }
    // todo: remove test using label
    if ('Stock' === filter.label) {
      return (
        <FacetBoolean
          activeOptions={activeOptions}
          filter={filter}
          id={id}
          onChange={onChange}
        />
      )
    }
    switch (filter.type) {
      case AggregationType.STOCK:
        return (
          <FacetBoolean
            activeOptions={activeOptions}
            filter={filter}
            id={id}
            onChange={onChange}
          />
        )

      case AggregationType.CATEGORY:
        return (
          <FacetCategories
            activeOptions={activeOptions}
            filter={filter}
            id={id}
            onChange={onChange}
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

      default:
        return (
          <FacetChoices
            activeOptions={activeOptions}
            filter={filter}
            id={id}
            loadMore={loadMore}
            moreOptions={moreOptions}
            onChange={onChange}
          />
        )
    }
  }

  return (
    <>
      <Title id={id}>
        {filter.label}
        <IconButton onClick={handleToggleOpen} type="button">
          <ExpandMoreIcon className={classnames({ 'is-open': open })} />
        </IconButton>
      </Title>
      <Collapse in={open}>{getFacet()}</Collapse>
    </>
  )
}

export default Facet
