import { CSSProperties, ForwardedRef, forwardRef } from 'react'
import SelectUnstyled, { SelectUnstyledProps } from '@mui/base/SelectUnstyled'
import { StyledButton, StyledListbox, StyledPopper } from './Select.styled'

export interface ISelectUnstyledProps
  extends Omit<SelectUnstyledProps<unknown>, 'components'> {
  style?: CSSProperties
}

function Select(
  props: ISelectUnstyledProps,
  ref: ForwardedRef<HTMLButtonElement>
): JSX.Element {
  const { style, ...otherProps } = props

  const components: SelectUnstyledProps<unknown>['components'] = {
    Root: StyledButton,
    Listbox: StyledListbox,
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
