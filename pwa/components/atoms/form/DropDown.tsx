import { useRef, useState } from 'react'
import { SelectUnstyledProps } from '@mui/base/SelectUnstyled'
import { MultiSelectUnstyledProps } from '@mui/base/MultiSelectUnstyled'
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled'
import { styled } from '@mui/system'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

import Checkbox from './Checkbox'
import MultiSelect from './MultiSelect'
import Select from './Select'

const Option = styled(OptionUnstyled)(({ theme }) => ({
  fontFamily: 'Inter',
  listStyle: 'none',
  padding: '8px 12px',
  cursor: 'default',
  fontWeight: 400,
  fontSize: 12,
  lineHeight: '18px',
  color: theme.palette.colors.neutral['800'],
  '&:last-of-type': {
    borderBottom: 'none',
  },
  [`&.${optionUnstyledClasses.selected}`]: {
    fontWeight: 'bold',
  },
  [`&.${optionUnstyledClasses.highlighted}`]: {
    backgroundColor: theme.palette.colors.neutral['200'],
  },
  [`&.${optionUnstyledClasses.disabled}`]: {
    color: theme.palette.colors.neutral['400'],
  },
  [`&:hover:not(.${optionUnstyledClasses.disabled})`]: {
    backgroundColor: theme.palette.colors.neutral['200'],
  },
}))

export interface IOption {
  disabled?: boolean
  id?: string
  label: string
  value: unknown
}

export type IOptions = IOption[]

interface ICommonProps {
  label?: string
  multiple?: boolean
  options: IOptions
  required?: boolean
}

export interface ISelectProps
  extends Omit<SelectUnstyledProps<unknown>, 'components'>,
    ICommonProps {
  multiple?: false
}

export interface IMultiSelectProps
  extends Omit<MultiSelectUnstyledProps<unknown>, 'components'>,
    ICommonProps {
  multiple: true
}

export type IDropDownProps = ISelectProps | IMultiSelectProps

export default function DropDown(props: IDropDownProps): JSX.Element {
  const { label, multiple, options, required, value, ...selectProps } = props
  const [listboxOpen, setListboxOpen] = useState(false)
  const ignoreClick = useRef(false)

  function handleCheckboxMouseDown(): void {
    if (listboxOpen) {
      ignoreClick.current = true
    }
  }

  function handleListOpenChange(state: boolean): void {
    if (!ignoreClick.current) {
      setListboxOpen(state)
    }
    ignoreClick.current = false
  }

  return (
    <FormControl variant="standard">
      {label ? (
        <InputLabel shrink required={required}>
          {label}
        </InputLabel>
      ) : null}
      {multiple ? (
        <MultiSelect
          listboxOpen={listboxOpen}
          onListboxOpenChange={handleListOpenChange}
          {...(selectProps as IMultiSelectProps)}
          value={value}
        >
          {options.map((option) => (
            <Option key={option.id || String(option.value)} {...option}>
              <Checkbox
                checked={value.includes(option.value)}
                label={option.label}
                list
                onMouseDown={handleCheckboxMouseDown}
              />
            </Option>
          ))}
        </MultiSelect>
      ) : (
        <Select {...(selectProps as ISelectProps)} value={value}>
          {!required && <Option value="">&nbsp;</Option>}
          {options.map((option) => (
            <Option key={option.id || String(option.value)} {...option}>
              {option.label}
            </Option>
          ))}
        </Select>
      )}
    </FormControl>
  )
}
