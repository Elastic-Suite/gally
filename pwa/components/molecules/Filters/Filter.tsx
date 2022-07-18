import DropDown, { IOptions } from '~/components/atoms/form/DropDown'
import InputText from '~/components/atoms/form/InputText'

export enum FilterType {
  BOOLEAN,
  TEXT,
  SELECT,
}

export interface IFilter {
  id: string
  label: string
  multiple?: boolean
  options?: IOptions
  type?: FilterType
}

interface IProps {
  filter: IFilter
  filterValues: Record<string, unknown>
  onFilterChange: (filter: IFilter, value: unknown) => void
}

function Filter(props: IProps): JSX.Element {
  const { filter, filterValues, onFilterChange } = props
  const { id, multiple, options, type, ...formProps } = filter
  const value = filterValues[filter.id]

  function handleChange(value: unknown): void {
    onFilterChange(filter, value)
  }

  switch (type) {
    case FilterType.BOOLEAN:
    case FilterType.SELECT:
      if (multiple) {
        return (
          <DropDown
            onChange={handleChange}
            multiple
            options={options}
            {...formProps}
            value={value as unknown[]}
          />
        )
      }
      return (
        <DropDown
          onChange={handleChange}
          options={options}
          {...formProps}
          value={value}
        />
      )
  }

  return (
    <InputText onChange={handleChange} {...formProps} value={String(value)} />
  )
}

export default Filter
