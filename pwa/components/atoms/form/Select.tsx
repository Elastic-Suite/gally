import { CSSProperties, ForwardedRef, forwardRef } from 'react'
import SelectUnstyled, { SelectUnstyledProps } from '@mui/base/SelectUnstyled'
import {
  SmallStyledButton,
  SmallStyledListbox,
  SmallTransparentStyledButton,
  StyledButton,
  StyledListbox,
  StyledPopper,
  TransparentStyledButton,
} from './Select.styled'

export interface ISelectUnstyledProps
  extends Omit<SelectUnstyledProps<unknown>, 'components'> {
  small?: boolean
  style?: CSSProperties
  transparent?: boolean
}

function Select(
  props: ISelectUnstyledProps,
  ref: ForwardedRef<HTMLButtonElement>
): JSX.Element {
  const { small, style, transparent, ...otherProps } = props

  const components: SelectUnstyledProps<unknown>['components'] = {
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
    <SelectUnstyled
      {...otherProps}
      components={components}
      componentsProps={componentsProps}
      ref={ref}
    />
  )
}

export default forwardRef(Select)
