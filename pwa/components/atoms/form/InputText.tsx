import { ChangeEvent, ReactChild } from 'react'
import {
  FormControl,
  FormHelperText,
  InputBase,
  InputBaseProps,
  InputLabel,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

interface IUnstyledInputTextProps extends InputBaseProps {
  small?: boolean
  value: string
}

function UnstyledInputText(props: IUnstyledInputTextProps): JSX.Element {
  const { value } = props

  return (
    <InputBase
      {...props}
      sx={
        value?.length > 0
          ? { borderColor: 'colors.neutral.400' }
          : { borderColor: 'colors.neutral.300' }
      }
    />
  )
}

const inputTextStyledProps = ['small']
const InputTextStyled = styled(UnstyledInputText, {
  shouldForwardProp: (prop: string) => !inputTextStyledProps.includes(prop),
})(({ small, theme }) => ({
  borderRadius: 8,
  borderStyle: 'solid',
  borderWidth: '1px',
  padding: '9px 16px',
  width: 180,
  backgroundColor: theme.palette.colors.white,
  color: theme.palette.colors.neutral['900'],
  fontSize: 14,
  lineHeight: 20,
  fontWeight: 400,
  transition: 'border-color 0.3s linear',
  '& .MuiInputBase-input': {
    padding: 0,
    '&::placeholder': {
      color: theme.palette.colors.neutral['600'],
      opacity: 1,
    },
    '&.Mui-disabled': {
      color: theme.palette.colors.neutral['600'],
      WebkitTextFillColor: theme.palette.colors.neutral['600'],
      '&.MuiInputBase-inputAdornedEnd': {
        color: theme.palette.colors.neutral['500'],
        WebkitTextFillColor: theme.palette.colors.neutral['500'],
      },
    },
    ...(Boolean(small) && {
      width: '72px',
      fontSize: '12px',
      fontWeight: 'bold',
    }),
  },
  '&:hover': {
    borderColor: theme.palette.colors.neutral['400'],
  },
  '&:focus-within': {
    borderColor: theme.palette.colors.neutral['600'],
  },
  '& .MuiInputBase-input::placeholder': {
    color: theme.palette.colors.neutral['600'],
    opacity: 1,
    ...(Boolean(small) && {
      fontWeight: 'normal',
    }),
  },
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '&.MuiInputBase-colorSuccess': {
    borderColor: theme.palette.success.main,
  },
  '&.MuiInputBase-colorError': {
    borderColor: theme.palette.error.main,
  },
  '&.Mui-disabled': {
    borderColor: theme.palette.colors.neutral['300'],
    backgroundColor: theme.palette.colors.neutral['300'],
  },
  '& .MuiInputAdornment-root': {
    fontSize: 14,
    color: theme.palette.colors.neutral['900'],
  },
  ...(Boolean(small) && {
    height: '26px',
    width: 'max-content',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: '13px',
  }),
}))

export interface IInputTextProps
  extends Omit<IUnstyledInputTextProps, 'onChange'> {
  fullWidth?: boolean
  label?: string
  helperText?: ReactChild
  helperIcon?: string
  onChange?: (value: string) => void
  value: string
  withMargin?: boolean
}

function InputText(props: IInputTextProps): JSX.Element {
  const {
    fullWidth,
    id,
    label,
    onChange,
    helperText,
    helperIcon,
    required,
    withMargin,
    ...other
  } = props

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    onChange(event.target.value)
  }

  return (
    <FormControl
      fullWidth={fullWidth}
      sx={{ marginBottom: withMargin ? 4 : 0 }}
      variant="standard"
    >
      {label ? (
        <InputLabel shrink htmlFor={id} required={required}>
          {label}
        </InputLabel>
      ) : null}
      <InputTextStyled
        {...other}
        id={id}
        onChange={handleChange}
        required={required}
      />
      {helperText ? (
        <FormHelperText>
          {helperIcon ? (
            <IonIcon
              name={helperIcon}
              style={{ fontSize: 18, marginRight: 2 }}
            />
          ) : (
            ''
          )}
          {helperText}
        </FormHelperText>
      ) : null}
    </FormControl>
  )
}

export default InputText
