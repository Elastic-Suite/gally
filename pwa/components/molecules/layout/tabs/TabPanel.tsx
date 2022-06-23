import React from 'react'
import Box from '@mui/material/Box'

interface IProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: IProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            paddingTop: 4,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 500,
            fontFamily: 'Inter',
          }}
        >
          {children}
        </Box>
      )}
    </div>
  )
}

export default TabPanel
