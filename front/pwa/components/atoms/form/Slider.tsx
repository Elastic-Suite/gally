import React, { ReactNode, forwardRef } from 'react'
import Box from '@mui/material/Box'
import { CustomIndicatorsNumber, Slide } from './Slider.styled'
import { FormHelperText, InputLabel } from '@mui/material'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

import InfoTooltip from './InfoTooltip'
import { StyledFormControl } from './InputText.styled'

export interface ISliderProps {
  error?: boolean
  fullWidth?: boolean
  infoTooltip?: string
  label?: string
  margin?: 'none' | 'dense' | 'normal'
  helperText?: ReactNode
  helperIcon?: string
  onChange?: (value: number) => void
  value: number
  width?: number
  required?: boolean
}

function Slider(props: ISliderProps): JSX.Element {
  const {
    error,
    fullWidth,
    helperText,
    helperIcon,
    infoTooltip,
    label,
    margin,
    onChange,
    required = true,
    value = 0,
    width = 376,
  } = props

  function handleChange(event: any): void {
    if (onChange) {
      onChange(event.target.value)
    }
  }
  const indicatorNumber = [-99, 0, 100]

  return (
    <StyledFormControl
      error={error}
      fullWidth={fullWidth}
      margin={margin}
      variant="standard"
    >
      {Boolean(label || infoTooltip) && (
        <InputLabel shrink required={required}>
          {label}
          {infoTooltip ? <InfoTooltip title={infoTooltip} /> : null}
        </InputLabel>
      )}
      <Box width={width} sx={{ marginTop: '36px' }}>
        <CustomIndicatorsNumber>
          {indicatorNumber.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </CustomIndicatorsNumber>
        <Slide
          valueLabelDisplay="on"
          aria-label="Default"
          max={100}
          value={value}
          min={-99}
          onChange={handleChange}
          sx={{
            '.MuiSlider-rail': {
              '::after': {
                left: value < 0 ? `calc(50% - ${-value / 2}%)` : '50%',
                width: `${Math.abs(value) / 2}%`,
              },
            },
          }}
        />
      </Box>
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
    </StyledFormControl>
  )
}

export default forwardRef<HTMLDivElement, ISliderProps>(Slider)
