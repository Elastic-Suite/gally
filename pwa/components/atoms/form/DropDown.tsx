import { forwardRef } from 'react'
import SelectUnstyled, {
  SelectUnstyledProps,
  selectUnstyledClasses,
} from '@mui/base/SelectUnstyled'
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled'
import PopperUnstyled from '@mui/base/PopperUnstyled'
import { styled } from '@mui/system'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'

const ButtonWithIcon = forwardRef<HTMLButtonElement>(function ButtonWithIcon(
  props,
  ref
) {
  return (
    <button {...props} ref={ref}>
      {props.children}
      <IonIcon name="chevron-down" />
    </button>
  )
})

const StyledButton = styled(ButtonWithIcon)(({ theme }) => ({
  fontFamily: 'Inter',
  padding: '10px 16px',
  background: theme.palette.colors.white,
  width: 180,
  height: 40,
  borderColor: theme.palette.colors.neutral['300'],
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: 8,
  fontWeight: 400,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.colors.neutral['600'],
  textAlign: 'left',
  transition: 'border-color 0.3s linear',
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& ion-icon': {
    float: 'right',
  },
  '&:hover': {
    borderColor: theme.palette.colors.neutral['400'],
  },
  '&:focus, &:focus-within': {
    borderColor: theme.palette.colors.neutral['600'],
  },
  '&.Mui-disabled': {
    borderColor: theme.palette.colors.neutral['300'],
    background: theme.palette.colors.neutral['300'],
    '& ion-icon': {
      color: theme.palette.colors.neutral['400'],
    },
  },

  [`&.${selectUnstyledClasses.focusVisible}`]: {
    outline: '3px solid pink',
  },

  [`&.${selectUnstyledClasses.expanded}`]: {
    borderColor: theme.palette.colors.neutral['600'],
    '& ion-icon': {
      transform: 'rotate(180deg)',
    },
  },
}))

const StyledListbox = styled('ul')(({ theme }) => ({
  position: 'relative',
  padding: 0,
  background: theme.palette.colors.white,
  width: 180,
  border: '1px solid ' + theme.palette.colors.neutral['300'],
  borderRadius: 8,
  overflow: 'auto',
  boxSizing: 'border-box',
  margin: '4px 0',
  outline: 0,
}))

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
    backgroundColor: theme.palette.colors.neutral['200'],
  },
  [`&.${optionUnstyledClasses.highlighted}`]: {
    backgroundColor: theme.palette.colors.neutral['200'],
  },
  [`&.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected}`]:
    {
      backgroundColor: theme.palette.colors.neutral['200'],
    },

  [`&.${optionUnstyledClasses.disabled}`]: {
    backgroundColor: theme.palette.colors.neutral['200'],
  },
  [`&:hover:not(.${optionUnstyledClasses.disabled})`]: {
    backgroundColor: theme.palette.colors.neutral['200'],
  },
}))

const StyledPopper = styled(PopperUnstyled)(() => ({
  zIndex: 1,
}))

function Select(props: SelectUnstyledProps<number>) {
  const components: SelectUnstyledProps<number>['components'] = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
    ...props.components,
  }

  return <SelectUnstyled {...props} components={components} />
}

export interface IOption {
  label: string
  value: number
}

export type IOptions = IOption[]

interface IProps extends SelectUnstyledProps<number> {
  label?: string
  required?: boolean
  options: IOptions
  disabled?: boolean
}

export default function DropDown(props: IProps) {
  const { label, options, value, required, disabled, ...other } = props

  return (
    <FormControl variant="standard">
      {label && (
        <InputLabel shrink required={required}>
          {label}
        </InputLabel>
      )}
      <Select {...other} value={value} disabled={disabled}>
        {options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </FormControl>
  )
}
