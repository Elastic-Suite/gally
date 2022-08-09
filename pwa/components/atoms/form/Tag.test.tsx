import { renderWithProviders } from '~/utils/tests'

import Tag from './Tag'

describe('Tag match snapshot', () => {
  it('Tag simple', () => {
    const { container } = renderWithProviders(<Tag>Hello world</Tag>)
    expect(container).toMatchSnapshot()
  })

  it('TagColor', () => {
    const { container } = renderWithProviders(
      <Tag color="success">Hello world</Tag>
    )
    expect(container).toMatchSnapshot()
  })
})
