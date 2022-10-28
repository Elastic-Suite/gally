import { FunctionComponent } from 'react'
import { FormControl, InputBase, InputBaseProps } from '@mui/material'
import { styled } from '@mui/system'

export interface IUnstyledInputTextProps extends InputBaseProps {
  dirty?: boolean
  small?: boolean
  transparent?: boolean
  value?: string
}

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiFormLabel-root': {
    color: theme.palette.colors.neutral[900],
  },
  '& .MuiFormLabel-root.Mui-error': {
    color: theme.palette.colors.neutral[900],
  },
}))

const inputTextStyledProps = ['dirty', 'small', 'transparent']
export const InputTextStyled = styled(
  InputBase as FunctionComponent<IUnstyledInputTextProps>,
  {
    shouldForwardProp: (prop: string) => !inputTextStyledProps.includes(prop),
  }
)(({ dirty, inputProps, small, theme, transparent, type, value }) => {
  let width
  if (type === 'number') {
    width = '3em'
  }
  if (inputProps?.max) {
    width = `${Math.max(String(inputProps.max).length, 3)}em`
  }
  if (inputProps?.maxLength) {
    width = `${Math.max(inputProps.maxLength, 3)}em`
  }

  return {
    minHeight: '40px',
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: theme.palette.colors.neutral['300'],
    padding: `3px ${theme.spacing(2)}`,
    minWidth: width ? 'unset' : 180,
    backgroundColor: theme.palette.colors.white,
    color: theme.palette.colors.neutral['900'],
    fontSize: 14,
    lineHeight: 0,
    fontWeight: 400,
    transition: 'border-color 0.3s linear',
    ...(Boolean(value) && {
      borderColor: theme.palette.colors.neutral['400'],
    }),
    ...(Boolean(small) && {
      minHeight: '26px',
      minWidth: 'initial',
      width: 'max-content',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      borderRadius: '13px',
    }),
    ...(Boolean(transparent) && {
      background: 'transparent',
      border: '0',
    }),
    ...(Boolean(dirty) && {
      fontWeight: 'bold',
    }),
    '& .MuiInputBase-input': {
      padding: 0,
      width,
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
      ...(Boolean(transparent) && {
        backgroundColor: 'rgba(0, 0, 0, 0.075)',
      }),
    },
    '& .MuiInputBase-input::placeholder': {
      color: theme.palette.colors.neutral['600'],
      opacity: 1,
      ...(Boolean(small) && {
        fontWeight: 'normal',
      }),
    },
    '&.MuiInputBase-colorSuccess': {
      borderColor: theme.palette.success.main,
    },
    '&.MuiInputBase-colorError': {
      borderColor: theme.palette.error.main,
    },
    '&.Mui-error': {
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
    // Autocomplete
    '&.MuiAutocomplete-inputRoot': {
      maxWidth: '400px',
    },
    '& .MuiAutocomplete-endAdornment': {
      top: 0,
      right: '12px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiAutocomplete-popupIndicator ion-icon, & .MuiAutocomplete-clearIndicator ion-icon':
      {
        fontSize: 14,
        color: theme.palette.colors.neutral['900'],
      },
    '& .MuiAutocomplete-tag': {
      marginTop: '2px',
      marginBottom: '2px',
    },
  }
})

export const Wrapper = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  'label + &': {
    marginTop: theme.spacing(3),
  },
}))

export const Suffix = styled('span')(({ theme }) => ({
  fontFamily: 'Inter',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  textAlign: 'center',
  color: theme.palette.colors.neutral[600],
  marginLeft: theme.spacing(1),
}))
