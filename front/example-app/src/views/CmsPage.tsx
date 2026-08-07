'use client';

import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// Maps a route slug to its i18n key prefix in cms.json.
const CMS_PAGE_KEYS: Record<string, string> = {
  about: 'about',
  'shipping-returns': 'shippingReturns',
  faq: 'faq',
};

export default function CmsPage() {
  const { t } = useTranslation('cms');
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const pageKey = CMS_PAGE_KEYS[slug || 'about'] || CMS_PAGE_KEYS.about;
  const title = t(`${pageKey}.title`);
  const content = t(`${pageKey}.content`, { returnObjects: true }) as string[];

  return (
    <div className="cms-page">
      <div className="page-title">
        <div className="breadcrumb">{t('breadcrumbPrefix', { title })}</div>
      </div>
      <h1>{title}</h1>
      {content.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}
