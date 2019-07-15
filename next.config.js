/* eslint-disable import/no-extraneous-dependencies */
require('dotenv/config');
const withPlugins = require('next-compose-plugins');
const withCSS = require('@zeit/next-css');
const withTM = require('next-transpile-modules');
const R = require('ramda');

module.exports = withPlugins([
  [
    withCSS,
    {
      target: 'server',
      env: R.pipe(
        R.pick(['FIREBASE_CONFIG']),
        R.evolve({
          FIREBASE_CONFIG: (val) => JSON.parse(Buffer.from(val, 'base64').toString()),
        }),
      )(process.env),
      webpack: (config) => {
        config.module.rules.push({
          test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: '[name].[ext]',
            },
          },
        });
        return config;
      },
    },
  ],
  [
    withTM,
    {
      transpileModules: ['@project/core'],
    },
  ],
]);
