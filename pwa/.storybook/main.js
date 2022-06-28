/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    config.resolve.extensions = [...config.resolve.extensions, '.css', '.scss']
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.resolve(__dirname, '..'),
      '/assets': path.resolve(__dirname, '..', 'assets'),
    }
    config.resolve.fallback = {
      fs: false,
      tls: false,
      net: false,
      module: false,
      path: require.resolve('path-browserify'),
      loadPath: '/locales/en/common.json',
    }
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    })
    return config
  },
}
