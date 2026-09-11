import { Scenario } from './types';

const demoDress: Scenario = {
  id: 'demo-dress',
  i18nKey: 'demoDress',
  personas: {
    customer: { name: 'Camille', emoji: '👩' },
    merchant: { emoji: '👔' },
  },
  steps: [
    {
      act: 1,
      i18nKey: 'steps.1',
      persona: 'camille',
      target: '/search?q=tank%20dress',
      spotlight: '.search-bar-wrapper',
      action: { type: 'type_and_search', query: 'tank dress', startRoute: '/' },
    },
    {
      act: 2,
      i18nKey: 'steps.2',
      persona: 'camille',
      target: '/category/__first__',
      spotlight: '.facets-sidebar',
      action: { type: 'highlight_sequence', selector: '.facets-sidebar', childSelector: '.facet-group', maxItems: 4, interval: 1500 },
    },
    {
      act: 3,
      i18nKey: 'steps.3',
      persona: 'merchant',
      target: '/explain',
      spotlight: '.explain-ranking',
      action: { type: 'highlight_sequence', selector: '.explain-results-page', childSelector: '.explain-rank-card', maxItems: 3, interval: 2500 },
    },
    {
      act: 4,
      i18nKey: 'steps.4',
      persona: 'camille',
      target: '/search?q=tank%20dress',
      spotlight: '.products-grid',
      action: { type: 'add_to_cart_flow', searchQuery: 'tank dress' },
    },
    {
      act: 5,
      i18nKey: 'steps.5',
      persona: 'merchant',
      target: '/closing',
      action: { type: 'highlight_sequence', selector: '.tracking-timeline', childSelector: '.timeline-item', maxItems: 6, interval: 2000 },
    },
  ],
};

export default demoDress;
