import TwoColsLayout from './TwoColsLayout'
import { renderWithProviders } from '~/services'
import PrimaryButton from '../../../atoms/buttons/PrimaryButton'

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
        <PrimaryButton disabled={false} endIcon="" size="medium" startIcon="">
          Hello world
        </PrimaryButton>
      </TwoColsLayout>
    )
    expect(container).toMatchSnapshot()
  })
})
