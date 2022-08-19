import { mockedFieldWithContext, mockedFieldWithoutContext } from '~/mocks'
import { updateHeaderPropertiesAccordingToPath } from './header'

describe('updateHeaderPropertiesAccordingToPath', () => {
  it('Should update properties with context', () => {
    expect(
      updateHeaderPropertiesAccordingToPath(
        mockedFieldWithContext,
        'admin/settings/attributes'
      )
    ).toEqual({
      ...mockedFieldWithContext,
      elasticsuite: {
        ...mockedFieldWithContext.elasticsuite,
        editable: false,
        position: 20,
        visible: true,
      },
    })

    expect(
      updateHeaderPropertiesAccordingToPath(
        mockedFieldWithContext,
        'search/configuration/attribute'
      )
    ).toEqual({
      ...mockedFieldWithContext,
      elasticsuite: {
        ...mockedFieldWithContext.elasticsuite,
        editable: false,
        position: 30,
        visible: false,
      },
    })
  })
  it('Should update properties without context', () => {
    expect(
      updateHeaderPropertiesAccordingToPath(
        mockedFieldWithoutContext,
        'admin/settings/attributes'
      )
    ).toEqual({
      ...mockedFieldWithoutContext,
      elasticsuite: {
        ...mockedFieldWithoutContext.elasticsuite,
        editable: false,
        position: 10,
        visible: true,
      },
    })
  })
  it('Should update properties with useless context', () => {
    expect(
      updateHeaderPropertiesAccordingToPath(
        mockedFieldWithContext,
        'test/useless'
      )
    ).toEqual({
      ...mockedFieldWithContext,
      elasticsuite: {
        ...mockedFieldWithContext.elasticsuite,
        editable: false,
        position: 10,
        visible: true,
      },
    })
  })
})
