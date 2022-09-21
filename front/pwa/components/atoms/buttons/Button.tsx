import { MouseEvent, useState } from 'react'
import { styled } from '@mui/system'
import { ButtonProps, MenuItem, Menu as MuiMenu } from '@mui/material'
import { IOptions } from 'shared'

import { PrimaryButton, SecondaryButton, TertiaryButton } from './Button.styled'

declare module '@mui/material' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface MenuProps {
    minWidth?: number
  }
}

const menuProps = ['minWidth']
const Menu = styled(MuiMenu, {
  shouldForwardProp: (prop: string) => !menuProps.includes(prop),
})(({ minWidth, theme }) => ({
  '& .MuiPaper-root': {
    margin: '4px 0',
    border: `1px solid ${theme.palette.colors.neutral['300']}`,
    borderRadius: 8,
    overflow: 'auto',
    boxSizing: 'border-box',
    outline: 0,
    boxShadow: 'none',
    minWidth,
  },
  '& .MuiList-root': {
    padding: 0,
  },
  '& .MuiButtonBase-root': {
    fontFamily: 'Inter',
    padding: '8px 12px',
    fontWeight: 400,
    fontSize: 12,
    lineHeight: '18px',
    color: theme.palette.colors.neutral['800'],
  },
  '& .MuiButtonBase-root:hover': {
    backgroundColor: theme.palette.colors.neutral['200'],
  },
}))

interface IProps extends ButtonProps {
  display: 'primary' | 'secondary' | 'tertiary'
  onSelect?: (value: unknown) => void
  options?: IOptions<unknown>
}

function Button(props: IProps): JSX.Element {
  const { display, id, onClick, onSelect, options, ...buttonProps } = props
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  let Component = PrimaryButton
  if (display === 'secondary') {
    Component = SecondaryButton
  } else if (display === 'tertiary') {
    Component = TertiaryButton
  }

  function handleOpen(event: MouseEvent<HTMLButtonElement>): void {
    setAnchorEl(event.currentTarget)
    if (onClick) {
      onClick(event)
    }
  }

  function handleClose(): void {
    setAnchorEl(null)
  }

  function handleClickOption(value: unknown) {
    return () => {
      onSelect(value)
      setAnchorEl(null)
    }
  }

  return (
    <>
      <Component {...buttonProps} onClick={options ? handleOpen : onClick} />
      {Boolean(options) && (
        <Menu
          anchorEl={anchorEl}
          componentsProps={{
            backdrop: { style: { backgroundColor: 'transparent' } },
          }}
          id={id}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': id,
          }}
          minWidth={anchorEl ? anchorEl.getBoundingClientRect().width : 0}
        >
          {options.map((option) => (
            <MenuItem
              key={option.id ?? String(option.value)}
              onClick={handleClickOption(option.value)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  )
}

Button.defaultProps = {
  display: 'primary',
  variant: 'contained',
}

export default Button
