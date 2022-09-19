import { ComponentMeta, ComponentStory } from '@storybook/react'

import PaginationComponent from './Pagination'

export default {
  title: 'molecules/CustomTable',
  component: PaginationComponent,
} as ComponentMeta<typeof PaginationComponent>

const Template: ComponentStory<typeof PaginationComponent> = (args) => (
  <PaginationComponent {...args} />
)

export const Pagination = Template.bind({})
Pagination.args = {
  isBottom: 'true',
  totalPages: 100,
  rowsPerPage: 10,
  rowsPerPageOptions: [5, 10, 25],
  currentPage: 0,
}
