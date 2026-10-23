// @vitest-environment node
// The locale files: the three languages stay in sync, and every namespace is loaded.
// A broken translation never throws - the client shows the raw key - so only a test sees it.
// See specs/test-plan-translations.md, parts A and B.
import { readdirSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import { describe, expect, it } from 'vitest'
import i18n from '../i18n'
import { DEFAULT_LANGUAGE, LANGUAGES } from '../sdk/catalogs'

const LOCALES = resolve(__dirname, '../locales')
const LANGS = readdirSync(LOCALES).sort()
const NAMESPACES = readdirSync(join(LOCALES, 'en'))
  .map((f) => f.replace(/\.json$/, ''))
  .sort()
const OTHERS = LANGS.filter((l) => l !== 'en')

type Leaf = string | string[]

// Nested keys flattened to `a.b.c`; arrays are leaves, as i18next reads them.
function flatten(obj: Record<string, unknown>, prefix = ''): Map<string, Leaf> {
  const out = new Map<string, Leaf>()
  for (const [k, v] of Object.entries(obj)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v as Record<string, unknown>, `${prefix}${k}.`).forEach(
        (val, key) => out.set(key, val)
      )
    } else {
      out.set(prefix + k, v as Leaf)
    }
  }
  return out
}

const load = (lang: string, ns: string) =>
  flatten(JSON.parse(readFileSync(join(LOCALES, lang, `${ns}.json`), 'utf8')))

const placeholders = (value: Leaf) =>
  [
    ...[value]
      .flat()
      .join(' ')
      .matchAll(/\{\{\s*([^}\s]+)\s*\}\}/g),
  ]
    .map((m) => m[1])
    .sort()

// Strings in French and German that are, correctly, the same as in English: the same word in both
// languages, or a brand. A new identical string fails here until it is translated, or added to the
// list on purpose (bugfix-german-locale-untranslated). Values made only of placeholders and
// punctuation are not checked.
const SAME_AS_ENGLISH: Record<string, string[]> = {
  fr: [
    'blog:title',
    'blog:count_one',
    'blog:count_other',
    'blog:browse.type',
    'cart:summary.total',
    'cart:checkout.steps.confirmation',
    'cart:checkout.placeholders.cvc',
    'common:nav.cms',
    'common:meta.pagination',
    'common:sort.fields.category__position',
    'demo:intro.direction',
    'demo:intro.marketing',
    'demo:closing.pricing.business',
    'demo:closing.pricing.enterprise',
    'demo:insights.toggle',
    'demo:explain.toggle',
    'demo:explain.headerPrefix',
    'demo:explain.boostPrefix',
    'product:page.type.configurable',
    'product:page.type.simple',
    'scenarios:demoDress.steps.1.gain',
    'scenarios:demoDress.steps.5.gain',
    'search:overlay.suggestionsTab',
    'search:overlay.blogTitle',
    'search:page.typeBlog',
  ],
  de: [
    'blog:title',
    'common:nav.cms',
    'common:sort.fields.category__position',
    'demo:intro.marketing',
    'demo:closing.pricing.business',
    'demo:closing.pricing.enterprise',
    'demo:insights.toggle',
    'demo:explain.boostPrefix',
    'demo:eventLog.toggleShow',
    'product:page.material',
    'search:overlay.blogTitle',
  ],
}

describe('the three languages stay in sync', () => {
  it('has en, fr and de', () => {
    expect(LANGS).toEqual(['de', 'en', 'fr'])
  })

  it('has every namespace file in every language', () => {
    for (const lang of OTHERS) {
      const files = readdirSync(join(LOCALES, lang)).map((f) =>
        f.replace(/\.json$/, '')
      )
      expect(files.sort(), lang).toEqual(NAMESPACES)
    }
  })

  it.each(NAMESPACES)('%s: same keys in every language', (ns) => {
    const en = [...load('en', ns).keys()].sort()
    for (const lang of OTHERS) {
      expect([...load(lang, ns).keys()].sort(), lang).toEqual(en)
    }
  })

  it('keeps the {{placeholders}} of every key', () => {
    const broken: string[] = []
    for (const ns of NAMESPACES) {
      const en = load('en', ns)
      for (const lang of OTHERS) {
        load(lang, ns).forEach((value, key) => {
          const want = placeholders(en.get(key) ?? '')
          if (placeholders(value).join() !== want.join())
            broken.push(
              `${lang} ${ns}:${key} has {{${placeholders(
                value
              )}}}, en has {{${want}}}`
            )
        })
      }
    }
    expect(broken).toEqual([])
  })

  it('keeps the length of every list', () => {
    const broken: string[] = []
    for (const ns of NAMESPACES) {
      const en = load('en', ns)
      for (const lang of OTHERS) {
        load(lang, ns).forEach((value, key) => {
          const ref = en.get(key)
          if (
            Array.isArray(ref) &&
            (!Array.isArray(value) || value.length !== ref.length)
          )
            broken.push(`${lang} ${ns}:${key}`)
        })
      }
    }
    expect(broken).toEqual([])
  })

  it('has both plural forms wherever one is used', () => {
    const broken: string[] = []
    for (const lang of LANGS) {
      for (const ns of NAMESPACES) {
        const keys = load(lang, ns)
        for (const key of keys.keys()) {
          if (key.endsWith('_one') && !keys.has(key.replace(/_one$/, '_other')))
            broken.push(`${lang} ${ns}:${key}`)
        }
      }
    }
    expect(broken).toEqual([])
  })

  it('has no empty value', () => {
    const empty: string[] = []
    for (const lang of LANGS) {
      for (const ns of NAMESPACES) {
        load(lang, ns).forEach((value, key) => {
          const parts = [value].flat()
          if (
            parts.length === 0 ||
            parts.some((p) => typeof p !== 'string' || !p.trim())
          )
            empty.push(`${lang} ${ns}:${key}`)
        })
      }
    }
    expect(empty).toEqual([])
  })

  it.each(['fr', 'de'])(
    '%s: strings identical to English are only the approved ones',
    (lang) => {
      const hasWords = (v: string) =>
        /\p{L}/u.test(v.replace(/\{\{[^}]*\}\}/g, ''))
      const identical: string[] = []
      for (const ns of NAMESPACES) {
        const en = load('en', ns)
        load(lang, ns).forEach((value, key) => {
          const ref = en.get(key)
          if (typeof ref === 'string' && hasWords(ref) && value === ref)
            identical.push(`${ns}:${key}`)
        })
      }
      const unapproved = identical.filter(
        (k) => !SAME_AS_ENGLISH[lang].includes(k)
      )
      expect(unapproved).toEqual([])
    }
  )
})

describe('every namespace is loaded', () => {
  it('the client instance has every namespace in every language', () => {
    const missing = LANGS.flatMap((lang) =>
      NAMESPACES.filter((ns) => !i18n.hasResourceBundle(lang, ns)).map(
        (ns) => `${lang}:${ns}`
      )
    )
    expect(missing).toEqual([])
  })

  it('every language a catalog can select has its files', () => {
    for (const lang of [...Object.values(LANGUAGES), DEFAULT_LANGUAGE]) {
      expect(LANGS, lang).toContain(lang)
    }
  })
})
