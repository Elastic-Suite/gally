'use client';

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from './LocaleLink';
import { useCatalog } from '../contexts/CatalogContext';
import { ICategoryNode } from '../sdk/catalogs';
import { findTrail } from '../sdk/categoryTree';

// No activeCode prop: this renders from app/[locale]/category/layout.tsx, whose segment
// has no [code], and from the homepage, which has no active category at all. Reading the
// route directly keeps it correct in both places without threading a prop through.
export default function CategoryNav() {
  const { categories } = useCatalog();
  const params = useParams();
  const activeCode = Array.isArray(params.code) ? params.code[0] : params.code;

  // The whole ancestor chain, not just the active id: a top-level item has to light up while
  // one of its subcategories is being viewed, and the active row inside a submenu can sit at
  // any depth. Same function the route guard and the JSON-LD breadcrumb use.
  const trail = useMemo(
    () => new Set((activeCode ? findTrail(categories, activeCode) : null)?.map(n => String(n.id))),
    [categories, activeCode]
  );

  if (categories.length === 0) return null;

  return (
    <nav className="category-nav">
      <ul className="category-nav-list">
        {categories.map(cat => (
          <CategoryItem key={cat.id} cat={cat} activeCode={activeCode} trail={trail} />
        ))}
      </ul>
    </nav>
  );
}

// `active` is the category being viewed, `in-trail` an ancestor of it — same pill, and the
// active one is bolder. Both read from the trail so depth never matters.
function linkClass(id: string, activeCode: string | undefined, trail: Set<string>): string {
  if (activeCode === id) return 'active';
  return trail.has(id) ? 'in-trail' : '';
}

function CategoryItem({
  cat, activeCode, trail,
}: { cat: ICategoryNode; activeCode?: string; trail: Set<string> }) {
  const [open, setOpen] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;

  // Hover handled on the <li>, not on the <a> and the <ul> separately: the flyout is a DOM
  // descendant of the item, so mouseleave does not fire while the pointer moves into the menu.
  // The flyout hangs directly off this item (`top: 100%`) and therefore paints over the nav row
  // underneath when the bar has wrapped — that is deliberate, see the spec.
  return (
    <li
      className="category-nav-item"
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={`/category/${cat.id}`}
        className={linkClass(cat.id, activeCode, trail)}
        aria-current={activeCode === cat.id ? 'page' : undefined}
      >
        {cat.name} {cat.count > 0 && <span style={{ opacity: 0.5, fontSize: '0.8em' }}>({cat.count})</span>}
      </Link>
      {hasChildren && open && (
        <ul className="category-nav-submenu">
          {cat.children!.map(child => (
            <li key={child.id}>
              <Link
                href={`/category/${child.id}`}
                className={linkClass(child.id, activeCode, trail)}
                aria-current={activeCode === child.id ? 'page' : undefined}
              >
                {child.name} <span style={{ opacity: 0.5, fontSize: '0.8em' }}>({child.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
