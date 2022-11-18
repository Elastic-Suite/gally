import { ReactNode } from 'react'
import Box from '@mui/material/Box'
import { CustomIndicatorsNumber, Slide } from './Slider.styled'
import { FormHelperText, InputLabel, SliderProps } from '@mui/material'

import IonIcon from '~/components/atoms/IonIcon/IonIcon'

import InfoTooltip from './InfoTooltip'
import { StyledFormControl } from './InputText.styled'

export interface ISliderProps extends Omit<SliderProps, 'onChange'> {
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

const indicatorNumber = [-99, 0, 100]

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
    required,
    value,
    width,
  } = props

  function handleChange(_: Event, value: number): void {
    if (onChange) {
      onChange(value)
    }
  }
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
      <Box
        width={!fullWidth ? width : undefined}
        sx={{ marginTop: label ? '24px' : 0 }}
      >
        <CustomIndicatorsNumber>
          {indicatorNumber.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </CustomIndicatorsNumber>
        <Slide
          valueLabelDisplay="on"
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

Slider.defaultProps = {
  width: 376,
}

export default Slider
