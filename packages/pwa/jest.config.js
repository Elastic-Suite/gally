module.exports = {
  collectCoverageFrom: [
    '<rootDir>/components/**/*.{jsx,tsx,js,ts}',
    '<rootDir>/hooks/**/*.{jsx,tsx,js,ts}',
    // '<rootDir>/pages/**/*.{jsx,tsx,js,ts}',
    '<rootDir>/services/**/*.{jsx,tsx,js,ts}',
    '<rootDir>/store/**/*.{jsx,tsx,js,ts}',
    '!<rootDir>/components/stateful*/**/*.{jsx,tsx,js,ts}',
    '!<rootDir>/**/*.stories.{jsx,tsx,js,ts}',
  ],
  setupFilesAfterEnv: ['./setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      './node_modules/babel-jest',
      { configFile: './babel.jest.config.json' },
    ],
    '^.+\\.css$': './config/jest/cssTransform.js',
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/config/jest/fileTransformer.js',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^~/(.*)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary', 'cobertura'],
  coverageDirectory: '<rootDir>/coverage',
}
