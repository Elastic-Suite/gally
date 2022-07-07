import { ForwardedRef, forwardRef } from 'react'
import MultiSelectUnstyled, {
  MultiSelectUnstyledProps,
} from '@mui/base/MultiSelectUnstyled'
import { StyledButton, StyledListbox, StyledPopper } from './Select.styled'

const MultiSelect = forwardRef(function Select(
  props: MultiSelectUnstyledProps<unknown>,
  ref: ForwardedRef<HTMLElement>
) {
  const components: MultiSelectUnstyledProps<unknown>['components'] = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
  }

  return <MultiSelectUnstyled {...props} components={components} ref={ref} />
})

export default MultiSelect
