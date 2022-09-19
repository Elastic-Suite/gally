import { renderWithProviders } from '~/utils/tests'
import Score from './Score'

describe('Score', () => {
  it('Should match snapschot', () => {
    const { container } = renderWithProviders(
      <Score
        scoreValue={100.11}
        type="down"
        boostNumber={1}
        boostMultiplicator={1.1}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
