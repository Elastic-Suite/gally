import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from '../locales/en/common.json';
import searchEn from '../locales/en/search.json';
import facetsEn from '../locales/en/facets.json';
import productEn from '../locales/en/product.json';
import categoryEn from '../locales/en/category.json';
import cartEn from '../locales/en/cart.json';
import cmsEn from '../locales/en/cms.json';
import blogEn from '../locales/en/blog.json';
import demoEn from '../locales/en/demo.json';
import scenariosEn from '../locales/en/scenarios.json';
import vectorSearchEn from '../locales/en/vectorSearch.json';

import commonFr from '../locales/fr/common.json';
import searchFr from '../locales/fr/search.json';
import facetsFr from '../locales/fr/facets.json';
import productFr from '../locales/fr/product.json';
import categoryFr from '../locales/fr/category.json';
import cartFr from '../locales/fr/cart.json';
import cmsFr from '../locales/fr/cms.json';
import blogFr from '../locales/fr/blog.json';
import demoFr from '../locales/fr/demo.json';
import scenariosFr from '../locales/fr/scenarios.json';
import vectorSearchFr from '../locales/fr/vectorSearch.json';

import commonDe from '../locales/de/common.json';
import searchDe from '../locales/de/search.json';
import facetsDe from '../locales/de/facets.json';
import productDe from '../locales/de/product.json';
import categoryDe from '../locales/de/category.json';
import cartDe from '../locales/de/cart.json';
import cmsDe from '../locales/de/cms.json';
import blogDe from '../locales/de/blog.json';
import demoDe from '../locales/de/demo.json';
import scenariosDe from '../locales/de/scenarios.json';
import vectorSearchDe from '../locales/de/vectorSearch.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  defaultNS: 'common',
  ns: ['common', 'search', 'facets', 'product', 'category', 'cart', 'cms', 'blog', 'demo', 'scenarios', 'vectorSearch'],
  debug: process.env.NODE_ENV === 'development',
  interpolation: { escapeValue: false },
  resources: {
    en: {
      common: commonEn, search: searchEn, facets: facetsEn, product: productEn,
      category: categoryEn, cart: cartEn, cms: cmsEn, blog: blogEn, demo: demoEn, scenarios: scenariosEn,
      vectorSearch: vectorSearchEn,
    },
    fr: {
      common: commonFr, search: searchFr, facets: facetsFr, product: productFr,
      category: categoryFr, cart: cartFr, cms: cmsFr, blog: blogFr, demo: demoFr, scenarios: scenariosFr,
      vectorSearch: vectorSearchFr,
    },
    de: {
      common: commonDe, search: searchDe, facets: facetsDe, product: productDe,
      category: categoryDe, cart: cartDe, cms: cmsDe, blog: blogDe, demo: demoDe, scenarios: scenariosDe,
      vectorSearch: vectorSearchDe,
    },
  },
});

export default i18n;
