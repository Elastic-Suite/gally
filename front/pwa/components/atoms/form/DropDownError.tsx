import { useFormError } from '~/hooks'

import Dropdown, { IDropDownProps } from './DropDown'

interface IDropDownErrorProps<T> extends IDropDownProps<T> {
  showError?: boolean
}

function DropdownError<T>(props: IDropDownErrorProps<T>): JSX.Element {
  const { onChange, showError, ...inputProps } = props
  const formErrorProps = useFormError(onChange, showError)
  return <Dropdown {...formErrorProps} {...inputProps} />
}

export default DropdownError
