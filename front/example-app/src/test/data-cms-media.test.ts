// @vitest-environment node
// Blog articles (cms_page) and media URLs: the non-product data the views show.
// See specs/test-plan-data-layer.md, part C.
import { describe, expect, it } from 'vitest'
import { cmsPageUrl, formatCmsDate, getCmsFields } from '../sdk/cmsFields'
import { mediaUrl } from '../sdk/config'
import type { SearchDocument } from '../sdk/fields'
import { CMS_ARTICLE, PUBLIC_CONFIGURATION } from './fixtures/api'

describe('mediaUrl (feature-public-configuration)', () => {
  const config = { 'gally.base_url.media': 'https://media.test/catalog' }

  it.each([
    [
      'base without slash, path with one',
      'https://media.test/catalog',
      '/a/b.jpg',
    ],
    ['base with slash, path without', 'https://media.test/catalog/', 'a/b.jpg'],
    ['slashes on both sides', 'https://media.test/catalog//', '//a/b.jpg'],
  ])('joins with one slash: %s', (_name, base, path) => {
    expect(mediaUrl({ 'gally.base_url.media': base }, path)).toBe(
      'https://media.test/catalog/a/b.jpg'
    )
  })

  it('takes the first path of a list', () => {
    expect(mediaUrl(config, ['/first.jpg', '/second.jpg'])).toBe(
      'https://media.test/catalog/first.jpg'
    )
  })

  it('keeps absolute URLs as they are', () => {
    expect(mediaUrl(config, 'https://cdn.test/x.jpg')).toBe(
      'https://cdn.test/x.jpg'
    )
    expect(mediaUrl(config, 'http://cdn.test/x.jpg')).toBe(
      'http://cdn.test/x.jpg'
    )
  })

  it('gives an empty string when there is no image', () => {
    for (const path of ['', null, undefined, []]) {
      expect(mediaUrl(config, path as string | null)).toBe('')
    }
  })

  it('uses the fallback host when the configuration has no media base', () => {
    expect(mediaUrl({}, '/a.jpg')).toBe(
      'https://gally.localhost/media/catalog/product/a.jpg'
    )
  })
})

describe('getCmsFields', () => {
  const config = { 'gally.base_url.media': 'https://media.test/' }
  const map = (doc: object | null) =>
    getCmsFields(doc as SearchDocument | null, config)

  it('gives every field a default when the document is missing', () => {
    expect(map(null)).toEqual({
      id: '',
      title: '',
      summary: '',
      content: '',
      urlKey: '',
      image: '',
      contentType: null,
      topic: null,
      author: null,
      publishedAt: '',
      readingTime: null,
      isFeatured: false,
      tags: [],
    })
  })

  it('takes the summary from content_heading, then meta_description', () => {
    expect(map({ content_heading: 'H', meta_description: 'M' }).summary).toBe(
      'H'
    )
    expect(map({ meta_description: 'M' }).summary).toBe('M')
  })

  it('turns a numeric id into a string and the image into a full URL', () => {
    expect(map({ id: 9, image: '/x.jpg' })).toMatchObject({
      id: '9',
      image: 'https://media.test/x.jpg',
    })
  })

  it('maps a captured article', () => {
    const media = PUBLIC_CONFIGURATION['gally.base_url.media'].replace(
      /\/$/,
      ''
    )
    const post = getCmsFields(CMS_ARTICLE, PUBLIC_CONFIGURATION)
    expect(post).toMatchObject({
      id: '9',
      title: 'The Art of Layering Light Fabrics',
      urlKey: 'the-art-of-layering-light-fabrics',
      image: `${media}/default/v/s/vsw09-rn_main.jpg`,
      contentType: { label: 'Blog Post', value: 'blog' },
      topic: { label: 'Style Guide', value: 'style_guide' },
      author: { label: 'Léa Moreau', value: 'lea_moreau' },
      publishedAt: '2026-10-10 14:13:23',
      readingTime: 5,
      isFeatured: false,
    })
    expect(post.summary).toBe(CMS_ARTICLE.content_heading)
    expect(post.content).toMatch(/^<p>/)
    expect(post.tags).toHaveLength(3)
  })
})

describe('cmsPageUrl and formatCmsDate', () => {
  it('builds /blog/<id> with the id encoded', () => {
    expect(cmsPageUrl('9')).toBe('/blog/9')
    expect(cmsPageUrl('a b/c')).toBe('/blog/a%20b%2Fc')
  })

  it('gives an empty string for an empty or invalid date', () => {
    expect(formatCmsDate('', 'en')).toBe('')
    expect(formatCmsDate('not a date', 'en')).toBe('')
  })

  it("accepts the API's `YYYY-MM-DD HH:MM:SS` form", () => {
    // The month name depends on the runtime's locale data, so only the year and day are checked.
    const formatted = formatCmsDate('2026-10-10 14:13:23', 'en')
    expect(formatted).toContain('2026')
    expect(formatted).toContain('10')
  })
})
