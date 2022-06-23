import React, { SyntheticEvent, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import TabPanel from './TabPanel'
import AllyProps from './AllyProps'

interface IProps {
  labels: Array<string>
  contents: any
}

export default function CustomTabs({ labels, contents }: IProps) {
  const [value, setValue] = useState(0)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', marginTop: '-12px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {labels.map((item: any, key: number) => (
            <Tab
              key={key}
              label={item}
              {...AllyProps('simple-tabpanel', key)}
            />
          ))}
        </Tabs>
      </Box>
      {contents.map((item: any, key: number) => (
        <TabPanel key={key} value={value} index={key}>
          {item}
        </TabPanel>
      ))}
    </Box>
  )
}
