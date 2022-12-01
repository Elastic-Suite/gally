import { useCallback } from 'react'
import { Dayjs } from 'dayjs'

import { useFormError } from '~/hooks'

import DoubleDatePicker, { IDoubleDatePickerProps } from './DoubleDatePicker'

interface IRangeErrorProps extends IDoubleDatePickerProps {
  showError?: boolean
}

function RangeError(props: IRangeErrorProps): JSX.Element {
  const { onChange, showError, ...inputProps } = props
  const validator = useCallback(
    (value: { from: Dayjs | null; to: Dayjs | null }) => {
      if (!value.from || !value.to) {
        return null
      }
      if (value.to.diff(value.from) >= 0) {
        return null
      }
      return 'doubleDatePickerRange'
    },
    []
  )
  const formErrorProps = useFormError(onChange, showError, validator)
  return (
    <DoubleDatePicker
      {...inputProps}
      {...formErrorProps}
      helperIcon={formErrorProps.helperIcon ?? inputProps.helperIcon}
      helperText={formErrorProps.helperText ?? inputProps.helperText}
    />
  )
}

export default RangeError
