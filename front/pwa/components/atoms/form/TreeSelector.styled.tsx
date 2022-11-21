import { FunctionComponent } from 'react'
import {
  IconButton,
  IconButtonProps,
  InputAdornment,
  Popper,
} from '@mui/material'
import { styled } from '@mui/system'

import InputText from './InputText'

export const Root = styled('div')(() => ({
  display: 'inline-block',
}))

export const Input = styled(InputText)(() => ({
  paddingRight: '30px',
  flexWrap: 'wrap',
  maxWidth: '400px',
  '& .MuiInputBase-input': {
    width: 0,
    minWidth: '30px',
    flexGrow: 1,
    textOverflow: 'ellipsis',
  },
  '& .MuiChip-root': {
    margin: '2px 3px',
    maxWidth: 'calc(100% - 6px)',
  },
  '&.hasClearIcon': {
    paddingRight: '56px',
  },
  '&.hasClearIcon:hover .AutocompleteClearIndicator': {
    visibility: 'visible',
  },
  '&.focused .AutocompleteClearIndicator': {
    visibility: 'visible',
  },
  '@media (pointer: fine)': {
    '&:hover .AutocompleteClearIndicator': {
      visibility: 'visible',
    },
  },
}))

export const EndAdornment = styled(InputAdornment)(() => ({
  position: 'absolute',
  top: 0,
  right: '12px',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  margin: 0,
  maxHeight: 'initial',
}))

export const AutocompleteClearIndicator = styled(IconButton)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.colors.neutral['900'],
  padding: '4px',
  marginRight: '-2px',
  visibility: 'hidden',
}))

export const TreeContainer = styled('div')({
  padding: '10px 16px',
})

export interface IAutocompletePopupIndicatorProps extends IconButtonProps {
  popupOpen: boolean
}

const autocompletePopupIndicatorProps = ['popupOpen']
export const AutocompletePopupIndicator = styled(
  IconButton as FunctionComponent<IAutocompletePopupIndicatorProps>,
  {
    shouldForwardProp: (prop: string) =>
      !autocompletePopupIndicatorProps.includes(prop),
  }
)(({ popupOpen, theme }) => ({
  fontSize: 14,
  color: theme.palette.colors.neutral['900'],
  padding: '2px',
  marginRight: '-2px',
  ...(popupOpen && {
    transform: 'rotate(180deg)',
  }),
}))

export const TreePopper = styled(Popper)({
  zIndex: 1,
})
