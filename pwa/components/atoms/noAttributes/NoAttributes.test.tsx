import { renderWithProviders } from '~/utils/tests'
import NoAttributes from './NoAttributes'

describe('NoAttributes', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <NoAttributes
        title={
          "Aucun attribut n'a été indiqué comme filtrable dans les settings blabla faut trouver un truc mieux tavu"
        }
        btnTitle="Add filtrable attributes"
        btnHref="admin/settings/attributes"
      />
    )
    expect(container).toMatchSnapshot()
  })
})
