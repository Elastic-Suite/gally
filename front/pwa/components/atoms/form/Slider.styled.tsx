import { styled } from '@mui/system'
import SliderMui from '@mui/material/Slider'

export const Slide = styled(SliderMui)(({ theme }) => ({
  '.MuiSlider-root': {
    height: '10px!important',
  },
  '.MuiSlider-rail': {
    height: '7px',
    border: '1px solid',
    boxSizing: 'border-box',
    borderColor: theme.palette.colors.neutral[400],
    backgroundColor: theme.palette.colors.neutral[300],
    '::after': {
      content: "''",
      position: 'absolute',
      top: -1,
      height: '100%',
      background: theme.palette.colors.primary[400],
      borderRadius: theme.spacing(1),
      border: '1px solid',
      borderColor: theme.palette.colors.primary[500],
    },
  },
  '.MuiSlider-track': {
    display: 'none',
  },
  '.MuiSlider-valueLabelOpen': {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.colors.primary[100],
    border: '1px solid',
    borderColor: theme.palette.colors.primary[200],
    color: theme.palette.colors.neutral[900],
    paddingRight: 0,
    paddingLeft: 0,
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: '14px',
    width: '34px',
    fontWeight: '600',
    top: '-6px',
    '::before': {
      display: 'none',
    },
  },
  '.MuiSlider-thumb': {
    color: theme.palette.colors.primary[500],
    border: '1px solid',
    borderColor: theme.palette.colors.primary[100],
  },
}))

export const CustomIndicatorsNumber = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  color: theme.palette.colors.neutral[900],
  fontWeight: '400',
  lineHeight: '18px',
  fontSize: '12px',
}))
