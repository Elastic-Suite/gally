import { CSSProperties, ForwardedRef, forwardRef } from 'react'
import MultiSelectUnstyled, {
  MultiSelectUnstyledProps,
} from '@mui/base/MultiSelectUnstyled'
import { StyledButton, StyledListbox, StyledPopper } from './Select.styled'

export interface IMultiSelectUnstyledProps
  extends Omit<MultiSelectUnstyledProps<unknown>, 'components'> {
  style?: CSSProperties
}

function MultiSelect(
  props: IMultiSelectUnstyledProps,
  ref: ForwardedRef<HTMLElement>
): JSX.Element {
  const { style, ...otherProps } = props
  const components: MultiSelectUnstyledProps<unknown>['components'] = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
  }

  const componentsProps = {
    root: { style },
  }

  return (
    <MultiSelectUnstyled
      {...otherProps}
      components={components}
      componentsProps={componentsProps}
      ref={ref}
    />
  )
}

export default forwardRef(MultiSelect)
