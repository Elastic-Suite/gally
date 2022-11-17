import { IHydraLabelMember } from './hydra'
import { ISourceFieldOption } from './sourceFieldOptions'
export interface ISourceFieldOptionLabel extends IHydraLabelMember {
  sourceFieldOption: Pick<ISourceFieldOption, '@id' | '@type' | 'code'>
}
