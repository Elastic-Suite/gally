import { useState, type ReactNode } from 'react'

export interface TabItem {
  label: string
  content: ReactNode
}

export function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(0)

  if (!items.length) return null

  return (
    <div>
      <div role="tablist" className="flex gap-6 border-b border-line-200">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={`-mb-px border-b-2 py-3 text-sm font-medium ${
              active === index
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-ink-900/60 hover:text-ink-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="py-6">
        {items[active].content}
      </div>
    </div>
  )
}
