import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Unit and component tests only. Route files under app/ are async server components, which
// jsdom cannot render - those belong to the Playwright suite in front/e2e.
// See specs/chore-vitest-setup.md.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // Each test renders into a fresh document; restoreMocks keeps vi.spyOn from leaking.
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      // app/ counts too: the route files are tested by routes.test.tsx and providers.test.tsx.
      include: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**'],
      // cobertura-coverage.xml is the file the CI coverage step read before it was turned
      // off (commit 85699ecb); re-enabling that step needs no path change.
      reporter: ['text-summary', 'cobertura'],
    },
  },
})
