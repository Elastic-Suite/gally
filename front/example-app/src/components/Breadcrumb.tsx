'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from './LocaleLink';

export interface BreadcrumbPart {
  name: string;
  // Omitted for a part with nowhere to go. The last part is rendered as text whether it
  // carries one or not — it is the page already open.
  href?: string;
}

// The one clickable breadcrumb, shared by the pages that can name their real path: the
// category listing and the PDP. It renders the Home link itself, because every path starts
// there, and marks the last part `aria-current="page"`.
// The pages that still show a single translated string (search, blog, CMS, vector search)
// have no path to build from and keep their `<div className="breadcrumb">`.
export default function Breadcrumb({ parts }: { parts: BreadcrumbPart[] }) {
  const { t } = useTranslation('common');

  return (
    <nav className="breadcrumb" aria-label={t('meta.breadcrumb')}>
      <Link href="/">{t('meta.home')}</Link>
      {parts.map((part, i) => (
        <React.Fragment key={`${part.name}-${i}`}>
          <span className="breadcrumb-sep">/</span>
          {part.href && i < parts.length - 1 ? (
            <Link href={part.href}>{part.name}</Link>
          ) : (
            <span aria-current={i === parts.length - 1 ? 'page' : undefined}>{part.name}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
