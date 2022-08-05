import { renderWithProviders } from '~/utils/tests'

import PrimaryButton from '../buttons/PrimaryButton'

import SubTabPanel from './SubTabPanel'

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
