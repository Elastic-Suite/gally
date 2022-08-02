import { IJsonldBase, IJsonldContext, IJsonldId } from './jsonld'

export type IEntrypoint = Record<string, string> & IJsonldBase & IJsonldContext

export type IExpandedEntrypoint = Record<string, [IJsonldId]> &
  IJsonldBase &
  IJsonldContext
