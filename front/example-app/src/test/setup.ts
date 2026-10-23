// Loaded before every test file (vitest.config.mts -> setupFiles). Kept light: it runs once
// per file, in Node files too. A test that renders translated text imports '../i18n' itself.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
