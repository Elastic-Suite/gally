'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from './LocaleLink';
import { useCatalog } from '../contexts/CatalogContext';
import { ICategoryNode } from '../sdk/catalogs';

// No activeCode prop: this renders from app/[locale]/category/layout.tsx, whose segment
// has no [code], and from the homepage, which has no active category at all. Reading the
// route directly keeps it correct in both places without threading a prop through.
export default function CategoryNav() {
  const { categories } = useCatalog();
  const params = useParams();
  const activeCode = Array.isArray(params.code) ? params.code[0] : params.code;

  if (categories.length === 0) return null;

  return (
    <nav className="category-nav">
      <ul className="category-nav-list">
        {categories.map(cat => (
          <CategoryItem key={cat.id} cat={cat} activeCode={activeCode} />
        ))}
      </ul>
    </nav>
  );
}

function CategoryItem({ cat, activeCode }: { cat: ICategoryNode; activeCode?: string }) {
  const [open, setOpen] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;

  return (
    <li className="category-nav-item">
      <Link
        href={`/category/${cat.id}`}
        className={activeCode === cat.id ? 'active' : ''}
        onMouseEnter={() => hasChildren && setOpen(true)}
        onMouseLeave={() => hasChildren && setOpen(false)}
      >
        {cat.name} {cat.count > 0 && <span style={{ opacity: 0.5, fontSize: '0.8em' }}>({cat.count})</span>}
      </Link>
      {hasChildren && open && (
        <ul className="category-nav-submenu" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
          {cat.children!.map(child => (
            <li key={child.id}>
              <Link href={`/category/${child.id}`} className={activeCode === child.id ? 'active' : ''}>
                {child.name} <span style={{ opacity: 0.5, fontSize: '0.8em' }}>({child.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
