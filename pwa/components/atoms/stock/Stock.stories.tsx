import { ComponentMeta, ComponentStory } from '@storybook/react'
import StockComponent from './Stock'

export default {
  title: 'Atoms/Stock',
  component: StockComponent,
} as ComponentMeta<typeof StockComponent>

const Template: ComponentStory<typeof StockComponent> = (args) => (
  <StockComponent {...args} />
)

export const Stock = Template.bind({})
Stock.args = {
  stockStatus: true,
}
