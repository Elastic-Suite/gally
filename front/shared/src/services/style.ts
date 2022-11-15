import { CSSProperties } from 'react'
import { Theme } from '@mui/system'

export function getCustomScrollBarStyles(
  theme: Theme
): Record<string, CSSProperties> {
  return {
    '&::-webkit-scrollbar': {
      position: 'sticky',
      bottom: '150px',
      height: '4px',
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: `${theme.palette.colors.white}`,
      top: '15px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: `${theme.palette.neutral.main}`,
      borderRadius: '15px',
      top: '15px',
    },
  }
}
