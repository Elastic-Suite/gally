// @vitest-environment node
// Every translation key the code asks for exists - literal keys found in the source, and keys built
// at runtime, checked from the lists they are built from. See specs/test-plan-translations.md, part C.
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, relative, resolve } from 'path'
import { describe, expect, it } from 'vitest'
import { tServer, tServerFirst } from '../sdk/serverI18n'
import { getProductBadges, getProductFields } from '../sdk/productFields'
import type { SearchDocument } from '../sdk/fields'
import demoDress from '../scenarios/demo-dress'

const ROOT = resolve(__dirname, '../..')
const LOCALES = join(ROOT, 'src/locales')
const LANGS = ['en', 'fr', 'de']

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

const SOURCES = ['app', 'src']
  .flatMap((d) => walk(join(ROOT, d)))
  .filter((p) => /\.tsx?$/.test(p) && !/\.test\.tsx?$/.test(p))

const read = (file: string) => readFileSync(join(ROOT, file), 'utf8')

const bundles = new Map<string, Record<string, unknown>>()
function bundle(lang: string, ns: string): Record<string, unknown> | undefined {
  const id = `${lang}:${ns}`
  if (!bundles.has(id)) {
    try {
      bundles.set(
        id,
        JSON.parse(readFileSync(join(LOCALES, lang, `${ns}.json`), 'utf8'))
      )
    } catch {
      return undefined
    }
  }
  return bundles.get(id)
}

function lookup(lang: string, ns: string, key: string): unknown {
  return key
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === 'object'
          ? (node as Record<string, unknown>)[part]
          : undefined,
      bundle(lang, ns)
    )
}

// A key exists as itself or as a plural pair.
const exists = (lang: string, ns: string, key: string) =>
  [key, `${key}_one`, `${key}_other`].some(
    (k) => lookup(lang, ns, k) !== undefined
  )

describe('literal keys in the source', () => {
  it("every t('key') exists in its file's namespace", () => {
    const missing: string[] = []
    let checked = 0
    for (const path of SOURCES) {
      const src = readFileSync(path, 'utf8')
      // Namespaces from every useTranslation(...) call in the file; 'common' when there is none.
      const declared = [
        ...src.matchAll(/useTranslation\(\s*(?:'([^']+)'|\[([^\]]+)\])?/g),
      ].flatMap((m) =>
        m[1]
          ? [m[1]]
          : m[2]
          ? [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1])
          : ['common']
      )
      const namespaces = declared.length ? declared : ['common']
      for (const [, raw] of src.matchAll(/\bt\(\s*'([^']+)'/g)) {
        checked++
        const [ns, key] = raw.includes(':')
          ? [[raw.slice(0, raw.indexOf(':'))], raw.slice(raw.indexOf(':') + 1)]
          : [namespaces, raw]
        if (!ns.some((n) => exists('en', n, key)))
          missing.push(`${relative(ROOT, path)}: ${ns.join('|')}:${key}`)
      }
    }
    // Guard against the scan silently matching nothing.
    expect(checked).toBeGreaterThan(250)
    expect(missing).toEqual([])
  })

  it('every literal tServer key exists, and the server helper loads it, in every language', () => {
    // tServer quietly returns its English default when a key is missing, so a typo in page
    // metadata would never show.
    const calls = SOURCES.flatMap((path) =>
      [
        ...readFileSync(path, 'utf8').matchAll(
          /tServer(?:First)?\(\s*[\w.]+\s*,\s*'([^']+)'\s*,\s*'([^']+)'/g
        ),
      ].map((m) => ({ file: relative(ROOT, path), ns: m[1], key: m[2] }))
    )
    expect(calls.length).toBeGreaterThan(10)
    const broken: string[] = []
    for (const { file, ns, key } of calls) {
      for (const lang of LANGS) {
        const value = lookup(lang, ns, key)
        if (value === undefined) {
          broken.push(
            `${file}: ${lang} ${ns}:${key} missing from the locale file`
          )
          continue
        }
        if (tServerFirst(lang, ns, key) === undefined)
          broken.push(
            `${file}: ${lang} ${ns}:${key} not readable on the server`
          )
        // A plain string must come back as this language's own value, not the English
        // fallback - that proves the server loads this namespace for this language.
        if (
          typeof value === 'string' &&
          !value.includes('{{') &&
          tServer(lang, ns, key, '__FALLBACK__') !== value
        )
          broken.push(`${file}: ${lang} ${ns}:${key} not loaded on the server`)
      }
    }
    expect(broken).toEqual([])
  })
})

describe('keys built at runtime', () => {
  it('product badges', () => {
    const fields = getProductFields(
      {
        new: true,
        sale: true,
        fashion_material: [{ label: 'Wool' }],
      } as unknown as SearchDocument,
      {}
    )
    const keys = getProductBadges(fields).map((b) => b.key)
    expect(keys).toHaveLength(3)
    for (const lang of LANGS)
      for (const key of keys)
        expect(exists(lang, 'product', key), `${lang} ${key}`).toBe(true)
  })

  it('checkout steps', () => {
    const list = read('src/views/CheckoutPage.tsx').match(
      /const STEP_KEYS = \[([^\]]+)\]/
    )
    const steps = [...(list?.[1] ?? '').matchAll(/'([^']+)'/g)].map((m) => m[1])
    expect(steps).toEqual(['cart', 'details', 'confirmation'])
    for (const lang of LANGS)
      for (const step of steps)
        expect(
          exists(lang, 'cart', `checkout.steps.${step}`),
          `${lang} ${step}`
        ).toBe(true)
  })

  it('the guided scenario', () => {
    // src/scenarios holds one scenario today; a second one needs its keys checked too.
    expect(readdirSync(join(ROOT, 'src/scenarios')).sort()).toEqual([
      'demo-dress.ts',
      'types.ts',
    ])
    const base = demoDress.i18nKey
    const keys = [
      'description',
      'personas.customer.role',
      'personas.merchant.name',
      'personas.merchant.role',
      ...demoDress.steps.flatMap((s) =>
        ['title', 'bubble', 'gain'].map((p) => `${s.i18nKey}.${p}`)
      ),
    ]
    for (const lang of LANGS)
      for (const key of keys)
        expect(
          exists(lang, 'scenarios', `${base}.${key}`),
          `${lang} ${key}`
        ).toBe(true)
  })

  it('CMS pages: both lists agree and every page has a title', () => {
    const keysOf = (file: string) => {
      const body =
        read(file).match(/const CMS_PAGE_KEYS[^{]*\{([^}]+)\}/)?.[1] ?? ''
      return Object.fromEntries(
        [...body.matchAll(/'?([\w-]+)'?\s*:\s*'([^']+)'/g)].map((m) => [
          m[1],
          m[2],
        ])
      )
    }
    const route = keysOf('app/[locale]/cms/[slug]/page.tsx')
    expect(route).toEqual({
      about: 'about',
      'shipping-returns': 'shippingReturns',
      faq: 'faq',
    })
    expect(keysOf('src/views/CmsPage.tsx')).toEqual(route)
    for (const lang of LANGS)
      for (const key of Object.values(route))
        expect(exists(lang, 'cms', `${key}.title`), `${lang} ${key}`).toBe(true)
  })
})
