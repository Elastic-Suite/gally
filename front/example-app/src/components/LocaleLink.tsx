'use client';

import NextLink from 'next/link';
import { ComponentProps } from 'react';
import { useLocale, withLocale } from '../contexts/LocaleContext';

type LocaleLinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  href: string;
};

// Drop-in replacement for next/link that prefixes the locale segment, so call sites keep
// writing href="/product/VD10" and never have to thread the current locale through.
// Phase 2 swapped every in-app `import Link from 'next/link'` to this; importing
// next/link directly in a page or component is now a bug — the link would drop out of
// the current catalog and silently reset the visitor to the default one.
export default function LocaleLink({ href, ...rest }: LocaleLinkProps) {
  const locale = useLocale();
  return <NextLink href={withLocale(locale, href)} {...rest} />;
}
