import { CSSProperties, ForwardedRef, forwardRef } from 'react'
import MultiSelectUnstyled, {
  MultiSelectUnstyledProps,
} from '@mui/base/MultiSelectUnstyled'
import {
  SmallStyledButton,
  SmallStyledListbox,
  SmallTransparentStyledButton,
  StyledButton,
  StyledListbox,
  StyledPopper,
  TransparentStyledButton,
} from './Select.styled'

export interface IMultiSelectUnstyledProps
  extends Omit<MultiSelectUnstyledProps<unknown>, 'components'> {
  small?: boolean
  style?: CSSProperties
  transparent?: boolean
}

function MultiSelect(
  props: IMultiSelectUnstyledProps,
  ref: ForwardedRef<HTMLElement>
): JSX.Element {
  const { small, style, transparent, ...otherProps } = props

  const components: MultiSelectUnstyledProps<unknown>['components'] = {
    Root: transparent
      ? small
        ? SmallTransparentStyledButton
        : TransparentStyledButton
      : small
      ? SmallStyledButton
      : StyledButton,
    Listbox: small ? SmallStyledListbox : StyledListbox,
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
