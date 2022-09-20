import {
  fieldBoolean,
  fieldDropdown,
  fieldDropdownWithApiOptions,
  fieldDropdownWithContext,
} from '../mocks'

import {
  hasFieldOptions,
  isDropdownStaticOptions,
  updatePropertiesAccordingToPath,
} from './field'

describe('Field service', () => {
  describe('updatePropertiesAccordingToPath', () => {
    it('Should update properties with context', () => {
      expect(
        updatePropertiesAccordingToPath(
          fieldDropdownWithContext,
          'admin/settings/attributes'
        )
      ).toEqual({
        ...fieldDropdownWithContext,
        elasticsuite: {
          ...fieldDropdownWithContext.elasticsuite,
          editable: false,
          position: 20,
          visible: true,
        },
      })
      expect(
        updatePropertiesAccordingToPath(
          fieldDropdownWithContext,
          'search/configuration/attribute'
        )
      ).toEqual({
        ...fieldDropdownWithContext,
        elasticsuite: {
          ...fieldDropdownWithContext.elasticsuite,
          editable: false,
          position: 30,
          visible: false,
        },
      })
    })

    it('Should update properties without context', () => {
      expect(
        updatePropertiesAccordingToPath(
          fieldDropdown,
          'admin/settings/attributes'
        )
      ).toEqual({
        ...fieldDropdown,
        elasticsuite: {
          ...fieldDropdown.elasticsuite,
          editable: false,
          position: 10,
          visible: true,
        },
      })
    })

    it('Should update properties with useless context', () => {
      expect(
        updatePropertiesAccordingToPath(
          fieldDropdownWithContext,
          'test/useless'
        )
      ).toEqual({
        ...fieldDropdownWithContext,
        elasticsuite: {
          ...fieldDropdownWithContext.elasticsuite,
          editable: false,
          position: 10,
          visible: true,
        },
      })
    })
  })

  describe('hasFieldOptions', () => {
    it('should check if field has options (defined in schema)', () => {
      expect(hasFieldOptions(fieldBoolean)).toEqual(false)
      expect(hasFieldOptions(fieldDropdown)).toEqual(true)
    })
  })

  describe('isDropdownStaticOptions', () => {
    it('should check if field schema options are static or not', () => {
      expect(
        isDropdownStaticOptions(fieldDropdown.elasticsuite.options)
      ).toEqual(true)
      expect(
        isDropdownStaticOptions(
          fieldDropdownWithApiOptions.elasticsuite.options
        )
      ).toEqual(false)
    })
  })
})
