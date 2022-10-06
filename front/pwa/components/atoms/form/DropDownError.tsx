import { useFormError } from '~/hooks'

import Dropdown, { IDropDownProps } from './DropDown'

function DropdownError<T>(props: IDropDownProps<T>): JSX.Element {
  const { onChange, ...inputProps } = props
  const formErrorProps = useFormError(onChange)
  return <Dropdown {...formErrorProps} {...inputProps} />
}

export default DropdownError
