import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '../contexts/CatalogContext';
import { ICategoryNode } from '../sdk/catalogs';

interface Props {
  activeCode?: string;
}

export default function CategoryNav({ activeCode }: Props) {
  const { categories } = useCatalog();

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
        to={`/category/${cat.id}`}
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
              <Link to={`/category/${child.id}`} className={activeCode === child.id ? 'active' : ''}>
                {child.name} <span style={{ opacity: 0.5, fontSize: '0.8em' }}>({child.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
