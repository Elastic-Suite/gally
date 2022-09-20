module.exports = {
  collectCoverageFrom: ['<rootDir>/services/**/*.{jsx,tsx,js,ts}'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary', 'cobertura'],
  coverageDirectory: '<rootDir>/coverage',
}
