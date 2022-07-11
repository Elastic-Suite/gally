import { SyntheticEvent, useState } from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import TabPanel from './TabPanel'
import { a11yProps } from './a11yProps'

interface IProps {
  labels: Array<string>
  contents: string[]
}
export default function CustomTabs({ labels, contents }: IProps): JSX.Element {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const handleChange = (event: SyntheticEvent, newValue: number): void => {
    event.preventDefault()
    setActiveTabIndex(newValue)
  }

  return (
    <Box sx={{ width: '100%', marginTop: '-12px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTabIndex}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {labels.map((item: string, key: number) => (
            <Tab
              key={item}
              label={item}
              {...a11yProps('simple-tabpanel', key)}
            />
          ))}
        </Tabs>
      </Box>
      {contents.map((item: string, key: number) => (
        <TabPanel key={item} value={activeTabIndex} index={key}>
          {item}
        </TabPanel>
      ))}
    </Box>
  )
}
