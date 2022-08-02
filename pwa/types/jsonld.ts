export interface IJsonldContext {
  '@context': string
}

export interface IJsonldType {
  '@type': string | string[]
}

export interface IJsonldId {
  '@id': string
}

export interface IJsonldBase extends IJsonldType, IJsonldId {}

export interface IJsonldString {
  '@value': string
}

export interface IJsonldBoolean {
  '@value': boolean
}

export interface IJsonldNumber {
  '@value': number
}

export type IJsonldValue = IJsonldString | IJsonldBoolean | IJsonldNumber

export interface IJsonldOwlEquivalentClass {
  'http://www.w3.org/2002/07/owl#allValuesFrom': [IJsonldId]
  'http://www.w3.org/2002/07/owl#onProperty': [IJsonldId]
}

export interface IJsonldRange {
  'http://www.w3.org/2002/07/owl#equivalentClass': [IJsonldOwlEquivalentClass]
}
