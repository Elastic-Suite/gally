module.exports = {
  collectCoverageFrom: [
    'src/hooks/**/*.{jsx,tsx,js,ts}',
    'src/services/**/*.{jsx,tsx,js,ts}',
  ],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary', 'cobertura'],
  coverageDirectory: 'coverage',
}
