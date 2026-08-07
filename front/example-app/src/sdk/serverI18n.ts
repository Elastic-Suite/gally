import commonEn from '../locales/en/common.json';
import categoryEn from '../locales/en/category.json';
import blogEn from '../locales/en/blog.json';
import cmsEn from '../locales/en/cms.json';
import searchEn from '../locales/en/search.json';

import commonFr from '../locales/fr/common.json';
import categoryFr from '../locales/fr/category.json';
import blogFr from '../locales/fr/blog.json';
import cmsFr from '../locales/fr/cms.json';
import searchFr from '../locales/fr/search.json';

import commonDe from '../locales/de/common.json';
import categoryDe from '../locales/de/category.json';
import blogDe from '../locales/de/blog.json';
import cmsDe from '../locales/de/cms.json';
import searchDe from '../locales/de/search.json';

// Minimal, server-safe string lookup for generateMetadata().
//
// It cannot use src/i18n — that module calls i18n.use(initReactI18next), which drags
// react-i18next into the import graph and makes it unusable from a Server Component.
// It is also a mutable singleton whose current language is whatever the last render set,
// which is not something metadata generation should depend on.
//
// Only the namespaces metadata actually reads are wired up here. Titles come from the
// same locale files the pages render from, so a `com_fr` URL gets a French <title> — the
// point of putting the locale in the path in the first place.

const RESOURCES: Record<string, Record<string, any>> = {
  en: { common: commonEn, category: categoryEn, blog: blogEn, cms: cmsEn, search: searchEn },
  fr: { common: commonFr, category: categoryFr, blog: blogFr, cms: cmsFr, search: searchFr },
  de: { common: commonDe, category: categoryDe, blog: blogDe, cms: cmsDe, search: searchDe },
};

// Mirrors i18next's fallbackLng: 'en' so a language with a missing namespace or key
// degrades to English rather than rendering the raw key into a <title>.
export function tServer(
  language: string,
  namespace: string,
  path: string,
  fallback = '',
  vars?: Record<string, string | number>
): string {
  for (const lang of [language, 'en']) {
    const value = path
      .split('.')
      .reduce<any>((acc, key) => (acc == null ? undefined : acc[key]), RESOURCES[lang]?.[namespace]);
    if (typeof value === 'string' && value) return interpolate(value, vars);
  }
  return interpolate(fallback, vars);
}

// i18next's {{name}} syntax, minus the plural/context machinery — metadata strings are
// deliberately written to avoid needing it, because reimplementing i18next's plural
// rules here would be a second, silently diverging copy of them.
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    key in vars ? String(vars[key]) : `{{${key}}}`
  );
}

// Some CMS strings are arrays of paragraphs (cms.json's `content`). Returns the first
// entry, which is what a meta description wants.
export function tServerFirst(
  language: string,
  namespace: string,
  path: string
): string | undefined {
  for (const lang of [language, 'en']) {
    const value = path
      .split('.')
      .reduce<any>((acc, key) => (acc == null ? undefined : acc[key]), RESOURCES[lang]?.[namespace]);
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    if (typeof value === 'string' && value) return value;
  }
  return undefined;
}
