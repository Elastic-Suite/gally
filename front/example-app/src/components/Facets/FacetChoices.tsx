import { useState } from 'react'
import { Button, Collapse, FormGroup } from '@mui/material'

import { IFilter, IFilterChange, IFilterOption } from '../../types'

import FacetChoice from './FacetChoice'

interface IProps {
  activeOptions: IFilterOption[]
  filter: IFilter
  id: string
  onChange: IFilterChange
}

function FacetChoices(props: IProps): JSX.Element {
  const { activeOptions, filter, id, onChange } = props
  const [more, setMore] = useState(false)

  function handleToggleMore(): void {
    setMore((prevState) => !prevState)
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
      <Collapse in={more}>
        <FormGroup aria-labelledby={id}>Load more facets...</FormGroup>
      </Collapse>
      {Boolean(filter.has_more) && (
        <Button onClick={handleToggleMore}>
          {more ? 'Show less' : 'Show more'}
        </Button>
      )}
    </>
  )
}

export default FacetChoices
