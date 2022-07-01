import { ForwardedRef, forwardRef } from 'react'
import SelectUnstyled, { SelectUnstyledProps } from '@mui/base/SelectUnstyled'
import { StyledButton, StyledListbox, StyledPopper } from './Select.styled'

const Select = forwardRef(function Select(
  props: SelectUnstyledProps<unknown>,
  ref: ForwardedRef<HTMLUListElement>
) {
  const components: SelectUnstyledProps<unknown>['components'] = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
  }

  return <SelectUnstyled {...props} components={components} ref={ref} />
})

export default Select
