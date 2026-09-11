'use client';

import NextLink from 'next/link';
import { ComponentProps } from 'react';
import { useLocale, withLocale } from '../contexts/LocaleContext';
import { LinkPendingReporter } from '../contexts/NavigationContext';

type LocaleLinkProps = Omit<ComponentProps<typeof NextLink>, 'href'> & {
  href: string;
};

// Drop-in replacement for next/link that prefixes the locale segment, so call sites keep
// writing href="/product/VD10" and never have to thread the current locale through.
// Phase 2 swapped every in-app `import Link from 'next/link'` to this; importing
// next/link directly in a page or component is now a bug — the link would drop out of
// the current catalog and silently reset the visitor to the default one.
export default function LocaleLink({ href, children, ...rest }: LocaleLinkProps) {
  const locale = useLocale();
  const target = withLocale(locale, href);

  return (
    <NextLink href={target} {...rest}>
      {children}
      {/* Renders no DOM. It has to sit inside the link because that is the only place
          useLinkStatus() can see the navigation — which is now the app's only source of
          "a click is waiting on the server". See src/contexts/NavigationContext.tsx. */}
      <LinkPendingReporter href={target} />
    </NextLink>
  );
}
