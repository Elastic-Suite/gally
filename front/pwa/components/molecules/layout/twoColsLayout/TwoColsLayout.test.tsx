import { renderWithProviders } from '~/utils/tests'

import Button from '../../../atoms/buttons/Button'

import TwoColsLayout from './TwoColsLayout'

describe('TitleBlock match snapshot', () => {
  it('TwoColsLayout simple', () => {
    const { container } = renderWithProviders(
      <TwoColsLayout left="Hello World">Hello</TwoColsLayout>
    )
    expect(container).toMatchSnapshot()
  })

  it('TwoColsLayout with Array in left', () => {
    const { container } = renderWithProviders(
      <TwoColsLayout left={['hello world One', 'hello world Two']}>
        <Button disabled={false} endIcon="" size="medium" startIcon="">
          Hello world
        </Button>
      </TwoColsLayout>
    )
    expect(container).toMatchSnapshot()
  })
})
