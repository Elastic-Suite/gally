/* eslint-disable react/destructuring-assignment */
import { useRef, useState } from 'react'
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled'
import { styled } from '@mui/system'
import { FormControl, InputLabel } from '@mui/material'

import { IOptions } from '~/types'

import Checkbox from './Checkbox'
import MultiSelect, { IMultiSelectUnstyledProps } from './MultiSelect'
import Select, { ISelectUnstyledProps } from './Select'

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

function isMultiple(props: IDropDownProps): props is IMultiSelectProps {
  return props.multiple
}

interface ICommonProps {
  label?: string
  multiple?: boolean
  options: IOptions<unknown>
  required?: boolean
}

export interface ISelectProps extends ISelectUnstyledProps, ICommonProps {}

export interface IMultiSelectProps
  extends IMultiSelectUnstyledProps,
    ICommonProps {}

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
      {isMultiple(props) ? (
        <MultiSelect
          listboxOpen={listboxOpen}
          onListboxOpenChange={handleListOpenChange}
          {...(selectProps as IMultiSelectProps)}
          value={props.value}
        >
          {options.map((option) => (
            <Option key={option.id || String(option.value)} {...option}>
              <Checkbox
                checked={props.value.includes(option.value)}
                label={option.label}
                list
                onMouseDown={handleCheckboxMouseDown}
              />
            </Option>
          ))}
        </MultiSelect>
      ) : (
        <Select {...(selectProps as ISelectProps)} value={props.value}>
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
