import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'

import Merchandize from './Merchandize'

export default {
  title: 'Stateful/Merchandize',
  component: Merchandize,
  decorators: [
    (): JSX.Element => {
      // mock state
      const [first, setFirst] = useState(true)
      const [sec, setSec] = useState(false)
      const [val, setVal] = useState('10')

      const handleChange = (val: string): void => {
        setVal(val)
      }

      return (
        <Merchandize
          onVirtualChange={setFirst}
          virtualCategoryValue={first}
          onNameChange={setSec}
          categoryNameValue={sec}
          sortOptions={[
            { label: 'Position', value: '10' },
            { label: 'Product Name', value: '20' },
            { label: 'Price', value: '30' },
            { label: 'Performance', value: '40' },
          ]}
          onSortChange={handleChange}
          sortValue={val}
        />
      )
    },
  ],
} as ComponentMeta<typeof Merchandize>

const Template: ComponentStory<typeof Merchandize> = (args): JSX.Element => {
  return <Merchandize {...args} />
}

export const Default = Template.bind({})
Default.args = {}
