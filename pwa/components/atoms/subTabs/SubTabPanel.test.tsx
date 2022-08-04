import SubTabPanel from './SubTabPanel'
import { renderWithProviders } from '~/services'
import PrimaryButton from '../buttons/PrimaryButton'

describe('SubTabPanel match snapshot', () => {
  it('SubTabPanel simple', () => {
    const { container } = renderWithProviders(
      <SubTabPanel id={5} value={5}>
        <PrimaryButton>Hello</PrimaryButton>
      </SubTabPanel>
    )
    expect(container).toMatchSnapshot()
  })
})
