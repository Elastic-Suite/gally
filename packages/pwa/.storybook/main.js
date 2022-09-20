/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('path')

module.exports = {
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials', 'storybook-addon-next-router'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  staticDirs: ['../public'],
  webpackFinal: (config) => {
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
