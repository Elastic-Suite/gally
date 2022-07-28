import Tag from './Tag'
import { renderWithProviders } from '~/services'

describe('Tag match snapshot', () => {
  it('Tag simple', () => {
    const { container } = renderWithProviders(<Tag>Hello world</Tag>)
    expect(container).toMatchSnapshot()
  })

  it('TagOnIconClick', () => {
    const { container } = renderWithProviders(
      <Tag onIconClick={(): void => console.log('Hello world')}>
        Hello world
      </Tag>
    )
    expect(container).toMatchSnapshot()
  })

  it('TagColor', () => {
    const { container } = renderWithProviders(
      <Tag color="red">Hello world</Tag>
    )
    expect(container).toMatchSnapshot()
  })
})
