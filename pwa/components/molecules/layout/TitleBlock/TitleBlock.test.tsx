import { renderWithProviders } from '~/utils/tests'

import Button from '../../../atoms/buttons/Button'

import TitleBlock from './TitleBlock'

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
        <Button disabled={false} endIcon="" size="medium" startIcon="">
          Hello world
        </Button>
      </TitleBlock>
    )
    expect(container).toMatchSnapshot()
  })
})
