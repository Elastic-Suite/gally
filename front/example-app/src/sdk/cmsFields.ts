import { MEDIA_BASE_URL } from './index';

// Extracted from ../hooks/useCms.ts for the same reason getProductFields moved here:
// that module imports React hooks, so importing anything out of it into a Server
// Component fails with "You're importing a module that depends on useEffect into a
// React Server Component". These are plain data mappers with no React in them, and both
// the server shells and the client hooks need them.

export interface CmsOption {
  value: string;
  label: string;
}

export interface CmsPage {
  id: string;
  title: string;
  summary: string;
  content: string;
  urlKey: string;
  image: string;
  contentType: CmsOption | null;
  topic: CmsOption | null;
  author: CmsOption | null;
  publishedAt: string;
  readingTime: number | null;
  isFeatured: boolean;
  tags: CmsOption[];
}

// getCollection() hands back the _source already flattened and projected to CMS_FIELDS
// — no { data: { _source } } envelope survives, and `_id`/`_score` are not reachable.
// The document's own `id` attribute is indexed, so it comes through CMS_FIELDS instead.
export function getCmsFields(doc: any): CmsPage {
  const src = doc ?? {};
  return {
    id: String(src.id ?? ''),
    title: src.title ?? '',
    summary: src.content_heading ?? src.meta_description ?? '',
    content: src.content ?? '',
    urlKey: src.url_key ?? '',
    // CMS illustrations are product media paths, so they need the same prefixing
    // as a product image.
    image: src.image ? `${MEDIA_BASE_URL}${src.image}` : '',
    contentType: src.content_type ?? null,
    topic: src.topic ?? null,
    author: src.author ?? null,
    publishedAt: src.published_at ?? '',
    readingTime: src.reading_time ?? null,
    isFeatured: !!src.is_featured,
    tags: src.tags ?? [],
  };
}

export const cmsPageUrl = (id: string) => `/blog/${encodeURIComponent(id)}`;

export function formatCmsDate(value: string, language: string): string {
  if (!value) return '';
  // published_at comes back as "2026-08-05 15:14:01" — Safari won't parse that with a
  // space, so normalize to ISO before handing it to Date.
  const date = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' });
}

