import { ForwardedRef, forwardRef } from 'react'
import SelectUnstyled, { SelectUnstyledProps } from '@mui/base/SelectUnstyled'
import { StyledButton, StyledListbox, StyledPopper } from './Select.styled'

function Select(
  props: SelectUnstyledProps<unknown>,
  ref: ForwardedRef<HTMLUListElement>
): JSX.Element {
  const components: SelectUnstyledProps<unknown>['components'] = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
  }

  return <SelectUnstyled {...props} components={components} ref={ref} />
}

export default forwardRef(Select)
