import {
  ChangeEvent,
  HTMLAttributes,
  ReactNode,
  Ref,
  SyntheticEvent,
} from 'react'
import { FormHelperText, InputLabel } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { styled } from '@mui/system'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

import InfoTooltip from './InfoTooltip'
import {
  IUnstyledInputTextProps,
  InputTextStyled,
  Suffix,
  Wrapper,
} from './InputText.styled'

interface IContainerProps extends HTMLAttributes<HTMLDivElement> {
  margin: 'dense' | 'none' | 'normal'
}

function Container(props: IContainerProps): JSX.Element {
  const { margin, ...divProps } = props
  return <div {...divProps} />
}

export const ContainerStyled = styled(Container)(({ margin, theme }) => ({
  position: 'relative',
  ...(margin === 'dense' && {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
  }),
  ...(margin === 'normal' && {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  }),
  '& label': {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  '& .MuiFormLabel-root': {
    color: theme.palette.colors.neutral[900],
  },
  '& .MuiFormLabel-root.Mui-error': {
    color: theme.palette.colors.neutral[900],
  },
}))

export const InputRangeStyled = styled(InputTextStyled)({
  margin: '0 0 0 0.5em',
})

export const Separator = styled('span')({
  margin: '0 0.5em',
})

export interface IRangeProps
  extends Omit<
    IUnstyledInputTextProps,
    'margin' | 'onChange' | 'placeholder' | 'value'
  > {
  error?: boolean
  fullWidth?: boolean
  infoTooltip?: string
  inputRef?: Ref<HTMLInputElement>
  helperText?: ReactNode
  helperIcon?: string
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  placeholder: string[]
  onChange?: (value: (string | number)[], event: SyntheticEvent) => void
  suffix?: ReactNode
  value: (string | number)[]
}

function Range(props: IRangeProps): JSX.Element {
  const { t } = useTranslation('common')
  const {
    error,
    fullWidth,
    helperText,
    helperIcon,
    id,
    infoTooltip,
    inputProps,
    label,
    margin,
    onChange,
    placeholder,
    required,
    suffix,
    value,
    ...InputProps
  } = props
  const { type } = InputProps
  const [placeholderFrom, placeholderTo] = placeholder
  const [valueFrom, valueTo] = value

  function handleChangeFrom(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { value } = event.target
    if (onChange) {
      if (type === 'number') {
        onChange(
          [!required && value === '' ? value : Number(value), valueTo],
          event
        )
      } else {
        onChange([value, valueTo], event)
      }
    }
  }

  function handleChangeTo(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    const { value } = event.target
    if (onChange) {
      if (type === 'number') {
        onChange(
          [valueFrom, !required && value === '' ? value : Number(value)],
          event
        )
      } else {
        onChange([valueFrom, value], event)
      }
    }
  }

  return (
    <ContainerStyled margin={margin}>
      {Boolean(label || infoTooltip) && (
        <InputLabel shrink htmlFor={id} required={required}>
          {label}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      )}
      <Wrapper className="InputText__Wrapper">
        {t('form.from')}
        <InputRangeStyled
          error={error}
          id={id}
          onChange={handleChangeFrom}
          required={required}
          {...InputProps}
          inputProps={inputProps}
          placeholder={placeholderFrom}
          value={String(valueFrom)}
        />
        <Separator>-</Separator>
        {t('form.to')}
        <InputRangeStyled
          error={error}
          onChange={handleChangeTo}
          required={required}
          {...InputProps}
          inputProps={inputProps}
          placeholder={placeholderTo}
          value={String(valueTo)}
        />
        {Boolean(suffix) && <Suffix>{suffix}</Suffix>}
      </Wrapper>
      {Boolean(helperText) && (
        <FormHelperText>
          {Boolean(helperIcon) && (
            <IonIcon
              name={helperIcon}
              style={{ fontSize: 18, marginRight: 2 }}
            />
          )}
          {helperText}
        </FormHelperText>
      )}
    </ContainerStyled>
  )
}

Range.defaultProps = {
  margin: 'none',
  placeholder: [],
  type: 'number',
}

export default Range
