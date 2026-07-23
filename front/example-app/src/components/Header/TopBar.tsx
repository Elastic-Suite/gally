import { COUNTRIES, LANGUAGES } from '../../context/locale-context'
import { useLocale } from '../../hooks/useLocale'
import type { Country, Locale } from '../../data/types'

export function TopBar() {
  const { country, language, setCountry, setLanguage } = useLocale()

  return (
    <div className="border-b border-white/10 bg-brand-900 text-paper-50">
      <div className="mx-auto flex max-w-7xl items-center justify-end gap-4 px-4 py-1.5 text-xs sm:px-6 lg:px-8">
        <label className="flex items-center gap-1.5">
          <span className="sr-only">Country</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as Country)}
            className="rounded bg-transparent py-0.5 text-paper-50 [&>option]:text-ink-900"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          <span className="sr-only">Language</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Locale)}
            className="rounded bg-transparent py-0.5 text-paper-50 [&>option]:text-ink-900"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}
