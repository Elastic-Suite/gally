import { renderWithProviders } from '~/utils/tests'

import Textarea from './Textarea'

describe('Textarea match snapshot', () => {
  it('TextareaAllFalse', () => {
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

  it('TextareaAllTrue', () => {
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
