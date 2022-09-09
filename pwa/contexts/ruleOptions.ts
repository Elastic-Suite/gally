import { createContext } from 'react'
import { IOptions } from '~/types'

type TypeRuleOptions = Record<string, IOptions<string>>
export const ruleOptionsContext =
  createContext<Map<string, TypeRuleOptions>>(null)
