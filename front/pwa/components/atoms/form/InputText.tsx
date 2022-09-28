import {
  ChangeEvent,
  ForwardedRef,
  FunctionComponent,
  ReactNode,
  forwardRef,
} from 'react'
import {
  FormControl,
  FormHelperText,
  InputBase,
  InputBaseProps,
  InputLabel,
} from '@mui/material'
import { styled } from '@mui/system'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

import InfoTooltip from './InfoTooltip'

interface IUnstyledInputTextProps extends InputBaseProps {
  dirty?: boolean
  small?: boolean
  transparent?: boolean
  value?: string
}

const inputTextStyledProps = ['dirty', 'small', 'transparent']
const InputTextStyled = styled(
  InputBase as FunctionComponent<IUnstyledInputTextProps>,
  {
    shouldForwardProp: (prop: string) => !inputTextStyledProps.includes(prop),
  }
)(({ dirty, small, theme, transparent, value }) => ({
  minHeight: '40px',
  borderRadius: 8,
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: theme.palette.colors.neutral['300'],
  padding: `3px ${theme.spacing(2)}`,
  minWidth: 180,
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
}))

export interface IInputTextProps
  extends Omit<IUnstyledInputTextProps, 'onChange'> {
  fullWidth?: boolean
  infoTooltip?: string
  label?: string
  helperText?: ReactNode
  helperIcon?: string
  onChange?: (value: string) => void
  withMargin?: boolean
}

function InputText(
  props: IInputTextProps,
  ref: ForwardedRef<HTMLDivElement>
): JSX.Element {
  const {
    fullWidth,
    id,
    infoTooltip,
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
    if (onChange) {
      onChange(event.target.value)
    }
  }

  return (
    <FormControl
      fullWidth={fullWidth}
      sx={{ marginBottom: withMargin ? 4 : 0 }}
      variant="standard"
    >
      {Boolean(label || infoTooltip) && (
        <InputLabel shrink htmlFor={id} required={required}>
          {label}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      )}
      <InputTextStyled
        id={id}
        onChange={handleChange}
        required={required}
        ref={ref}
        {...other}
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

export default forwardRef<HTMLDivElement, IInputTextProps>(InputText)
