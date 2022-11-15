import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import { styled } from '@mui/system'

const Slide = styled(Slider)(({ theme }) => ({
  '.MuiSlider-root': {
    height: '10px!important',
  },
  '.MuiSlider-rail': {
    border: '1px solid',
    borderColor: theme.palette.colors.neutral[900],
    backgroundColor: theme.palette.colors.neutral[300],
    '::after': {
      content: "''",
      position: 'absolute',
      top: 0,
      height: '100%',
      background: 'red',
      borderRadius: theme.spacing(1),
    },
  },
  '.MuiSlider-track': {
    display: 'none',
  },
  '.MuiSlider-valueLabelOpen': {
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.colors.primary[100],
    border: '1px solid',
    borderColor: theme.palette.colors.primary[300],
    color: theme.palette.colors.neutral[900],
    paddingRight: 0,
    paddingLeft: 0,
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: '14px',
    width: '34px',
    fontWeight: '600',
    top: '-5px',
    '::before': {
      display: 'none',
    },
  },
  '.MuiSlider-thumb': {
    color: theme.palette.colors.primary[400],
  },
}))

function SliderSizes(): JSX.Element {
  const [val, setVal] = useState<any>(0)

  console.log(val)
  return (
    <Box sx={{ marginTop: '80px' }} width={300}>
      <Slide
        valueLabelDisplay="on"
        defaultValue={0}
        aria-label="Default"
        max={100}
        min={-99}
        onChange={(event: any) => setVal(event.target.value)}
        sx={{
          '.MuiSlider-rail': {
            '::after': {
              left:
                val <= 0
                  ? `calc(50% - ${val.toString().split('-')[1] / 2}%)`
                  : '50%',
              width:
                val <= 0
                  ? `${val.toString().split('-')[1] / 2}%`
                  : `${val / 2}%`,
            },
          },
        }}
      />
    </Box>
  )
}

export default SliderSizes
