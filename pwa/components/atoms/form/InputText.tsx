import InputBase from '@mui/material/InputBase'
import { styled } from '@mui/material/styles'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'
import { ReactChild } from 'react'
import { InputBaseProps } from '@mui/material/InputBase/InputBase'

interface IUnstyledInputText extends InputBaseProps {
  value: string
}

const UnstyledInputText = (props: IUnstyledInputText) => {
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

const InputTextStyled = styled(UnstyledInputText)(({ theme }) => ({
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
}))

interface IProps extends InputBaseProps {
  label?: string
  helperText?: ReactChild
  helperIcon?: string
  value: string
}

const InputText = (props: IProps) => {
  const { label, id, required, helperText, helperIcon, ...other } = props
  return (
    <FormControl variant="standard">
      {label && (
        <InputLabel shrink htmlFor={id} required={required}>
          {label}
        </InputLabel>
      )}
      <InputTextStyled {...other} id={id} required={required} />
      {helperText && (
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
      )}
    </FormControl>
  )
}

export default InputText
