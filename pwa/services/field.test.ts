import { mockedFieldWithContext, mockedFieldWithoutContext } from '~/mocks'
import { updatePropertiesAccordingToPath } from './field'

describe('updateHeaderPropertiesAccordingToPath', () => {
  it('Should update properties with context', () => {
    expect(
      updatePropertiesAccordingToPath(
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
      updatePropertiesAccordingToPath(
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
      updatePropertiesAccordingToPath(
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
      updatePropertiesAccordingToPath(mockedFieldWithContext, 'test/useless')
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
