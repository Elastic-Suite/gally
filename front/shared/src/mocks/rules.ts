import { IRuleAttribute, IRuleCombination } from '../types'

export const complexRule = {
  type: 'combination',
  operator: 'all',
  value: 'true',
  children: [
    {
      type: 'combination',
      operator: 'any',
      value: 'true',
      children: [
        {
          type: 'attribute',
          field: 'color',
          operator: 'is_one_of',
          attribute_type: 'float',
          value: '35',
        },
        {
          type: 'attribute',
          field: 'attribut set',
          operator: 'is',
          attribute_type: 'select',
          value: 'music accesories',
        },
        {
          type: 'attribute',
          field: 'age',
          operator: 'is',
          attribute_type: 'number',
          value: '6-9 years old',
        },
        {
          type: 'combination',
          operator: 'any',
          value: 'true',
          children: [
            {
              type: 'attribute',
              field: 'color',
              operator: 'is_one_of',
              attribute_type: 'select',
              value: 'rouge',
            },
            {
              type: 'attribute',
              field: 'attribut set',
              operator: 'is',
              attribute_type: 'select',
              value: 'music accesories',
            },
            {
              type: 'attribute',
              field: 'age',
              operator: 'is',
              attribute_type: 'select',
              value: '6-9 years old',
            },
          ],
        },
      ],
    },
    {
      type: 'combination',
      operator: 'any',
      value: 'true',
      children: [
        {
          type: 'attribute',
          field: 'color',
          operator: 'is_one_of',
          attribute_type: 'select',
          value: 'rouge',
        },
        {
          type: 'attribute',
          field: 'attribut set',
          operator: 'is',
          attribute_type: 'select',
          value: 'music accesories',
        },
        {
          type: 'attribute',
          field: 'age',
          operator: 'is',
          attribute_type: 'select',
          value: '6-9 years old',
        },
      ],
    },
  ],
}

export const attributeRule = complexRule.children[0]
  .children[0] as IRuleAttribute
export const combinationRule = complexRule.children[0]
  .children[3] as IRuleCombination
