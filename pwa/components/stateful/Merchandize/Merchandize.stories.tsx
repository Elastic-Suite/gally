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

      const handleChange = (): void => {
        return null
      }
      return (
        <Merchandize
          onVirtualCategoryChange={setFirst}
          virtualCategoryValue={first}
          onCategoryNameChange={setSec}
          useCategoryNameValue={sec}
          {...{
            args: {
              disabled: false,
              label: 'Label',
              options: [
                { label: 'Ten', value: 10 },
                { label: 'Twenty', value: 20 },
                { label: 'Thirty', value: 30 },
                { label: 'Fourty', value: 40 },
              ],
              required: false,
            },
          }}
          {...{ onChange: handleChange }}
        />
      )
    },
  ],
} as ComponentMeta<typeof Merchandize>

const Template: ComponentStory<typeof Merchandize> = (args): JSX.Element => {
  return <Merchandize {...args} />
}

export const Default = Template.bind({})
Default.args = {
  args: {
    disabled: false,
    label: 'Label',
    options: [
      { label: 'Ten', value: 10 },
      { label: 'Twenty', value: 20 },
      { label: 'Thirty', value: 30 },
      { label: 'Fourty', value: 40 },
    ],
    required: false,
  },
}
