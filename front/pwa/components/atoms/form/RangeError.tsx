import { useFormError } from '~/hooks'

import Range, { IRangeProps } from './Range'

interface IRangeErrorProps extends IRangeProps {
  showError?: boolean
}

function RangeError(props: IRangeErrorProps): JSX.Element {
  const { onChange, showError, ...inputProps } = props
  const formErrorProps = useFormError(onChange, showError)
  return (
    <Range
      {...inputProps}
      {...formErrorProps}
      helperIcon={formErrorProps.helperIcon ?? inputProps.helperIcon}
      helperText={formErrorProps.helperText ?? inputProps.helperText}
    />
  )
}

export default RangeError
