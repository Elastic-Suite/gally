import { renderWithProviders } from '~/utils/tests'

import Slider from './Slider'

describe('Slider match snapshot', () => {
  it('Slider Full', () => {
    const { container } = renderWithProviders(
      <Slider
        value={9}
        label="Boost value (%)"
        infoTooltip="boost value ..."
        fullWidth={false}
        width={376}
        helperText="helperText"
        helperIcon="close"
        margin="dense"
        required
      />
    )
    expect(container).toMatchSnapshot()
  })
  it('Slider Min', () => {
    const { container } = renderWithProviders(<Slider value={9} />)
    expect(container).toMatchSnapshot()
  })
})
