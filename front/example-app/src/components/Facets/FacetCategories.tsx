import { useState } from 'react'
import { Button, Collapse, FormGroup } from '@mui/material'
import { IGraphqlProductAggregation } from 'shared'
import classNames from 'classnames'

import { IFilterChange } from '../../types'

import { FacetLink, FacetLinks } from './Facet.styled'

interface IProps {
  activeOptions: string[]
  filter: IGraphqlProductAggregation
  id: string
  onChange: IFilterChange
}

function FacetCategories(props: IProps): JSX.Element {
  const { activeOptions, filter, id, onChange } = props
  const [more, setMore] = useState(false)

  function handleToggleMore(): void {
    setMore((prevState) => !prevState)
  }

  return (
    <>
      <FacetLinks>
        {filter.options.map((option) => (
          <FacetLink
            key={String(option.value)}
            className={classNames({
              active: option.value === activeOptions[0],
            })}
            onClick={onChange(filter, option.value)}
            type="button"
          >
            <span>{option.label}</span>
            <span>({option.count})</span>
          </FacetLink>
        ))}
      </FacetLinks>
      <Collapse in={more}>
        <FormGroup aria-labelledby={id}>Load more facets...</FormGroup>
      </Collapse>
      {Boolean(filter.hasMore) && (
        <Button onClick={handleToggleMore}>
          {more ? 'Show less' : 'Show more'}
        </Button>
      )}
    </>
  )
}

export default FacetCategories
