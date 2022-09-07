import {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  SyntheticEvent,
  useMemo,
  useState,
} from 'react'
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  FormControl,
} from '@mui/material'

import { IOption, IOptions } from '~/types'

import Checkbox from './Checkbox'
import { SmallStyledPaper, StyledPaper } from './DropDown.styled'
import InputText from './InputText'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import Chip from '~/components/atoms/Chip/Chip'

export interface IDropDownProps<T> {
  disabled?: boolean
  infoTooltip?: string
  label?: string
  multiple?: boolean
  onChange?: (value: T | T[]) => void
  options: IOptions<T>
  required?: boolean
  small?: boolean
  style?: CSSProperties
  transparent?: boolean
  value?: T | T[]
}

function DropDown<T>(props: IDropDownProps<T>): JSX.Element {
  const {
    disabled,
    infoTooltip,
    label,
    multiple,
    onChange,
    options,
    required,
    small,
    style,
    transparent,
    value,
  } = props
  const [search, setSearch] = useState('')
  const optionMap = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options]
  )
  const optionValue =
    value instanceof Array
      ? value.map((val) => optionMap.get(val))
      : optionMap.get(value) ?? null

  function handleChange(
    _: SyntheticEvent,
    option: IOption<T> | IOption<T>[]
  ): void {
    if (!option) {
      onChange(null)
    } else if (option instanceof Array) {
      onChange(option.map(({ value }) => value))
    } else {
      onChange(option.value)
    }
  }

  let renderOption
  let renderTags
  if (multiple) {
    // eslint-disable-next-line react/no-unstable-nested-components, react/function-component-definition, react/display-name
    renderOption = (
      props: HTMLAttributes<HTMLLIElement>,
      { label }: IOption<T>,
      { selected }: AutocompleteRenderOptionState
    ): ReactNode => (
      <li {...props}>
        <Checkbox checked={selected} label={label} list />
      </li>
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    renderTags = (value: IOption<T>[], getTagProps: any): ReactNode[] =>
      value.map((option: IOption<T>, index: number) => (
        <Chip
          key={option.id ?? String(option.value)}
          label={option.label}
          size="small"
          {...getTagProps({ index })}
        />
      ))
  }

  return (
    <FormControl variant="standard">
      <Autocomplete
        PaperComponent={small ? SmallStyledPaper : StyledPaper}
        disabled={disabled}
        getOptionDisabled={(option: IOption<T>): boolean => option.disabled}
        multiple={multiple}
        onChange={handleChange}
        options={options}
        popupIcon={<IonIcon name="chevron-down" />}
        renderInput={(params): JSX.Element => {
          const { InputLabelProps, InputProps, ...inputProps } = params
          return (
            <InputText
              {...inputProps}
              {...InputProps}
              infoTooltip={infoTooltip}
              label={label}
              onChange={setSearch}
              required={required}
              small={small}
              transparent={transparent}
              value={search}
            />
          )
        }}
        renderOption={renderOption}
        renderTags={renderTags}
        style={style}
        value={optionValue}
      />
    </FormControl>
  )
}

export default DropDown
