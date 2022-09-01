import { IElasticSuiteProperty, IField } from '~/types'

function updateProperties(
  properties: IElasticSuiteProperty,
  key: string,
  value: number | boolean
): IElasticSuiteProperty {
  if (key === 'visible') {
    return {
      ...properties,
      visible: value as boolean,
    }
  } else if (key === 'editable') {
    return {
      ...properties,
      editable: value as boolean,
    }
  } else if (key === 'position') {
    return {
      ...properties,
      position: value as number,
    }
  }
  return properties
}

export function updatePropertiesAccordingToPath(
  field: IField,
  path: string
): IField {
  if (path.includes('admin/settings')) {
    path = 'settings_attribute'
  } else {
    path = path.replaceAll('/', '_').replace('_admin_', '')
  }
  if (field.elasticsuite?.context) {
    const [_, newPropertiesvalues] = Object.entries(field.elasticsuite?.context)
      .filter(([key, _]) => key === path)
      .flat()
    if (newPropertiesvalues) {
      let newProperties = field.elasticsuite
      // eslint-disable-next-line no-return-assign
      Object.entries(newPropertiesvalues).forEach(
        ([property, propertyValue]) =>
          (newProperties = updateProperties(
            newProperties,
            property,
            propertyValue
          ))
      )
      return {
        ...field,
        elasticsuite: newProperties,
      }
    }
  }
  return field
}
