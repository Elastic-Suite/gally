import { ForwardedRef, forwardRef } from 'react'
import MultiSelectUnstyled, {
  MultiSelectUnstyledProps,
} from '@mui/base/MultiSelectUnstyled'
import { StyledButton, StyledListbox, StyledPopper } from './Select.styled'

function MultiSelect(
  props: MultiSelectUnstyledProps<unknown>,
  ref: ForwardedRef<HTMLElement>
): JSX.Element {
  const components: MultiSelectUnstyledProps<unknown>['components'] = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
  }

  return <MultiSelectUnstyled {...props} components={components} ref={ref} />
}

export default forwardRef(MultiSelect)
