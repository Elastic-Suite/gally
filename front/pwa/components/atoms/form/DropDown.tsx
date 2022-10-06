import {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  SyntheticEvent,
  useMemo,
  useRef,
} from 'react'
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  FormControl,
} from '@mui/material'
import { useTranslation } from 'next-i18next'

import { IOption, IOptions } from 'shared'

import Checkbox from './Checkbox'
import { SmallStyledPaper, StyledPaper } from './DropDown.styled'
import InputText, { IInputTextProps } from './InputText'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import Chip from '~/components/atoms/Chip/Chip'

export interface IDropDownProps<T>
  extends Omit<IInputTextProps, 'onChange' | 'value'> {
  disabled?: boolean
  limitTags?: number
  multiple?: boolean
  onChange?: (value: T | T[], event: SyntheticEvent) => void
  options: IOptions<T>
  style?: CSSProperties
  value?: T | T[]
}

function DropDown<T>(props: IDropDownProps<T>): JSX.Element {
  const {
    disabled,
    limitTags,
    multiple,
    onChange,
    options,
    style,
    value,
    ...otherProps
  } = props
  const { small } = props
  const { t } = useTranslation('common')
  const inputRef = useRef()
  const optionMap = useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options]
  )
  const optionValue =
    value instanceof Array
      ? value.map((val) => optionMap.get(val))
      : optionMap.get(value) ?? null

  function handleChange(
    event: SyntheticEvent,
    option: IOption<T> | IOption<T>[]
  ): void {
    const dropdownEvent = { ...event, target: inputRef.current }
    setTimeout(() => {
      if (!option) {
        onChange(null, dropdownEvent)
      } else if (option instanceof Array) {
        onChange(
          option.map(({ value }) => value),
          dropdownEvent
        )
      } else {
        onChange(option.value, dropdownEvent)
      }
    }, 0)
  }

  const clearText = t('form.clear')
  const closeText = t('form.close')
  const openText = t('form.open')

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
          size={small ? 'small' : 'medium'}
          {...getTagProps({ index })}
        />
      ))
  }

  return (
    <FormControl variant="standard">
      <Autocomplete
        PaperComponent={small ? SmallStyledPaper : StyledPaper}
        clearIcon={<IonIcon name="close" />}
        clearText={clearText}
        closeText={closeText}
        componentsProps={{ popper: { placement: 'bottom-start' } }}
        disableCloseOnSelect={multiple}
        disabled={disabled}
        getOptionDisabled={(option: IOption<T>): boolean => option.disabled}
        limitTags={limitTags}
        multiple={multiple}
        onChange={handleChange}
        openText={openText}
        options={options}
        popupIcon={<IonIcon name="chevron-down" />}
        renderInput={(params): JSX.Element => {
          const { InputLabelProps, InputProps, ...inputProps } = params
          return (
            <InputText
              {...otherProps}
              {...inputProps}
              {...InputProps}
              inputRef={inputRef}
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
