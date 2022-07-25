import Tag from './Tag'
import { renderWithProviders } from '~/services'

describe('Tag', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(<Tag>Hello world</Tag>)
    expect(container).toMatchSnapshot()
  })
})

describe('TagOnIconClick', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Tag onIconClick={(): void => console.log('Hello world')}>
        Hello world
      </Tag>
    )
    expect(container).toMatchSnapshot()
  })
})

describe('TagColor', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Tag color="red">Hello world</Tag>
    )
    expect(container).toMatchSnapshot()
  })
})
