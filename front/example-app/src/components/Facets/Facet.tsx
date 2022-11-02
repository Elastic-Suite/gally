import { useId, useState } from 'react'
import { Collapse, IconButton, styled } from '@mui/material'
import ExpandMore from '@mui/icons-material/ExpandMore'
import classnames from 'classnames'

import {
  IActiveFilters,
  IFilter,
  IFilterChange,
  IFilterOption,
} from '../../types'

import FacetChoices from './FacetChoices'
import { FacetBoolean } from './FacetBoolean'

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

function getFacet(
  filter: IFilter,
  activeOptions: IFilterOption[],
  id: string,
  onChange: IFilterChange
): JSX.Element {
  switch (filter.type) {
    case 'boolean':
      return (
        <FacetBoolean
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
          onChange={onChange}
        />
      )
  }
}

interface IProps {
  activeFilters: IActiveFilters
  filter: IFilter
  onChange: IFilterChange
}

function Facet(props: IProps): JSX.Element {
  const { activeFilters, filter, onChange } = props
  const [open, setOpen] = useState(false)
  const id = useId()
  const activeOptions = activeFilters
    .filter((activeFilters) => activeFilters.filter === filter)
    .map((activeFilters) => activeFilters.option)

  function handleToggleOpen(): void {
    setOpen((prevState) => !prevState)
  }

  return (
    <>
      <Title id={id}>
        {filter.label}
        <IconButton onClick={handleToggleOpen} type="button">
          <ExpandMoreIcon className={classnames({ 'is-open': open })} />
        </IconButton>
      </Title>
      <Collapse in={open}>
        {getFacet(filter, activeOptions, id, onChange)}
      </Collapse>
    </>
  )
}

export default Facet
