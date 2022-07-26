import { ReactChild } from 'react'
import { Box } from '@mui/material'

interface IProps {
  children?: ReactChild
  id: number
  value: number
}

function TabPanel(props: IProps): JSX.Element {
  const { children, value, id, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== id}
      id={`simple-tabpanel-${id}`}
      aria-labelledby={`simple-tab-${id}`}
      {...other}
    >
      {value === id && (
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
