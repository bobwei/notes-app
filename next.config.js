require('dotenv/config');
const withCSS = require('@zeit/next-css');
const R = require('ramda');

module.exports = withCSS({
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
});
