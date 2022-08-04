import TitleBlock from './TitleBlock'
import { renderWithProviders } from '~/services'
import PrimaryButton from '../../../atoms/buttons/PrimaryButton'

describe('TitleBlock match snapshot', () => {
  it('PageTitle simple', () => {
    const { container } = renderWithProviders(
      <TitleBlock title="Hello World">Hello</TitleBlock>
    )
    expect(container).toMatchSnapshot()
  })

  it('PageTitle with Composant on Children', () => {
    const { container } = renderWithProviders(
      <TitleBlock title="Hello World">
        <PrimaryButton disabled={false} endIcon="" size="medium" startIcon="">
          Hello world
        </PrimaryButton>
      </TitleBlock>
    )
    expect(container).toMatchSnapshot()
  })
})
