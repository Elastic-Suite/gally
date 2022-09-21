import { renderWithProviders } from '~/utils/tests'

import Button from '../buttons/Button'

import SubTabPanel from './SubTabPanel'

describe('SubTabPanel match snapshot', () => {
  it('SubTabPanel simple', () => {
    const { container } = renderWithProviders(
      <SubTabPanel id={5} value={5}>
        <Button>Hello</Button>
      </SubTabPanel>
    )
    expect(container).toMatchSnapshot()
  })
})
