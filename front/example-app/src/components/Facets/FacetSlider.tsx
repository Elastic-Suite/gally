import { Slider } from '@mui/material'
import { IGraphqlAggregation } from '@elastic-suite/gally-admin-shared'

import { IFilterChange } from '../../types'

import { Container } from './Facet.styled'

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
  function handleChange(_: Event, value: number | number[]): void {
    onChange(filter, String(value))()
  }

  return (
    <Container>
      <Slider
        aria-labelledby={id}
        marks={marks}
        max={max}
        min={min}
        onChange={handleChange}
        value={Number(activeOptions[0] ?? max)}
        valueLabelDisplay="auto"
      />
    </Container>
  )
}

export default FacetSlider
