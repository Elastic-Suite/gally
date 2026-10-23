// @vitest-environment node
// Pure routing helpers: locale prefixing, catalog resolution, canonical URLs, the API base
// URL, and the catalog-switch decision. See specs/test-plan-routing.md, part B.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const nav = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error('NOT_FOUND')
  }),
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`)
  }),
}))
vi.mock('next/navigation', () => nav)

vi.mock('../sdk/server', () => ({
  resolveLocale: vi.fn(),
  cachedCategoryTree: vi.fn(),
}))

import { withLocale, withoutLocale } from '../contexts/LocaleContext'
import { defaultLocalizedCatalog, findLocalizedCatalog } from '../sdk/catalogs'
import { canonical, languageOf, SITE } from '../sdk/seo'
import { getBaseUri } from '../sdk'
import { missingInCatalog } from '../sdk/catalogSwitch'
import { cachedCategoryTree, resolveLocale } from '../sdk/server'
import { CATALOGS, CATEGORY_TREE } from './fixtures'

describe('withLocale', () => {
  it('prefixes an app path with the locale segment', () => {
    expect(withLocale('com_fr', '/product/VD10')).toBe('/com_fr/product/VD10')
  })

  it('maps the homepage to the bare segment', () => {
    expect(withLocale('com_fr', '/')).toBe('/com_fr')
  })

  it('leaves anything that is not a site-relative path alone', () => {
    for (const href of [
      'https://elasticsuite.io',
      '#top',
      'mailto:a@b.c',
      '?q=x',
    ]) {
      expect(withLocale('com_fr', href)).toBe(href)
    }
  })

  it('is idempotent', () => {
    expect(withLocale('com_fr', '/com_fr/search')).toBe('/com_fr/search')
    expect(withLocale('com_fr', '/com_fr')).toBe('/com_fr')
  })

  it('does not treat a longer code with the same start as already prefixed', () => {
    expect(withLocale('com_fr', '/com_fra/x')).toBe('/com_fr/com_fra/x')
  })
})

describe('withoutLocale', () => {
  it('strips the locale segment', () => {
    expect(withoutLocale('com_fr', '/com_fr/search')).toBe('/search')
  })

  it('returns / for the homepage', () => {
    expect(withoutLocale('com_fr', '/com_fr')).toBe('/')
  })

  it('leaves a path from another locale unchanged', () => {
    expect(withoutLocale('com_fr', '/com_en/search')).toBe('/com_en/search')
    expect(withoutLocale('com_fr', '/blog')).toBe('/blog')
  })

  it('is the inverse of withLocale on app paths', () => {
    for (const path of ['/', '/search', '/category/cat_1', '/blog/42']) {
      expect(withoutLocale('com_fr', withLocale('com_fr', path))).toBe(path)
    }
  })
})

describe('findLocalizedCatalog', () => {
  it('finds a code in any catalog, with its parent catalog', () => {
    const resolved = findLocalizedCatalog(CATALOGS, 'fr_en')
    expect(resolved?.catalog.code).toBe('fr')
    expect(resolved?.localizedCatalog.code).toBe('fr_en')
  })

  it('returns null for an unknown code', () => {
    expect(findLocalizedCatalog(CATALOGS, 'xx_xx')).toBeNull()
  })
})

describe('defaultLocalizedCatalog', () => {
  it("picks the first catalog's isDefault localized catalog", () => {
    expect(defaultLocalizedCatalog(CATALOGS)?.localizedCatalog.code).toBe(
      'com_fr'
    )
  })

  it("falls back to the first catalog's first localized catalog", () => {
    const noDefault = [
      {
        ...CATALOGS[0],
        localizedCatalogs: CATALOGS[0].localizedCatalogs.map((lc) => ({
          ...lc,
          isDefault: false,
        })),
      },
    ]
    expect(defaultLocalizedCatalog(noDefault)?.localizedCatalog.code).toBe(
      'com_en'
    )
  })

  it('returns null with no catalogs, or a catalog with no localized catalog', () => {
    expect(defaultLocalizedCatalog([])).toBeNull()
    expect(
      defaultLocalizedCatalog([{ ...CATALOGS[0], localizedCatalogs: [] }])
    ).toBeNull()
  })
})

describe('canonical and languageOf', () => {
  it('builds SITE/<locale><path>', () => {
    expect(canonical('com_fr')).toBe(`${SITE}/com_fr`)
    expect(canonical('com_fr', '/blog')).toBe(`${SITE}/com_fr/blog`)
  })

  it('maps the catalog locale to the app language, en by default', () => {
    const [comEn, comFr] = CATALOGS[0].localizedCatalogs
    expect(languageOf(comFr)).toBe('fr')
    expect(languageOf(comEn)).toBe('en')
    expect(languageOf({ ...comFr, locale: 'de_DE' })).toBe('de')
    expect(languageOf({ ...comFr, locale: 'it_IT' })).toBe('en')
  })
})

describe('getBaseUri', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://public.test/api')
    vi.stubEnv('SSR_API_URL', 'http://router/api')
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('uses the public URL in the browser', () => {
    vi.stubGlobal('window', {})
    expect(getBaseUri()).toBe('https://public.test/api')
  })

  // This file runs in Node, so there is no window unless a test adds one.
  it('uses SSR_API_URL on the server', () => {
    expect(getBaseUri()).toBe('http://router/api')
  })

  it('falls back to the public URL on the server when SSR_API_URL is unset', () => {
    vi.stubEnv('SSR_API_URL', '')
    expect(getBaseUri()).toBe('https://public.test/api')
  })
})

describe('missingInCatalog (feature-catalog-switch-missing-target)', () => {
  const comFr = findLocalizedCatalog(CATALOGS, 'com_fr')!

  beforeEach(() => {
    vi.mocked(resolveLocale).mockImplementation(async (code: string) =>
      findLocalizedCatalog(CATALOGS, code)
    )
    vi.mocked(cachedCategoryTree).mockResolvedValue(CATEGORY_TREE)
  })

  it('redirects a catalog switch to the given fallback path', async () => {
    await expect(
      missingInCatalog('com_fr', comFr, { from: 'fr_fr' }, '/blog')
    ).rejects.toThrow('REDIRECT:/com_fr/blog')
  })

  it("redirects a catalog switch to this catalog's default listing", async () => {
    await expect(
      missingInCatalog('com_fr', comFr, { from: 'fr_fr' })
    ).rejects.toThrow('REDIRECT:/com_fr/category/cat_1')
  })

  it('redirects to the homepage path when the catalog has no category', async () => {
    // Today this is '/com_fr/' with a trailing slash: defaultListingPath returns '/'.
    vi.mocked(cachedCategoryTree).mockResolvedValue([])
    await expect(
      missingInCatalog('com_fr', comFr, { from: 'fr_fr' })
    ).rejects.toThrow(/^REDIRECT:\/com_fr\/$/)
  })

  it('reads the first value when the marker is repeated', async () => {
    await expect(
      missingInCatalog('com_fr', comFr, { from: ['fr_fr', 'xx'] }, '/blog')
    ).rejects.toThrow('REDIRECT:/com_fr/blog')
  })

  it('is a 404 without the marker', async () => {
    await expect(missingInCatalog('com_fr', comFr, {})).rejects.toThrow(
      'NOT_FOUND'
    )
    await expect(missingInCatalog('com_fr', comFr, undefined)).rejects.toThrow(
      'NOT_FOUND'
    )
  })

  it('is a 404 when the marker names an unknown catalog', async () => {
    await expect(
      missingInCatalog('com_fr', comFr, { from: 'whatever' })
    ).rejects.toThrow('NOT_FOUND')
  })

  it('is a 404 when the marker names the current catalog', async () => {
    await expect(
      missingInCatalog('com_fr', comFr, { from: 'com_fr' })
    ).rejects.toThrow('NOT_FOUND')
  })
})
