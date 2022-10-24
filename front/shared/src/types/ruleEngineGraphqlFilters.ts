import { IHydraMember } from './hydra'
import { IJsonldContext } from './jsonld'

export interface IRuleEngineGraphqlFilters
  extends IHydraMember,
    IJsonldContext {
  graphQlFilters: Record<string, unknown>
}
