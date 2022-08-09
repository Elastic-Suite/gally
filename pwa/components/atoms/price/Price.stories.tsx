import { ComponentMeta, ComponentStory } from '@storybook/react'
import PriceComponent from './Price'

export default {
  title: 'Atoms/Price',
  component: PriceComponent,
} as ComponentMeta<typeof PriceComponent>

const Template: ComponentStory<typeof PriceComponent> = (args) => (
  <PriceComponent {...args} />
)

export const Price = Template.bind({})
Price.args = {
  price: 100,
  countryCode: 'fr-FR',
  currency: 'EUR',
}
