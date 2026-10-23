// @vitest-environment node
// Structural rules from the specs, checked by reading the source. Each rule names the spec
// that states it. A failure here means a file broke a rule that fails silently at runtime,
// or that a new exception needs a decision - add it to the list only once it is justified.
// See specs/test-plan-routing.md, part A.
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, relative, resolve } from 'path'
import { describe, expect, it } from 'vitest'

const ROOT = resolve(__dirname, '../..')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

// Source files under app/ and src/, as paths relative to the app root. Tests excluded.
function sourceFiles(...dirs: string[]): string[] {
  return dirs
    .flatMap((dir) => walk(join(ROOT, dir)))
    .filter((p) => /\.(ts|tsx)$/.test(p) && !/\.test\.tsx?$/.test(p))
    .map((p) => relative(ROOT, p))
    .sort()
}

function read(file: string): string {
  return readFileSync(join(ROOT, file), 'utf8')
}

// Comments removed, so a rule is not tripped by a comment explaining it.
function code(file: string): string {
  return read(file)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
}

function startsWithUseClient(file: string): boolean {
  return /^\s*['"]use client['"]/.test(code(file))
}

const ALL = sourceFiles('app', 'src')

function filesMatching(pattern: RegExp): string[] {
  return ALL.filter((file) => pattern.test(code(file)))
}

describe('render boundary (AGENTS.md)', () => {
  it('only app/providers.tsx is a client component under app/', () => {
    const client = sourceFiles('app').filter(startsWithUseClient)
    expect(client).toEqual(['app/providers.tsx'])
  })

  it("every view in src/views starts with 'use client'", () => {
    const views = sourceFiles('src/views').filter((f) => f.endsWith('.tsx'))
    expect(views.length).toBeGreaterThan(0)
    expect(views.filter((f) => !startsWithUseClient(f))).toEqual([])
  })

  it('no route file imports the client i18n instance (feature-metadata-all-routes)', () => {
    const importsI18n = sourceFiles('app').filter((f) =>
      /from\s+['"][./]*src\/i18n['"/]|import\s+['"][./]*src\/i18n['"]/.test(
        code(f)
      )
    )
    expect(importsI18n).toEqual(['app/providers.tsx'])
  })
})

describe('locale segment (feature-locale-segment-phase2)', () => {
  it('Link is imported from next/link only in LocaleLink', () => {
    // A default import is the Link component. Named hooks such as useLinkStatus are fine.
    expect(
      filesMatching(
        /import\s+\w+\s*(,\s*\{[^}]*\})?\s*from\s+['"]next\/link['"]/
      )
    ).toEqual(['src/components/LocaleLink.tsx'])
  })

  it('raw usePathname() is used only in the files that need the full path', () => {
    // Anything comparing against an app path must use useAppPathname()
    // (bugfix-nav-active-locale-pathname). These files use the raw path for other reasons.
    expect(filesMatching(/\busePathname\(\)/)).toEqual([
      'src/components/ScrollToTop.tsx',
      'src/contexts/CatalogContext.tsx',
      'src/contexts/LocaleContext.tsx',
      'src/contexts/NavigationContext.tsx',
      'src/views/BlogPage.tsx',
    ])
  })

  it('router.push is called only where the target already has the locale', () => {
    // BlogPage pushes a pathname that carries the segment; CartPage goes through
    // localeHref; NavigationContext is useNavigate, whose callers prefix.
    expect(filesMatching(/\brouter\.push\(/)).toEqual([
      'src/contexts/NavigationContext.tsx',
      'src/views/BlogPage.tsx',
      'src/views/CartPage.tsx',
    ])
    expect(code('src/views/CartPage.tsx')).not.toMatch(
      /router\.push\((?!localeHref\()/
    )
  })

  it('CatalogContext keeps no catalog state: the URL is the state', () => {
    expect(code('src/contexts/CatalogContext.tsx')).not.toMatch(/\buseState\b/)
  })

  it('no source hard-codes the /example base path (feature-nextjs-migration-phase1)', () => {
    // seo.ts holds the one fallback origin, which is a full URL, not a path.
    expect(filesMatching(/['"`]\/example\b/)).toEqual([])
  })

  it('SITE is declared only in src/sdk/seo.ts (feature-metadata-all-routes)', () => {
    expect(filesMatching(/\bconst\s+SITE\b/)).toEqual(['src/sdk/seo.ts'])
  })
})

describe('server rendering (bugfix-ssr-product-list-behind-suspense, bugfix-dynamic-ssr-false-bailout)', () => {
  it('no loading.tsx under app/[locale]', () => {
    const loading = walk(join(ROOT, 'app')).filter((p) =>
      p.endsWith('loading.tsx')
    )
    expect(loading.map((p) => relative(ROOT, p))).toEqual([])
  })

  it('no next/dynamic ssr: false', () => {
    expect(filesMatching(/ssr\s*:\s*false/)).toEqual([])
  })
})
