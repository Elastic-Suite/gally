import { Slider } from '@mui/material'
import { IGraphqlAggregation } from '@elastic-suite/gally-admin-shared'

import { IFilterChange } from '../../types'

import { Container } from './Facet.styled'
import { useState } from 'react'

interface IProps {
  activeOptions: string[]
  filter: IGraphqlAggregation
  id: string
  onChange: IFilterChange
}

function FacetSlider(props: IProps): JSX.Element {
  const { activeOptions, filter, id, onChange } = props
  const min = Number(filter.options.at(0).value)
  const max = Number(filter.options.at(-1).value)
  const [value, setValue] = useState<number[]>([min, max])

  const marks = [
    {
      value: min,
      label: min,
    },
  ]

  if (min !== max) {
    marks.push({
      value: max,
      label: max,
    })
  }

  function handleChange(_: Event, value: number[]): void {
    onChange(filter, value.join(' - '))()
  }

  return (
    <Container>
      <Slider
        aria-labelledby={id}
        marks={marks}
        max={max}
        min={min}
        onChange={(_e, v: number[]): void => setValue(v)}
        onChangeCommitted={(e): void => handleChange(e as Event, value)}
        value={activeOptions[0] ? value : [min, max]}
        valueLabelDisplay="auto"
      />
    </Container>
  )
}

export default FacetSlider
