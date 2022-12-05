import { act, waitFor } from '@testing-library/react'
import {
  IRuleEngineOperators,
  combinationRule,
  fetchApi,
  isVirtualCategoryEnabled,
} from 'shared'

import ruleEngineOperators from '~/public/mocks/rule_engine_operators.json'
import { renderHookWithProviders } from '~/utils/tests'

import { useRuleEngineGraphqlFilters } from './useRuleEngineGraphqlFilters'

describe('useRuleEngineGraphqlFilters', () => {
  it('should load and return graphQL filters for non virtual category', async () => {
    ;(fetchApi as jest.Mock).mockClear()
    const catConf = {
      '@id': '/category_configurations/1',
      '@type': 'CategoryConfiguration',
      id: 1,
      useNameInProductSearch: false,
      isActive: true,
      isVirtual: false,
      defaultSorting: 'category__position',
      name: 'Category',
      category: '/categories/cat_1',
    }
    const category = {
      id: 'cat_1',
      isVirtual: false,
      name: 'Category',
      path: 'cat_1',
      level: 1,
    }
    const { result } = renderHookWithProviders(() =>
      useRuleEngineGraphqlFilters(
        catConf,
        ruleEngineOperators as IRuleEngineOperators,
        category
      )
    )
    await waitFor(() =>
      expect(result.current[0]).toEqual({ category__id: { eq: 'cat_1' } })
    )
    expect(fetchApi).not.toHaveBeenCalled()
  })

  it('should load and return graphQL filters for virtual category', async () => {
    ;(fetchApi as jest.Mock).mockClear()
    const catConf = {
      '@id': '/category_configurations/1',
      '@type': 'CategoryConfiguration',
      id: 1,
      useNameInProductSearch: false,
      isActive: true,
      isVirtual: true,
      defaultSorting: 'category__position',
      name: 'Category',
      category: '/categories/cat_1',
      virtualRule: combinationRule,
    }
    const category = {
      id: 'cat_1',
      isVirtual: true,
      name: 'Category',
      path: 'cat_1',
      level: 1,
    }
    const { result } = renderHookWithProviders(() =>
      useRuleEngineGraphqlFilters(
        catConf,
        ruleEngineOperators as IRuleEngineOperators,
        category
      )
    )
    await waitFor(() =>
      expect(result.current[0]).toEqual({
        boolFilter: {
          _must: [
            { fashion_color__value: { eq: '22' } },
            { price__price: { gte: 10 } },
          ],
        },
      })
    )
    expect(fetchApi).toHaveBeenCalled()
  })

  it('should not load virtual category graphQL filters if virtual category bundle is not enabled', async () => {
    ;(fetchApi as jest.Mock).mockClear()
    ;(isVirtualCategoryEnabled as jest.Mock).mockImplementationOnce(() => false)
    const catConf = {
      '@id': '/category_configurations/1',
      '@type': 'CategoryConfiguration',
      id: 1,
      useNameInProductSearch: false,
      isActive: true,
      isVirtual: true,
      defaultSorting: 'category__position',
      name: 'Category',
      category: '/categories/cat_1',
      virtualRule: combinationRule,
    }
    const category = {
      id: 'cat_1',
      isVirtual: true,
      name: 'Category',
      path: 'cat_1',
      level: 1,
    }
    const { result } = renderHookWithProviders(() =>
      useRuleEngineGraphqlFilters(
        catConf,
        ruleEngineOperators as IRuleEngineOperators,
        category
      )
    )
    await waitFor(() =>
      expect(result.current[0]).toEqual({ category__id: { eq: 'cat_1' } })
    )
    expect(fetchApi).not.toHaveBeenCalled()
  })

  it('should update graphQL filters', async () => {
    ;(fetchApi as jest.Mock).mockClear()
    const catConf = {
      '@id': '/category_configurations/1',
      '@type': 'CategoryConfiguration',
      id: 1,
      useNameInProductSearch: false,
      isActive: true,
      isVirtual: true,
      defaultSorting: 'category__position',
      name: 'Category',
      category: '/categories/cat_1',
      virtualRule: combinationRule,
    }
    const category = {
      id: 'cat_1',
      isVirtual: true,
      name: 'Category',
      path: 'cat_1',
      level: 1,
    }
    const { result } = renderHookWithProviders(() =>
      useRuleEngineGraphqlFilters(
        catConf,
        ruleEngineOperators as IRuleEngineOperators,
        category
      )
    )
    await waitFor(() =>
      expect(result.current[0]).toEqual({
        boolFilter: {
          _must: [
            { fashion_color__value: { eq: '22' } },
            { price__price: { gte: 10 } },
          ],
        },
      })
    )
    act(() =>
      result.current[1]({
        boolFilter: {
          _must: [{ fashion_color__value: { eq: '22' } }],
        },
      })
    )
    expect(result.current[0]).toEqual({
      boolFilter: {
        _must: [{ fashion_color__value: { eq: '22' } }],
      },
    })
  })
})
