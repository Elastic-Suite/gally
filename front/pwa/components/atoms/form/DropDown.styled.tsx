import { styled } from '@mui/system'
import { getCustomScrollBarStyles } from 'shared'

export const StyledPaper = styled('div')(({ theme }) => ({
  minWidth: '180px',
  background: theme.palette.colors.white,
  border: `1px solid ${theme.palette.colors.neutral['300']}`,
  borderRadius: 8,
  margin: '4px 0',
  overflow: 'auto',
  ...getCustomScrollBarStyles(theme),
  '& .MuiAutocomplete-listbox': {
    padding: 0,
  },
  '& .MuiAutocomplete-listbox .MuiAutocomplete-option': {
    fontFamily: 'Inter',
    listStyle: 'none',
    padding: '8px 12px',
    cursor: 'default',
    fontWeight: 400,
    fontSize: 12,
    lineHeight: '18px',
    color: theme.palette.colors.neutral['800'],
    '&[aria-selected="true"]': {
      backgroundColor: 'transparent',
      fontWeight: 'bold',
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.colors.neutral['200'],
    },
    '&[aria-disabled="true"]': {
      color: theme.palette.colors.neutral['400'],
    },
    '&.Mui-focused:not([aria-disabled="true"])': {
      backgroundColor: theme.palette.colors.neutral['200'],
    },
  },
}))

export const SmallStyledPaper = styled(StyledPaper)({
  '& .MuiAutocomplete-listbox .MuiAutocomplete-option': {
    padding: '5px 12px',
  },
})
