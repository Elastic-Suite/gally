import {
  IFetch,
  IGraphqlSearchDocuments,
} from '@elastic-suite/gally-admin-shared'
import { IEntitiesHook } from './entity'

export interface IDocumentsHook extends IEntitiesHook {
  loadDocuments: (condition: boolean) => void
  documents: IFetch<IGraphqlSearchDocuments>
}
