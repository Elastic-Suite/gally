import Textarea from './Textarea'
import { renderWithProviders } from '~/services'

describe('TextareaAllFalse', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Textarea
        id="textarea"
        label="Label"
        placeholder="Describe your issue"
        required={false}
        disabled={false}
        maxLength={250}
        error={false}
        resizable={false}
      />
    )
    expect(container).toMatchSnapshot()
  })
})

describe('TextareaAllTrue', () => {
  it('match snapshot', () => {
    const { container } = renderWithProviders(
      <Textarea
        id="textarea"
        label="Label"
        placeholder="Describe your issue"
        required
        disabled
        maxLength={250}
        error
        resizable
      />
    )
    expect(container).toMatchSnapshot()
  })
})
