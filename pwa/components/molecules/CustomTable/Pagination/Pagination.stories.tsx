import { ComponentStory, ComponentMeta } from '@storybook/react'

import Pagination from './Pagination'

export default {
  title: 'molecules/CustomTable/Pagination',
  component: Pagination,
} as ComponentMeta<typeof Pagination>

const Template: ComponentStory<typeof Pagination> = (args) => (
  <Pagination {...args} />
)

export const Default = Template.bind({})
Default.args = {
  isBottom: 'true',
  totalPages: 100,
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 25],
  currentPage: 0,
}
